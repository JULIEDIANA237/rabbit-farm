"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  Button,
  Card,
  ErrorBox,
  Field,
  FormGrid,
  Input,
  Textarea,
} from "@/components/ui/kit";
import { formatDate, formatMoney } from "@/lib/format";
import {
  PLAN_LABEL,
  days,
  type AccessStatus,
  type Plan,
} from "@/lib/subscription";

const SUBSCRIPTION_ADMIN = gql`
  query SubscriptionAdmin {
    subscriptionAdmin {
      revenue30d
      revenueTotal
      payingFarms
      trialFarms
      expiredFarms
      settings {
        trialDays
        monthlyPrice
        yearlyPrice
        paymentInstructions
      }
      pendingPayments {
        id
        farmName
        plan
        amount
        reference
        createdAt
      }
      farms {
        farmId
        farmName
        ownerEmail
        memberEmails
        createdAt
        status
        daysLeft
        trialEndsAt
        paidUntil
        freeAccess
      }
    }
  }
`;
const UPDATE_SETTINGS = gql`
  mutation UpdatePlatformSettings($input: PlatformSettingsInput!) {
    updatePlatformSettings(input: $input) {
      trialDays
    }
  }
`;
const CONFIRM = gql`
  mutation ConfirmSubscriptionPayment($id: ID!) {
    confirmSubscriptionPayment(id: $id) {
      id
    }
  }
`;
const REJECT = gql`
  mutation RejectSubscriptionPayment($id: ID!) {
    rejectSubscriptionPayment(id: $id) {
      id
    }
  }
`;
const ACTIVATE = gql`
  mutation ActivateSubscription($farmId: ID!, $plan: SubscriptionPlan!) {
    activateSubscription(farmId: $farmId, plan: $plan)
  }
`;
const EXTEND = gql`
  mutation ExtendTrial($farmId: ID!, $days: Int!) {
    extendTrial(farmId: $farmId, days: $days)
  }
`;
const FREE = gql`
  mutation SetFarmFreeAccess($farmId: ID!, $free: Boolean!) {
    setFarmFreeAccess(farmId: $farmId, free: $free)
  }
`;

type Settings = {
  trialDays: number;
  monthlyPrice: number;
  yearlyPrice: number;
  paymentInstructions?: string | null;
};
type FarmRow = {
  farmId: string;
  farmName: string;
  ownerEmail?: string | null;
  memberEmails: string[];
  createdAt: string;
  status: AccessStatus;
  daysLeft: number;
  trialEndsAt: string;
  paidUntil?: string | null;
  freeAccess: boolean;
};
type Admin = {
  revenue30d: number;
  revenueTotal: number;
  payingFarms: number;
  trialFarms: number;
  expiredFarms: number;
  settings: Settings;
  pendingPayments: {
    id: string;
    farmName?: string | null;
    plan: Plan;
    amount: number;
    reference?: string | null;
    createdAt: string;
  }[];
  farms: FarmRow[];
};

const STATUS: Record<AccessStatus, { label: string; cls: string }> = {
  TRIAL: { label: "Essai", cls: "bg-sky-100 text-sky-800" },
  ACTIVE: { label: "Abonné", cls: "bg-emerald-100 text-emerald-800" },
  EXPIRED: { label: "Lecture seule", cls: "bg-red-100 text-red-800" },
  EXEMPT: { label: "Gratuit à vie", cls: "bg-violet-100 text-violet-800" },
};

/** Abonnements : réglages, paiements à vérifier et élevages (propriétaire de l'app). */
export function SubscriptionAdmin() {
  const { data, error, refetch } = useQuery<{ subscriptionAdmin: Admin }>(
    SUBSCRIPTION_ADMIN,
    { fetchPolicy: "network-only" },
  );
  const opts = { onCompleted: () => void refetch() };
  const [confirm] = useMutation(CONFIRM, opts);
  const [reject] = useMutation(REJECT, opts);
  const [activate] = useMutation(ACTIVATE, opts);
  const [extend] = useMutation(EXTEND, opts);
  const [setFree] = useMutation(FREE, opts);
  const [search, setSearch] = useState("");
  const a = data?.subscriptionAdmin;
  if (error) return <ErrorBox error={error} />;
  if (!a) return null;

  const q = search.trim().toLowerCase();
  const farms = q
    ? a.farms.filter(
        (f) =>
          f.farmName.toLowerCase().includes(q) ||
          f.memberEmails.some((e) => e.toLowerCase().includes(q)),
      )
    : a.farms;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["Encaissé sur 30 jours", formatMoney(a.revenue30d)],
          ["Encaissé au total", formatMoney(a.revenueTotal)],
          ["Élevages abonnés", a.payingFarms],
          ["En essai", a.trialFarms],
          ["En lecture seule", a.expiredFarms],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      {a.pendingPayments.length > 0 && (
        <Card
          title={`Paiements à vérifier (${a.pendingPayments.length})`}
          subtitle="Vérifie la réception sur ton compte Mobile Money avant de confirmer."
        >
          <ul className="divide-y divide-slate-100">
            {a.pendingPayments.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-3 py-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">
                    {p.farmName} · {PLAN_LABEL[p.plan]} ·{" "}
                    {formatMoney(p.amount)}
                  </p>
                  <p className="text-slate-500">
                    Déclaré le {formatDate(p.createdAt)}
                    {p.reference
                      ? ` · réf. ${p.reference}`
                      : " · sans référence"}
                  </p>
                </div>
                <Button onClick={() => confirm({ variables: { id: p.id } })}>
                  Confirmer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => reject({ variables: { id: p.id } })}
                >
                  Refuser
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <SettingsForm
        key={JSON.stringify(a.settings)}
        settings={a.settings}
        onSaved={() => void refetch()}
      />

      <Card
        title={`Élevages (${a.farms.length})`}
        subtitle="Accorde un accès gratuit à vie, offre des jours ou enregistre un paiement reçu."
      >
        <Input
          className="mb-3"
          placeholder="Chercher un élevage ou un e-mail…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="divide-y divide-slate-100">
          {farms.map((f) => (
            <li key={f.farmId} className="space-y-2 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{f.farmName}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[f.status].cls}`}
                >
                  {STATUS[f.status].label}
                </span>
                <span className="text-slate-500">
                  {f.status === "TRIAL" && `encore ${days(f.daysLeft)}`}
                  {f.status === "ACTIVE" &&
                    `jusqu’au ${formatDate(f.paidUntil)}`}
                  {f.status === "EXPIRED" &&
                    `essai fini le ${formatDate(f.trialEndsAt)}`}
                </span>
              </div>
              <p className="break-all text-slate-500">
                {f.memberEmails.join(", ") || "Aucun membre"} · inscrit le{" "}
                {formatDate(f.createdAt)}
              </p>
              {f.status === "EXEMPT" && !f.freeAccess ? (
                <p className="text-xs text-violet-700">
                  Élevage dont tu es membre : toujours gratuit.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setFree({
                        variables: { farmId: f.farmId, free: !f.freeAccess },
                      })
                    }
                  >
                    {f.freeAccess
                      ? "Retirer l’accès gratuit"
                      : "Accès gratuit à vie"}
                  </Button>
                  {!f.freeAccess && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          extend({ variables: { farmId: f.farmId, days: 7 } })
                        }
                      >
                        +7 jours d’essai
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          activate({
                            variables: { farmId: f.farmId, plan: "MONTHLY" },
                          })
                        }
                      >
                        Payé : 1 mois
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          activate({
                            variables: { farmId: f.farmId, plan: "YEARLY" },
                          })
                        }
                      >
                        Payé : 1 an
                      </Button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SettingsForm({
  settings,
  onSaved,
}: {
  settings: Settings;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    trialDays: String(settings.trialDays),
    monthlyPrice: String(settings.monthlyPrice),
    yearlyPrice: String(settings.yearlyPrice),
    paymentInstructions: settings.paymentInstructions ?? "",
  });
  const [save, state] = useMutation(UPDATE_SETTINGS, { onCompleted: onSaved });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <Card
      title="Prix et essai"
      subtitle="Les nouveaux prix s’appliquent aux prochains paiements ; la durée d’essai aux nouveaux élevages."
    >
      <FormGrid>
        <Field label="Essai gratuit (jours)">
          <Input
            type="number"
            min={0}
            value={form.trialDays}
            onChange={set("trialDays")}
          />
        </Field>
        <Field label="Prix mensuel (FCFA)">
          <Input
            type="number"
            min={0}
            value={form.monthlyPrice}
            onChange={set("monthlyPrice")}
          />
        </Field>
        <Field label="Prix annuel (FCFA)">
          <Input
            type="number"
            min={0}
            value={form.yearlyPrice}
            onChange={set("yearlyPrice")}
          />
        </Field>
      </FormGrid>
      <Field label="Comment payer (affiché aux éleveurs)" className="mt-3">
        <Textarea
          rows={3}
          value={form.paymentInstructions}
          onChange={set("paymentInstructions")}
          placeholder="Ex. : Envoie le montant par Orange Money ou MTN MoMo au numéro …, au nom de …"
        />
      </Field>
      <ErrorBox error={state.error} />
      <Button
        className="mt-3"
        loading={state.loading}
        onClick={() =>
          save({
            variables: {
              input: {
                trialDays: Number(form.trialDays),
                monthlyPrice: Number(form.monthlyPrice),
                yearlyPrice: Number(form.yearlyPrice),
                paymentInstructions: form.paymentInstructions,
              },
            },
          })
        }
      >
        Enregistrer
      </Button>
    </Card>
  );
}
