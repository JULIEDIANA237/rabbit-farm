import { APP_PAGES, appGuideDigest, isAppPath } from './app-guide.js';

describe('mode d’emploi de l’app pour l’assistant', () => {
  it('n’accepte que les pages de l’app', () => {
    expect(isAppPath('/breeding?new=1')).toBe(true);
    expect(isAppPath('/import')).toBe(true);
    expect(isAppPath('https://exemple.com')).toBe(false);
    expect(isAppPath('//exemple.com/rabbits')).toBe(false);
    expect(isAppPath('/inconnu')).toBe(false);
  });

  it('décrit chaque page avec son lien', () => {
    const digest = appGuideDigest();
    for (const page of APP_PAGES) expect(digest).toContain(page.path);
  });
});
