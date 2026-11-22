import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BarChart3,
  Bell,
  CalendarHeart,
  CheckCircle2,
  HeartPulse,
  Package,
  Smartphone,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';

import { AccountLink } from '@/components/landing/account-link';
import { ContactForm } from '@/components/landing/contact-form';
import { KeepDayTheme } from '@/components/landing/keep-day-theme';

export const metadata: Metadata = {
  title: { absolute: 'Rabbit Farm · Gère ton élevage de lapins depuis ton téléphone' },
  description:
    'Saillies, mises bas, sevrage, engraissement, santé, ventes et stock : Rabbit Farm suit ton élevage cunicole et te rappelle chaque tâche. 1 mois d’essai gratuit.',
};

// Les prix sont relus au plus une fois par heure.
export const revalidate = 3600;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const DEFAULT_PRICING = { trialDays: 30, monthlyPrice: 1000, yearlyPrice: 10000 };

async function loadPricing() {
  try {
    const res = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ publicPricing { trialDays monthlyPrice yearlyPrice } }' }),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    const json = (await res.json()) as { data?: { publicPricing?: typeof DEFAULT_PRICING } };
    return json.data?.publicPricing ?? DEFAULT_PRICING;
  } catch {
    return DEFAULT_PRICING;
  }
}

const fcfa = (n: number) => `${n.toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`;

const FEATURES = [
  {
    icon: CalendarHeart,
    title: 'Reproduction sans oubli',
    text: 'Saillie, palpation, pose du nid, mise bas et ressaillie : chaque date est calculée et rappelée.',
  },
  {
    icon: Users,
    title: 'Lapereaux et sevrage',
    text: 'Chaque portée a son code. Tu suis les naissances, les pertes et le sevrage, sans cahier.',
  },
  {
    icon: Store,
    title: 'Engraissement et ventes',
    text: 'Lots, pesées, lapins prêts pour la vente, ventes et bénéfices, au même endroit.',
  },
  {
    icon: HeartPulse,
    title: 'Santé et soins',
    text: 'Traitements, vermifuges et vaccins notés, avec le rappel du prochain soin.',
  },
  {
    icon: Sparkles,
    title: 'Assistant d’élevage',
    text: 'Chaque jour, l’app te dit quoi faire et quoi prévoir, d’après tes propres données.',
  },
  {
    icon: Package,
    title: 'Stock et dépenses',
    text: 'Provende, médicaments et dépenses suivis, avec une alerte avant la rupture.',
  },
];

const STEPS = [
  { title: 'Crée ton compte', text: 'En deux minutes, avec ton e-mail. Le premier mois est offert.' },
  { title: 'Enregistre tes lapins', text: 'Tes cages, tes reproducteurs et leur passé : l’app apprend ton élevage.' },
  { title: 'Suis les rappels', text: 'Chaque matin, tu sais ce qu’il faut faire. Tu notes, l’app calcule la suite.' },
];

const FAQ = [
  {
    q: 'Faut-il un ordinateur ?',
    a: 'Non. Rabbit Farm marche sur téléphone, dans le navigateur, et s’installe sur l’écran d’accueil comme une application.',
  },
  {
    q: 'Comment payer l’abonnement ?',
    a: 'Par Mobile Money. Tu suis les consignes dans l’app, puis tu appuies sur « J’ai payé » : ton accès est prolongé dès la confirmation.',
  },
  {
    q: 'Que se passe-t-il à la fin de l’essai ?',
    a: 'Tes données restent là. Sans abonnement, l’app passe en lecture seule : tu consultes tout, mais tu n’ajoutes plus rien.',
  },
  {
    q: 'Mon équipe peut-elle l’utiliser ?',
    a: 'Oui. Tu ajoutes tes employés dans les Paramètres, chacun avec son propre compte et son rôle.',
  },
];

export default async function LandingPage() {
  const pricing = await loadPricing();
  const yearlySaving = pricing.monthlyPrice * 12 - pricing.yearlyPrice;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <KeepDayTheme />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon.svg" alt="" width={32} height={32} className="rounded-lg" />
            Rabbit Farm
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
            <a href="#fonctions" className="hover:text-emerald-700">Fonctions</a>
            <a href="#prix" className="hover:text-emerald-700">Prix</a>
            <a href="#questions" className="hover:text-emerald-700">Questions</a>
            <a href="#contact" className="hover:text-emerald-700">Contact</a>
          </nav>
          <AccountLink className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50" />
        </div>
      </header>

      <main>
        {/* Accroche */}
        <section className="bg-gradient-to-b from-emerald-50 to-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                <Smartphone size={16} /> Pensée pour les éleveurs de lapins
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Gère ton élevage de lapins depuis ton téléphone
              </h1>
              <p className="mt-4 text-lg text-slate-700">
                Saillies, mises bas, sevrage, santé et ventes : Rabbit Farm garde tout en mémoire et te rappelle
                chaque tâche au bon moment.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-600 px-6 py-3.5 text-center font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Essayer gratuitement {pricing.trialDays} jours
                </Link>
                <a
                  href="#contact"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Poser une question
                </a>
              </div>
              <p className="mt-3 text-sm text-slate-600">Sans engagement. Ensuite {fcfa(pricing.monthlyPrice)} par mois.</p>
            </div>

            {/* Aperçu de l'app (illustration, données fictives) */}
            <div aria-hidden="true" className="mx-auto w-full max-w-sm rounded-[2rem] border-8 border-slate-900 bg-slate-50 p-4 shadow-2xl">
              <p className="text-xs text-slate-500">Aujourd’hui</p>
              <p className="mb-3 font-semibold">Ton assistant d’élevage</p>
              {[
                { t: 'Palper F07', d: 'Saillie il y a 12 jours', c: 'border-sky-200 bg-sky-50' },
                { t: 'Poser le nid de F03', d: 'Mise bas prévue dans 3 jours', c: 'border-amber-200 bg-amber-50' },
                { t: 'Vermifuger F12', d: 'Mise bas d’hier : Pandex 1 %', c: 'border-red-200 bg-red-50' },
                { t: 'Lot L-04 prêt à vendre', d: '8 lapins, 2,5 kg en moyenne', c: 'border-emerald-200 bg-emerald-50' },
              ].map((item) => (
                <div key={item.t} className={`mb-2 rounded-xl border p-3 text-sm ${item.c}`}>
                  <p className="font-medium text-slate-900">{item.t}</p>
                  <p className="text-slate-600">{item.d}</p>
                </div>
              ))}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  ['42', 'lapins'],
                  ['6', 'portées'],
                  ['91 %', 'fertilité'],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-xl bg-white p-2 shadow-sm">
                    <p className="text-lg font-bold text-emerald-700">{n}</p>
                    <p className="text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Fonctions */}
        <section id="fonctions" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Tout ton élevage, au même endroit</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Fini les cahiers perdus et les dates oubliées. Tu notes ce qui se passe, l’app calcule la suite.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 rounded-2xl bg-slate-50 p-6 sm:grid-cols-3">
            {[
              { icon: Bell, text: 'Rappels du jour chaque matin, en notification' },
              { icon: Smartphone, text: 'S’installe sur l’écran d’accueil, comme une application' },
              { icon: BarChart3, text: 'Statistiques : fertilité, mortalité, bénéfices' },
            ].map(({ icon: Icon, text }) => (
              <p key={text} className="flex items-start gap-3 text-sm text-slate-700">
                <Icon size={20} className="mt-0.5 shrink-0 text-emerald-700" /> {text}
              </p>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="bg-emerald-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-3xl font-bold">Prêt en trois étapes</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className="rounded-2xl bg-white/10 p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 font-bold text-emerald-950">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-emerald-50">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Prix */}
        <section id="prix" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Un prix simple</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            {pricing.trialDays} jours gratuits pour essayer, sans rien payer. Paiement par Mobile Money.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-700">Mensuel</h3>
              <p className="mt-2 text-3xl font-bold">
                {fcfa(pricing.monthlyPrice)} <span className="text-base font-normal text-slate-500">/ mois</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">Tu paies mois par mois.</p>
            </div>
            <div className="relative rounded-2xl border-2 border-emerald-500 p-6 shadow-sm">
              {yearlySaving > 0 && (
                <span className="absolute -top-3 right-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  {fcfa(yearlySaving)} d’économie
                </span>
              )}
              <h3 className="font-semibold text-slate-700">Annuel</h3>
              <p className="mt-2 text-3xl font-bold">
                {fcfa(pricing.yearlyPrice)} <span className="text-base font-normal text-slate-500">/ an</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">Un seul paiement pour toute l’année.</p>
            </div>
          </div>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-2 text-sm text-slate-700 sm:grid-cols-2">
            {['Toutes les fonctions incluses', 'Nombre de lapins illimité', 'Comptes pour ton équipe', 'Tes données gardées en sécurité'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/register" className="inline-block rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white hover:bg-emerald-700">
              Commencer mon essai gratuit
            </Link>
          </div>
        </section>

        {/* Questions */}
        <section id="questions" className="scroll-mt-20 bg-slate-50">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 className="text-center text-3xl font-bold">Questions fréquentes</h2>
            <div className="mt-8 space-y-3">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5">
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {q} <span className="text-emerald-700 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-700">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Contacte-nous</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Une question, une démonstration ou un souci ? Laisse ton message : nous te répondons sur le contact indiqué.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Rabbit Farm · Gestion d’élevage cunicole</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-emerald-700">Connexion</Link>
            <Link href="/register" className="hover:text-emerald-700">Créer un compte</Link>
            <a href="#contact" className="hover:text-emerald-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
