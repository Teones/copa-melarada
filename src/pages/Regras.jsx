// src/pages/Regras.jsx
import { MULT } from '../utils';

export default function Regras() {
  const ptsList = [
    { pts: 25, desc: 'Cravou o placar exato.' },
    { pts: 18, desc: 'Acertou o vencedor + Gols do vencedor.' },
    { pts: 15, desc: 'Acertou o vencedor + Gols do perdedor.' },
    { pts: 14, desc: 'Acertou o vencedor + Saldo de gols.' },
    { pts: 10, desc: 'Acertou apenas quem venceu.' },
    { pts: 8, desc: 'Acertou o empate (mas errou o placar).' },
    { pts: 0, desc: 'Errou o resultado final.' },
  ];

  const fasesList = [
    { n: 'Fase de Grupos', m: MULT.grupos },
    { n: '32-avos de final', m: MULT.r32 },
    { n: 'Oitavas de final', m: MULT.oitavas },
    { n: 'Quartas de final', m: MULT.quartas },
    { n: 'Semifinal', m: MULT.semi },
    { n: 'Disputa de 3º lugar', m: MULT.terceiro },
    { n: 'Final', m: MULT.final }
  ];

  const bonusList = [
    { l: 'Campeão', p: 50 },
    { l: 'Vice-campeão', p: 25 },
    { l: 'Artilheiro', p: 30 },
    { l: 'Seleção surpresa', p: 20 },
  ];

  return (
    <div>
      <div className="eyebrow">Como funciona a pontuação?</div>

      <div className="card">
        <div className="serif" style={{ fontSize: 18, color: 'var(--vinho)', marginBottom: 8 }}>Pontos por jogo</div>
        <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          A pontuação base é calculada comparando o seu palpite com o resultado real. <b>Só a maior pontuação válida é aplicada</b> (elas não se somam num mesmo jogo).
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ptsList.map(r => (
            <div key={r.pts} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: 'var(--vinho)', color: 'var(--ouro2)', padding: '4px 0', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', width: '56px', textAlign: 'center', flexShrink: 0 }}>
                {r.pts} pts
              </div>
              <div style={{ fontSize: '14px', color: 'var(--carvao)', lineHeight: 1.3 }}>
                {r.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="serif" style={{ fontSize: 18, color: 'var(--vinho)', marginBottom: 8 }}>Multiplicadores de Fase</div>
        <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          À medida que a Copa avança, os jogos valem mais. A pontuação base é multiplicada pelo peso da fase:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {fasesList.map(f => (
            <div key={f.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#faf3da', borderRadius: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--carvao)' }}>{f.n}</span>
              <span style={{ background: 'var(--ouro)', color: 'var(--vinho-dk)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold', fontSize: '13px' }}>
                x{f.m}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="serif" style={{ fontSize: 18, color: 'var(--vinho)', marginBottom: 8 }}>Bônus (Final da Copa)</div>
        <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          Palpites de bônus travam assim que o torneio começa e rendem pontos extras no final:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {bonusList.map((b, index) => (
            <div key={b.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: index !== bonusList.length - 1 ? '1px solid var(--linha)' : 'none', padding: '10px 4px' }}>
              <span style={{ fontSize: '14px', color: 'var(--carvao)', fontWeight: 500 }}>{b.l}</span>
              <b style={{ color: 'var(--ouro-dk)', fontSize: '14px' }}>+{b.p} pts</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}