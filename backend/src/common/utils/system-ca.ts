import * as tls from 'node:tls';

/**
 * Ajoute les certificats du système (magasin Windows, macOS ou Linux)
 * à ceux que Node.js accepte par défaut.
 *
 * Sans cela, un antivirus ou un proxy d'entreprise qui inspecte les
 * connexions HTTPS fait échouer les appels sortants (Supabase, IA…)
 * avec un simple « fetch failed ». Désactivable avec USE_SYSTEM_CA=false.
 */
export function trustSystemCertificates(env: NodeJS.ProcessEnv = process.env): number {
  if (env.USE_SYSTEM_CA === 'false') return 0;
  if (typeof tls.setDefaultCACertificates !== 'function' || typeof tls.getCACertificates !== 'function') return 0;

  try {
    const system = tls.getCACertificates('system');
    if (system.length === 0) return 0;
    const merged = [...new Set([...tls.getCACertificates('default'), ...system])];
    tls.setDefaultCACertificates(merged);
    return system.length;
  } catch {
    return 0;
  }
}
