// src/pages/Inicio.jsx
import { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard';
import { initials } from '../utils';

export default function Inicio({ me, games, bets, bonus, rows, myRank, onBet, go }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  // 1. Descobrimos a data de hoje formatada
  const today = new Date(now);
  const todayDateString = today.toLocaleDateString('pt-BR');
  
  // 2. Filtramos todos os jogos que acontecem na data de hoje
  let targetGames = games.filter(g => new Date(g.kickoff).toLocaleDateString('pt-BR') === todayDateString);
  let targetLabel = "Jogos de Hoje";

  // 3. Se hoje não tiver jogo nenhum, procuramos o próximo dia disponível
  if (targetGames.length === 0) {
    const nextGame = games.find(g => new Date(g.kickoff).getTime() > now);
    if (nextGame) {
      const nextDateString = new Date(nextGame.kickoff).toLocaleDateString('pt-BR');
      targetGames = games.filter(g => new Date(g.kickoff).toLocaleDateString('pt-BR') === nextDateString);
      targetLabel = `Próximos jogos (${nextDateString.slice(0, 5)})`;
    }
  }
  
  // Verifica se o usuário já salvou o bônus
  const hasBonus = bonus ? !!bonus['bonus:' + me.id] : false;
  const bonusDeadline = new Date('2026-06-22T23:59:59-03:00').getTime();
  const isBeforeDeadline = now < bonusDeadline;

  return (
    <div>
      {/* Alerta inteligente de Bônus */}
      {!hasBonus && isBeforeDeadline && (
        <div className="card" style={{ marginBottom: 15, background: 'var(--areia)', border: '2px solid var(--ouro-dk)' }}>
          <div style={{ color: 'var(--ouro-dk)', fontWeight: 'bold', marginBottom: 8, fontSize: 14 }}>
            ⭐ Você ainda não definiu seus Bônus!
          </div>
          <p style={{ fontSize: 13, marginBottom: 12, color: 'var(--vinho)' }}>
            Campeão, artilheiro e zebra valem muitos pontos! Não perca o prazo (até 22/06).
          </p>
          <button className="btn btn-pri" style={{ width: '100%', background: 'var(--vinho)', color: 'var(--ouro)', border: 'none' }} onClick={() => go('bonus')}>
            Definir Bônus Agora
          </button>
        </div>
      )}

      <button 
        className="btn btn-ghost" 
        style={{ width: '100%', marginBottom: 15, background: 'var(--areia)', border: '2px solid var(--vinho)', color: 'var(--vinho)' }} 
        onClick={() => go('palpites')}
      >
        📅 Ver todos os jogos e palpites
      </button>

      {/* NOVO BOTÃO: Só aparece depois que o bônus trava */}
      {!isBeforeDeadline && (
        <button 
          className="btn btn-ghost" 
          style={{ width: '100%', marginBottom: 15, background: 'var(--areia)', border: '2px solid var(--ouro-dk)', color: 'var(--vinho)' }} 
          onClick={() => go('bonus')}
        >
          ⭐ Ver palpites de bônus da família
        </button>
      )}

      {/* Renderiza a lista de jogos do dia */}
      {targetGames.length > 0 ? (
        <>
          <div className="eyebrow" style={{ textTransform: 'uppercase' }}>{targetLabel}</div>
          {targetGames.map(g => (
            <div key={g.id} style={{ marginBottom: 15 }}>
              <MatchCard 
                g={g} 
                me={me} 
                bets={bets} 
                members={rows.map(r => r.m)} 
                onBet={onBet} 
              />
            </div>
          ))}
        </>
      ) : (
        <div className="card empty">
          <div className="em-ic">🏰</div>
          <p>Nenhum jogo previsto.</p>
        </div>
      )}
      
      <div className="eyebrow" style={{ marginTop: 6 }}>Pódio da Melarada</div>
      <div className="card">
        {rows.length === 0 ? (
          <p className="muted center">Ainda sem pontuação.</p>
        ) : (
          rows.slice(0, 3).map((r, i) => (
            <div key={r.m.id} className={'rk' + (i === 0 ? ' king' : '') + (r.m.id === me.id ? ' me' : '')}>
              <div className="pos">{i + 1}</div>
              <div className="av">{i === 0 ? '👑' : initials(r.m.name)}</div>
              <div style={{ flex: 1 }}>
                <div className="nm">{r.m.name}</div>
                <div className="pat">{i === 0 ? 'Goat 🐐' : ''}</div>
              </div>
              <div className="pts">{r.pts}</div>
            </div>
          ))
        )}
        {rows.length > 3 && myRank >= 3 && (
          <div className="rk me">
            <div className="pos">{myRank + 1}</div>
            <div className="av">{initials(me.name)}</div>
            <div style={{ flex: 1 }}>
              <div className="nm">{me.name} (você)</div>
            </div>
            <div className="pts">{rows[myRank].pts}</div>
          </div>
        )}
        <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => go('ranking')}>Ver ranking completo</button>
      </div>
    </div>
  );
}