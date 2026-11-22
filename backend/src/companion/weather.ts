import { Logger } from '@nestjs/common';

/**
 * Météo gratuite et sans clé (Open-Meteo) : position de la ferme à partir du lieu saisi,
 * puis températures maximales d'aujourd'hui et de demain à Douala/Yaoundé/…
 * Toute erreur renvoie null : l'assistant continue sans alerte de chaleur.
 */
const logger = new Logger('Météo');
const TIMEOUT = 5000;

const enabled = () => process.env.COMPANION_WEATHER !== 'off';

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** « Douala, Bonabéri » → « Douala » : la ville suffit pour la météo. */
export function cityOf(location: string) {
  return location.split(/[,(/-]/)[0].trim();
}

export async function geocode(location: string): Promise<{ latitude: number; longitude: number } | null> {
  if (!enabled() || !location.trim()) return null;
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?count=1&language=fr&name=${encodeURIComponent(cityOf(location))}`;
    const data = (await getJson(url)) as { results?: Array<{ latitude: number; longitude: number }> };
    const hit = data.results?.[0];
    return hit ? { latitude: hit.latitude, longitude: hit.longitude } : null;
  } catch (e) {
    logger.warn(`Lieu introuvable (${location}) : ${String(e).slice(0, 120)}`);
    return null;
  }
}

export async function maxTemperatures(latitude: number, longitude: number): Promise<{ today: number | null; tomorrow: number | null } | null> {
  if (!enabled()) return null;
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}` +
      '&daily=temperature_2m_max&forecast_days=2&timezone=Africa%2FDouala';
    const data = (await getJson(url)) as { daily?: { temperature_2m_max?: Array<number | null> } };
    const temps = data.daily?.temperature_2m_max ?? [];
    return { today: temps[0] ?? null, tomorrow: temps[1] ?? null };
  } catch (e) {
    logger.warn(`Prévisions indisponibles : ${String(e).slice(0, 120)}`);
    return null;
  }
}
