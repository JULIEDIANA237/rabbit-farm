/**
 * Traduit une erreur réseau (souvent un simple « fetch failed ») en
 * explication utile, à partir du code de la cause d'origine.
 */
export function describeNetworkError(error: unknown): string {
  const codes: string[] = [];
  let current: unknown = error;
  for (let depth = 0; current && depth < 5; depth += 1) {
    const value = current as { code?: unknown; cause?: unknown; originalError?: unknown };
    if (typeof value.code === 'string') codes.push(value.code);
    current = value.originalError ?? value.cause;
  }

  const code = codes.find((candidate) => candidate !== 'UND_ERR_SOCKET') ?? codes[0];
  switch (code) {
    case 'SELF_SIGNED_CERT_IN_CHAIN':
    case 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY':
    case 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':
    case 'DEPTH_ZERO_SELF_SIGNED_CERT':
      return `certificat refusé (${code}) : un antivirus ou un proxy inspecte probablement les connexions sécurisées`;
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return `adresse introuvable (${code}) : vérifie l'adresse du service (SUPABASE_URL…) et la connexion internet`;
    case 'ECONNREFUSED':
    case 'ECONNRESET':
    case 'UND_ERR_CONNECT_TIMEOUT':
    case 'ETIMEDOUT':
      return `connexion impossible ou coupée (${code}) : réseau instable, réessaie`;
    default:
      return code ? `erreur réseau (${code})` : error instanceof Error ? error.message : String(error);
  }
}
