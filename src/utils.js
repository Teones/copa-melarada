// src/utils.js
export const MULT = { grupos: 1, r32: 1.5, oitavas: 2, quartas: 3, semi: 4, terceiro: 5, final: 5 };
export const PHASE_LABEL = { grupos: 'Fase de grupos', r32: '32 avos', oitavas: 'Oitavas', quartas: 'Quartas', semi: 'Semifinal', terceiro: '3º lugar', final: 'Final' };
export const PHASE_SHORT = { grupos: 'Grupos', r32: '32-avos', oitavas: 'Oitavas', quartas: 'Quartas', semi: 'Semi', terceiro: '3º lugar', final: 'Final' };

export function basePoints(bh, ba, rh, ra) {
  if (bh === rh && ba === ra) return 25;
  const bo = Math.sign(bh - ba), ro = Math.sign(rh - ra);
  if (bo !== ro) return 0;
  if (ro === 0) return 8;
  const winGoalsR = rh > ra ? rh : ra, loseGoalsR = rh > ra ? ra : rh;
  const winGoalsB = bh > ba ? bh : ba, loseGoalsB = bh > ba ? ba : bh;
  if (winGoalsB === winGoalsR) return 18;
  if (loseGoalsB === loseGoalsR) return 15;
  if ((bh - ba) === (rh - ra)) return 14;
  return 10;
}

export function gamePoints(bet, g) {
  if (!g.finished || g.rh == null || g.ra == null || !bet) return null;
  const p = basePoints(bet.h, bet.a, g.rh, g.ra);
  return Math.round(p * (MULT[g.phase] || 1));
}

export const fmtDate = iso => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-br', { day: '2-digit', month: '2-digit' }) + ' · ' +
           d.toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
};

export const initials = n => n.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();