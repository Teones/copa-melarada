// src/pages/Perfil.jsx
import { initials } from '../utils';

export default function Perfil({ me, myPts, myRank, total, onLogout }) {
  return (
    <div>
      <div className="card center">
        <div className="av" style={{ width: 64, height: 64, fontSize: 22, margin: '4px auto 10px' }}>
          {myRank === 0 ? '👑' : initials(me.name)}
        </div>
        <div className="serif" style={{ fontSize: 20, color: 'var(--vinho)' }}>{me.name}</div>
        <div className="muted" style={{ marginTop: 2 }}>{myRank === 0 ? 'Goat 🐐' : ''}</div>
        <div className="row2" style={{ marginTop: 14 }}>
          <div className="card" style={{ margin: 0, background: '#faf3da' }}>
            <div className="muted" style={{ fontSize: 11 }}>Pontos</div>
            <div className="serif" style={{ fontSize: 24, fontWeight: 700 }}>{myPts}</div>
          </div>
          <div className="card" style={{ margin: 0, background: '#faf3da' }}>
            <div className="muted" style={{ fontSize: 11 }}>Posição</div>
            <div className="serif" style={{ fontSize: 24, fontWeight: 700 }}>
              {myRank >= 0 ? (myRank + 1) + 'º' : '—'}
              <span style={{ fontSize: 13, fontWeight: 400 }}> /{total}</span>
            </div>
          </div>
        </div>
      </div>
      <button className="btn btn-ghost" onClick={onLogout}>Sair</button>
    </div>
  );
}