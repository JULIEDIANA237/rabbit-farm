import { ClipboardList, History, FileText, HandCoins, Package, Search, Settings, Syringe, type LucideIcon } from 'lucide-react';

/** Raccourcis de la boîte à outils (page Outils et menu du bas). */
export const TOOL_LINKS: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: 'Prêts pour la vente', href: '/sales/ready', icon: HandCoins },
  { label: 'Noter un soin', href: '/care?new=1', icon: Syringe },
  { label: 'Fiches de suivi des lots', href: '/fattening', icon: FileText },
  { label: 'Stock et provende', href: '/operations/inventory', icon: Package },
  { label: 'Passé des reproducteurs', href: '/rabbits/past', icon: History },
  { label: 'Rechercher un lapin', href: '/rabbits', icon: Search },
  { label: 'Tâches du jour', href: '/tasks', icon: ClipboardList },
  { label: 'Réglages et notifications', href: '/settings', icon: Settings },
];
