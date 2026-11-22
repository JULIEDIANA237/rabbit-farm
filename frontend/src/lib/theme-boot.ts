export const THEME_KEY = 'rabbitfarm:theme';

/** Script lancé avant l'affichage : évite un flash de la mauvaise apparence. */
export const THEME_BOOT_SCRIPT = `try{var t=localStorage.getItem('${THEME_KEY}');document.documentElement.dataset.theme=(t==='night'||t==='contrast')?t:'day'}catch(e){document.documentElement.dataset.theme='day'}`;
