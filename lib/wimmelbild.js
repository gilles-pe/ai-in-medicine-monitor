export const WIMMELBILD_URL = Object.freeze({
  en: 'https://wimmelbild.gillespenning.com/en/',
  de: 'https://wimmelbild.gillespenning.com/',
});

/** Exact editorial card IDs mapped to their matching Wimmelbild scene hash. */
const SCENE_BY_CARD = Object.freeze({
  'amie-2025': '#patient/P01-S02',
  'lower-amie-2025': '#patient/P01-S02',
  'amie-previsit-2026': '#patient/P01-S02',
  'lower-amie-previsit-2026': '#patient/P01-S02',
  'lower-mai-dxo-2026': '#patient/P01-S03',
  'mira-2026': '#all/ALL-KLINIK',
  'lower-mira-2026': '#all/ALL-KLINIK',
  mira: '#all/ALL-KLINIK',
  'af2-paper-2021': '#all/MED',
  'af3-paper-2024': '#all/MED',
  'alphafold-2018': '#all/MED',
  'alphafold2-2020': '#all/MED',
  'alphafold3-2024': '#all/MED',
  alphafold2: '#all/MED',
  alphafold3: '#all/MED',
  'lower-star-2022': '#all/OP',
  'lower-ayers-2023': '#all/ALL-KIND',
});

export function wimmelbildSceneForCard(cardId) {
  return (cardId && SCENE_BY_CARD[cardId]) || '';
}

export function wimmelbildUrl(locale = 'en', hash = '') {
  const base = locale === 'de' ? WIMMELBILD_URL.de : WIMMELBILD_URL.en;
  return base + (hash || '');
}
