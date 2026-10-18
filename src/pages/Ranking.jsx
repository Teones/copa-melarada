// src/pages/Ranking.jsx
import { initials } from '../utils';

export default function Ranking({ rows, meId }) {
  if (rows.length === 0) return <div className="card empty"><div className="em-ic">🏆</div><p>Sem pontuação.</p></div>;

  const Trend = ({ t }) => {
    if (t === 'up') return <div style={{ color: '#3b6d2f', fontSize: 10 }}>▲</div>;
    if (t === 'down') return <div style={{ color: '#9a1b1b', fontSize: 10 }}>▼</div>;
    return <div style={{ color: '#b9ad93', fontSize: 10 }}>—</div>;
  };

  // Nova etiqueta visual de destaque para o pagamento
  const PayBadge = ({ isPaying }) => (
    <span style={{ 
      background: isPaying ? '#e8f5e9' : '#f5f5f5', 
      color: isPaying ? '#2e7d32' : '#9e9e9e', 
      padding: '3px 6px', 
      borderRadius: 6, 
      fontWeight: 800, 
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5
    }}>
      {isPaying ? 'Pagando 🤑💲' : 'Brincando 🍼'}
    </span>
  );

  return (
    <div>
      <div className="eyebrow">Classificação geral</div>
      <div className="card" style={{ padding: '6px 12px' }}>
        {rows.map((r, i) => (
          <div key={r.m.id} className={'rk' + (i === 0 ? ' king' : '') + (r.m.id === meId ? ' me' : '')}>
            <div className="pos" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
              <span>{i + 1}</span>
              <Trend t={r.trend} />
            </div>
            <div className="av">{i === 0 ? '👑' : initials(r.m.name)}</div>
            <div style={{ flex: 1 }}>
              <div className="nm">{r.m.name}{r.m.id === meId ? ' (você)' : ''}</div>
              
              {/* Painel do status com o destaque e quantidade de cravadas */}
              <div className="pat" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                {i === 0 && <span style={{ fontWeight: 'bold', color: 'var(--ouro-dk)' }}>Goat 🐐</span>}
                {i === 0 && <span style={{ color: '#ccc' }}>·</span>}
                
                <PayBadge isPaying={r.m.isPaying} />
                
                <span style={{ color: '#ccc' }}>·</span>
                <span style={{ fontSize: 11 }}>{r.exact} cravadas</span>
              </div>
              
            </div>
            <div className="pts">{r.pts}</div>
          </div>
        ))}
      </div>
    </div>
  );
}