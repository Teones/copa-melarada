// src/components/MatchCard.jsx
import { useState, useEffect } from 'react';
import { fmtDate, PHASE_LABEL, gamePoints, initials } from '../utils';

export default function MatchCard({ g, me, bets, members, onBet }) {
  const bet = bets['bet:' + me.id + ':' + g.id];
  const [h, setH] = useState(bet ? String(bet.h) : '');
  const [a, setA] = useState(bet ? String(bet.a) : '');
  const [prevBetTs, setPrevBetTs] = useState(bet?.ts);

  const [expanded, setExpanded] = useState(false);

  // Sincroniza o estado local com o banco de dados
  if (bet?.ts !== prevBetTs) {
    setPrevBetTs(bet?.ts);
    setH(bet ? String(bet.h) : '');
    setA(bet ? String(bet.a) : '');
  }

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const ko = new Date(g.kickoff).getTime();
  const locked = g.finished || now >= (ko - 900000); // Trava 1 HORA antes do jogo
  const isLive = now >= ko && !g.finished; // Jogo rolando agora

  const pts = gamePoints(bet, g);

  // A regra do botão: só tem "mudança" se os inputs forem diferentes do banco
  const hasChange = bet ? (String(bet.h) !== h || String(bet.a) !== a) : (h !== '' && a !== '');
  const isSaved = !!bet;

  // ===== Quadro da família: monta + ordena + medalhas =====
  const ranked = (members || []).map(m => {
    const mb = bets['bet:' + m.id + ':' + g.id];
    const p = g.finished ? (gamePoints(mb, g) || 0) : null;
    const cravou = g.finished && mb && mb.h === g.rh && mb.a === g.ra;
    return { m, mb, pts: p, cravou };
  });

  if (g.finished) {
    ranked.sort((x, y) =>
      (y.pts - x.pts) ||                          // mais pontos primeiro
      ((y.mb ? 1 : 0) - (x.mb ? 1 : 0)) ||        // quem palpitou antes de quem não
      ((x.mb?.ts || 0) - (y.mb?.ts || 0))         // empate: quem cravou primeiro
    );
  } else {
    // Nova ordenação tática para jogos abertos/travados
    ranked.sort((x, y) => {
      // 1. Quem não palpitou vai pro fim da lista
      if (!x.mb && !y.mb) return 0;
      if (!x.mb) return 1;
      if (!y.mb) return -1;

      const hX = x.mb.h; const aX = x.mb.a;
      const hY = y.mb.h; const aY = y.mb.a;

      // 2. Categorias: 0 = Vitória Mandante, 1 = Empate, 2 = Vitória Visitante
      const catX = hX > aX ? 0 : (hX === aX ? 1 : 2);
      const catY = hY > aY ? 0 : (hY === aY ? 1 : 2);

      // Se estão em categorias diferentes, a ordem é Mandante > Empate > Visitante
      if (catX !== catY) return catX - catY;

      // 3. Mesma categoria: aplica as regras específicas que você desenhou
      if (catX === 0) {
        // Mandante ganha: maior gol mandante primeiro, depois menor gol visitante
        if (hX !== hY) return hY - hX; 
        return aX - aY;
      } else if (catX === 1) {
        // Empate: do 0x0 subindo
        return hX - hY;
      } else {
        // Visitante ganha: menor gol visitante primeiro, depois menor gol mandante (ex: 0x1, 0x2, 1x2...)
        if (aX !== aY) return aX - aY;
        return hX - hY;
      }
    });
  }

  // Faixas de pontuação distintas (> 0) viram medalhas. Quem empata na mesma
  // pontuação leva a MESMA medalha (5 cravaram = 5 ouros).
  const distinct = g.finished
    ? [...new Set(ranked.filter(r => r.pts > 0).map(r => r.pts))].sort((p, q) => q - p)
    : [];
  const medalFor = p => (g.finished && p > 0 ? (['🥇', '🥈', '🥉'][distinct.indexOf(p)] || null) : null);
  const palpitaram = ranked.filter(r => r.mb).length;

  // O SEGREDO DO VISUAL: Usando a sua classe "pill" com cores de fundo personalizadas!
  let statusNode;
  if (g.finished) {
    statusNode = <span className="pill pill-done">🏁 Encerrado</span>;
  } else if (isLive) {
    statusNode = <span className="pill pill-live">⚽ Em jogo</span>;
  } else if (locked) {
    statusNode = <span className="pill" style={{ background: '#ffebee', color: '#c62828', fontWeight: 'bold' }}>🔒 Travado</span>;
  } else if (hasChange) {
    statusNode = <span className="pill" style={{ background: '#fff3e0', color: '#e67e22', fontWeight: 'bold' }}>✏️ Alterado</span>;
  } else if (isSaved) {
    statusNode = <span className="pill" style={{ background: '#e8f5e9', color: '#27ae60', fontWeight: 'bold' }}>✅ Salvo</span>;
  } else {
    statusNode = <span className="pill" style={{ background: '#f5f5f5', color: '#7f8c8d', fontWeight: 'bold' }}>⚪ Pendente</span>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="muted" style={{ fontSize: 12 }}>{g.group || PHASE_LABEL[g.phase]} · {fmtDate(g.kickoff)}</span>
        {statusNode}
      </div>

      <div className="match">
        <div className="team">
          <div className="fl">{g.homeFlag || '🏳️'}</div>
          <div className="nm">{g.home}</div>
        </div>
        <div className="score" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <input className="si" disabled={locked} value={h} onChange={e => setH(e.target.value.replace(/\D/g, '').slice(0, 1))} inputMode="numeric" />
          <span className="x" style={{ margin: '0 12px', fontSize: 20, display: 'flex', alignItems: 'center', marginTop: 3, color: 'var(--carvao)' }}>×</span>
          <input className="si" disabled={locked} value={a} onChange={e => setA(e.target.value.replace(/\D/g, '').slice(0, 1))} inputMode="numeric" />
        </div>
        <div className="team">
          <div className="fl">{g.awayFlag || '🏳️'}</div>
          <div className="nm">{g.away}</div>
        </div>
      </div>

      {g.finished && (
        <div className="res">
          Resultado: <b>{g.rh} × {g.ra}</b>
          {pts != null && <> · você fez <b>{pts} pts</b></>}
        </div>
      )}

      {/* Botão de salvar aparece APENAS se tiver alteração e não estiver travado */}
      {!locked && hasChange && (
        <button className="btn btn-pri" style={{ marginTop: 11 }} onClick={() => { if (h !== '' && a !== '') onBet(g, h, a); }}>
          {bet ? 'Salvar alteração' : 'Cravar palpite'}
        </button>
      )}

      {locked && !g.finished && <div className="res" style={{ marginTop: 12 }}>🔒 Travado</div>}

      {/* ===================== QUADRO DA FAMÍLIA ===================== */}
      {locked && (
        <div style={{ borderTop: '1px solid var(--linha)', paddingTop: 12, marginTop: 12 }}>
          <button
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--vinho)', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '6px 0' }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▲ Esconder palpites da família' : '▼ Ver palpites da família'}
          </button>

          {expanded && (
            <div style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--vinho)' }}>🏆 Quadro da família</span>
                <span style={{ fontSize: 11, color: 'var(--musgo)' }}>
                  {g.finished ? 'ordenado por pontos' : 'palpites'} · {palpitaram} palpite{palpitaram === 1 ? '' : 's'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {ranked.map((r, idx) => {
                  const isMe = r.m.id === me.id;
                  const medal = medalFor(r.pts);
                  const zeroed = g.finished && (!r.mb || r.pts === 0);
                  const posLabel = medal || (g.finished ? idx + 1 : '');
                  return (
                    <div
                      key={r.m.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 9, padding: 8, borderRadius: 10,
                        background: isMe ? '#FAF3DA' : 'transparent',
                        border: isMe ? '1px solid var(--ouro2)' : '1px solid transparent',
                        opacity: zeroed ? 0.55 : 1
                      }}
                    >
                      <span style={{ width: 22, textAlign: 'center', fontSize: medal ? 18 : 13, fontWeight: 600, color: 'var(--musgo)', flex: 'none' }}>
                        {posLabel}
                      </span>

                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: isMe ? 'var(--vinho)' : '#efe6cf', color: isMe ? 'var(--ouro2)' : 'var(--ouro-dk)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flex: 'none' }}>
                        {initials(r.m.name)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--carvao)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.m.name}{isMe ? <span style={{ color: 'var(--ouro-dk)' }}> (você)</span> : ''}
                        </div>
                        <div style={{ display: 'flex', gap: 5, marginTop: 3, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, background: r.m.isPaying ? '#f6e7bf' : '#eceae2', padding: '1px 6px', borderRadius: 999 }}>
                            {r.m.isPaying ? '💲' : '🍼'}
                          </span>
                          {r.cravou && (
                            <span style={{ fontSize: 10, fontWeight: 600, background: '#efe6cf', color: 'var(--ouro-dk)', padding: '1px 6px', borderRadius: 999 }}>
                              🎯 cravou
                            </span>
                          )}
                        </div>
                      </div>

                      {r.mb ? (
                        <div style={{ display: 'flex', gap: 3, alignItems: 'center', flex: 'none' }}>
                          <div style={{ width: 24, height: 28, background: zeroed ? '#f3eddf' : '#fff', border: isMe ? '1px solid var(--ouro2)' : '1px solid var(--linha)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, fontFamily: 'Georgia,serif', color: zeroed ? '#8a7f6b' : (isMe ? 'var(--vinho)' : 'var(--carvao)') }}>{r.mb.h}</div>
                          <span style={{ color: '#b9ad93', fontSize: 11 }}>×</span>
                          <div style={{ width: 24, height: 28, background: zeroed ? '#f3eddf' : '#fff', border: isMe ? '1px solid var(--ouro2)' : '1px solid var(--linha)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, fontFamily: 'Georgia,serif', color: zeroed ? '#8a7f6b' : (isMe ? 'var(--vinho)' : 'var(--carvao)') }}>{r.mb.a}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: '#b9ad93', flex: 'none' }}>sem palpite</span>
                      )}

                      {g.finished && (
                        <div style={{ background: r.pts > 0 ? 'var(--vinho)' : '#f0efe9', color: r.pts > 0 ? 'var(--ouro2)' : '#8a7f6b', fontSize: 13, fontWeight: 700, padding: '5px 8px', borderRadius: 8, flex: 'none', minWidth: 40, textAlign: 'center' }}>
                          {r.pts > 0 ? '+' + r.pts : '0'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}