// src/pages/Palpites.jsx
import { useState } from 'react';
import MatchCard from '../components/MatchCard';

export default function Palpites({ me, games, bets, members, onBet }) {
  const [view, setView] = useState('palpites');

  // Separa os jogos em "Abertos" (Palpites) e "Finalizados" (Resultados)
  const displayGames = games.filter(g => view === 'palpites' ? !g.finished : g.finished);

  // NOVA REGRA: Se for a aba de resultados, ordena do mais recente para o mais antigo
  if (view === 'resultados') {
    displayGames.sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());
  }

  return (
    <div>
      {/* Botões do topo para alternar a tela */}
      <div className="seg" style={{ marginBottom: 15 }}>
        <button className={view === 'palpites' ? 'on' : ''} onClick={() => setView('palpites')}>Jogos Abertos</button>
        <button className={view === 'resultados' ? 'on' : ''} onClick={() => setView('resultados')}>Resultados</button>
      </div>

      {displayGames.length === 0 && (
        <div className="card empty">
          <div className="em-ic">{view === 'palpites' ? '⚽' : '🏁'}</div>
          <p>{view === 'palpites' ? 'Nenhum jogo aberto no momento.' : 'Nenhum jogo foi finalizado ainda.'}</p>
        </div>
      )}

      {/* Renderiza o mesmo Card da tela de início, garantindo 100% de padrão visual */}
      {displayGames.map(g => (
        <div key={g.id} style={{ marginBottom: 15 }}>
          <MatchCard 
            g={g} 
            me={me} 
            bets={bets} 
            members={members} 
            onBet={onBet} 
          />
        </div>
      ))}
    </div>
  );
}