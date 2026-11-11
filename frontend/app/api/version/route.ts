// Version actuellement en ligne. Comparée par le navigateur à la sienne
// pour proposer une mise à jour (UpdateBanner).
export const dynamic = 'force-static';

export function GET() {
  return Response.json({ version: process.env.NEXT_PUBLIC_BUILD_ID ?? 'dev' });
}
