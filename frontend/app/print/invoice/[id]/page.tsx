'use client';

import { use, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ArrowLeft, Download, X } from 'lucide-react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { ME_QUERY, type Me } from '@/graphql/auth/mutations';
import { formatDate, formatMoney, formatNumber } from '@/lib/format';
import { PAYMENT_METHOD, SALE_STATUS, label } from '@/lib/labels';
import { downloadPdf } from '@/lib/export-pdf';

const SALE_FOR_INVOICE = gql`
  query SaleForInvoice($id: ID!) {
    sale(id: $id) {
      id
      saleDate
      status
      customerId
      customerName
      totalAmount
      paidAmount
      remainingAmount
      observation
      items {
        id
        description
        quantity
        unitPrice
        weightKg
        pricePerKg
        totalPrice
        rabbitCode
        lotCode
      }
      payments {
        id
        amount
        method
        paymentDate
        reference
      }
    }
    customers {
      id
      name
      phone
      address
      email
    }
  }
`;

interface InvoiceData {
  sale: {
    id: string;
    saleDate: string;
    status: string;
    customerId: string | null;
    customerName: string | null;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    observation: string | null;
    items: Array<{ id: string; description: string; quantity: number; unitPrice: number; weightKg: number | null; pricePerKg: number | null; totalPrice: number; rabbitCode: string | null; lotCode: string | null }>;
    payments: Array<{ id: string; amount: number; method: string; paymentDate: string; reference: string | null }>;
  };
  customers: Array<{ id: string; name: string; phone: string | null; address: string | null; email: string | null }>;
}

/** Numéro lisible et stable : date de vente + début de l'identifiant. */
function invoiceNumber(sale: { id: string; saleDate: string }) {
  return `${sale.saleDate.slice(0, 10).replace(/-/g, '')}-${sale.id.slice(0, 6).toUpperCase()}`;
}

function Invoice({ id }: { id: string }) {
  const router = useRouter();
  const sheet = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const { data, loading, error } = useQuery<InvoiceData>(SALE_FOR_INVOICE, { variables: { id } });
  const { data: meData } = useQuery<{ me: Me }>(ME_QUERY);

  /** Retour à la page précédente, ou aux ventes si le reçu a été ouvert directement. */
  const close = () => (window.history.length > 1 ? router.back() : router.push('/sales'));

  const closeBar = (
    <div data-pdf-hidden className="mb-6 flex flex-wrap items-center justify-between gap-2 print:hidden">
      <button
        type="button"
        onClick={close}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft size={16} /> Retour
      </button>
      <div className="flex gap-2">
        {data && (
          <button
            type="button"
            disabled={downloading}
            onClick={async () => {
              if (!sheet.current || !data) return;
              setDownloading(true);
              setPdfError(null);
              try {
                const kind = data.sale.remainingAmount <= 0 ? 'recu' : 'facture';
                await downloadPdf(sheet.current, `${kind}-${invoiceNumber(data.sale)}`);
              } catch (e) {
                setPdfError(e instanceof Error ? e.message : 'Le PDF n’a pas pu être créé.');
              } finally {
                setDownloading(false);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <Download size={16} /> {downloading ? 'Préparation…' : 'Télécharger en PDF'}
          </button>
        )}
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          title="Fermer"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>
      {pdfError && <p className="w-full text-sm text-red-700">{pdfError}</p>}
    </div>
  );

  if (loading) return <p className="p-8 text-slate-500">Chargement…</p>;
  if (error || !data)
    return (
      <div className="mx-auto max-w-3xl p-6">
        {closeBar}
        <p className="text-red-700">Vente introuvable.</p>
      </div>
    );

  const { sale } = data;
  const customer = data.customers.find((item) => item.id === sale.customerId);
  const farm = meData?.me.farm;
  const paid = sale.remainingAmount <= 0;
  const title = paid ? 'Reçu' : 'Facture';

  return (
    <div className="mx-auto max-w-3xl p-4 text-sm text-slate-800 sm:p-6 print:max-w-none print:p-0">
      {closeBar}
      <div ref={sheet} className="bg-white p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <p className="text-2xl font-bold text-emerald-700">{farm?.name ?? 'RabbitFarm'}</p>
          {farm?.location && <p className="text-slate-600">{farm.location}</p>}
          {meData && <p className="text-slate-600">{meData.me.firstName} {meData.me.lastName} · {meData.me.email}</p>}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold uppercase tracking-wide">{title}</p>
          <p>N° {invoiceNumber(sale)}</p>
          <p>Date : {formatDate(sale.saleDate)}</p>
          <p>Statut : {label(SALE_STATUS, sale.status)}</p>
        </div>
      </header>

      <section className="py-6">
        <p className="text-xs font-semibold uppercase text-slate-500">Client</p>
        <p className="font-semibold">{customer?.name ?? sale.customerName ?? 'Client de passage'}</p>
        {customer?.phone && <p>{customer.phone}</p>}
        {customer?.address && <p>{customer.address}</p>}
        {customer?.email && <p>{customer.email}</p>}
      </section>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-300 text-left">
            <th className="py-2">Désignation</th>
            <th className="py-2 text-right">Qté / poids</th>
            <th className="py-2 text-right">Prix</th>
            <th className="py-2 text-right">Montant</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item) => (
            <tr key={item.id} className="border-b border-slate-200">
              <td className="py-2">{item.description}</td>
              <td className="py-2 text-right">{item.weightKg ? `${formatNumber(item.weightKg)} kg` : item.quantity}</td>
              <td className="py-2 text-right">{item.pricePerKg ? `${formatMoney(item.pricePerKg)}/kg` : formatMoney(item.unitPrice)}</td>
              <td className="py-2 text-right">{formatMoney(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="pt-4 text-right font-semibold">Total</td>
            <td className="pt-4 text-right text-base font-bold">{formatMoney(sale.totalAmount)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-right">Déjà payé</td>
            <td className="text-right">{formatMoney(sale.paidAmount)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-right font-semibold">Reste à payer</td>
            <td className="text-right font-semibold">{formatMoney(sale.remainingAmount)}</td>
          </tr>
        </tfoot>
      </table>

      {sale.payments.length > 0 && (
        <section className="mt-8">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Paiements reçus</p>
          <ul className="space-y-1">
            {sale.payments.map((payment) => (
              <li key={payment.id}>
                {formatDate(payment.paymentDate)} · {label(PAYMENT_METHOD, payment.method)} · {formatMoney(payment.amount)}
                {payment.reference ? ` · réf. ${payment.reference}` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      {sale.observation && <p className="mt-6 text-slate-600">Note : {sale.observation}</p>}

      <footer className="mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
        {paid ? 'Merci pour votre achat.' : 'Merci de régler le reste à payer à la livraison ou selon l’accord convenu.'} Document édité avec RabbitFarm.
      </footer>
      </div>
    </div>
  );
}

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <Invoice id={id} />
    </AuthGuard>
  );
}
