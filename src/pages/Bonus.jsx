// src/pages/Bonus.jsx
import { useState, useEffect } from 'react';
import { FLG } from '../data/flags';
import { initials } from '../utils';

export default function Bonus({ me, members, bonus, gabarito, onSave }) {
  const [now, setNow] = useState(() => Date.now());
  const [view, setView] = useState(() => Date.now() >= new Date('2026-06-23T00:00:00-03:00').getTime() ? 'raiox' : 'meu');  const [rxTab, setRxTab] = useState('campeao');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const lockDate = new Date('2026-06-23T00:00:00-03:00').getTime();
  const locked = now >= lockDate;

  const cur = bonus['bonus:' + me.id] || {};
  const [v, setV] = useState({ campeao: cur.campeao || '', vice: cur.vice || '', artilheiro: cur.artilheiro || '', zebra: cur.zebra || '' });
  
  const paises = Object.keys(FLG).sort();
  
  const topScorers = [
    "Florian Wirtz 🇩🇪", "Jamal Musiala 🇩🇪", "Kai Havertz 🇩🇪",
    "Enzo Fernández 🇦🇷", "Julián Álvarez 🇦🇷", "Lautaro Martínez 🇦🇷", "Lionel Messi 🇦🇷",
    "Kevin De Bruyne 🇧🇪", "Romelu Lukaku 🇧🇪",
    "Endrick 🇧🇷", "Raphinha 🇧🇷", "Rodrygo 🇧🇷", "Vinícius Júnior 🇧🇷",
    "Alphonso Davies 🇨🇦", "Jonathan David 🇨🇦",
    "James Rodríguez 🇨🇴", "Luis Díaz 🇨🇴",
    "Son Heung-min 🇰🇷",
    "Andrej Kramarić 🇭🇷",
    "Mohamed Salah 🇪🇬",
    "Enner Valencia 🇪🇨",
    "Lamine Yamal 🇪🇸", "Nico Williams 🇪🇸", "Álvaro Morata 🇪🇸",
    "Christian Pulisic 🇺🇸", "Folarin Balogun 🇺🇸",
    "Antoine Griezmann 🇫🇷", "Kylian Mbappé 🇫🇷", "Ousmane Dembélé 🇫🇷",
    "Cody Gakpo 🇳🇱", "Memphis Depay 🇳🇱", "Xavi Simons 🇳🇱",
    "Bukayo Saka 🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Harry Kane 🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Jude Bellingham 🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Phil Foden 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Takefusa Kubo 🇯🇵",
    "Hakim Ziyech 🇲🇦", "Youssef En-Nesyri 🇲🇦",
    "Santiago Giménez 🇲🇽",
    "Erling Haaland 🇳🇴", "Martin Ødegaard 🇳🇴",
    "Bernardo Silva 🇵🇹", "Bruno Fernandes 🇵🇹", "Cristiano Ronaldo 🇵🇹", "Rafael Leão 🇵🇹",
    "Sadio Mané 🇸🇳",
    "Viktor Gyökeres 🇸🇪",
    "Darwin Núñez 🇺🇾", "Federico Valverde 🇺🇾"
  ];

  const [isOutro, setIsOutro] = useState(cur.artilheiro && !topScorers.includes(cur.artilheiro));

  // Função que vasculha os bônus da galera e agrupa
  const getAggregated = (categoria) => {
    const grupos = {};
    (members || []).forEach(m => {
      const b = bonus['bonus:' + m.id];
      if (b && b[categoria]) {
        const palpite = b[categoria];
        if (!grupos[palpite]) grupos[palpite] = [];
        grupos[palpite].push(m);
      }
    });
    
    // Transforma em array e ordena do mais votado pro menos votado
    return Object.entries(grupos)
      .map(([palpite, users]) => ({ palpite, users }))
      .sort((a, b) => b.users.length - a.users.length);
  };

  const agrupados = getAggregated(rxTab);

  return (
    <div>
      {/* Se já estiver travado, mostra o controle superior para ver o Raio-X */}
      {locked && (
        <div className="seg" style={{ marginBottom: 15 }}>
          <button className={view === 'meu' ? 'on' : ''} onClick={() => setView('meu')}>Meu Palpite</button>
          <button className={view === 'raiox' ? 'on' : ''} onClick={() => setView('raiox')}>Raio-X da Família</button>
        </div>
      )}

      {view === 'meu' && (
        <>
          <div className="eyebrow">Palpites de bônus</div>
          <div className="card">
            <p className="hint">
              {locked ? '🔒 Já travaram — o prazo encerrou. Acompanhe no Raio-X!' : 'Você pode alterar seus palpites de bônus até o fim do dia 22/06 (segunda-feira).'}
            </p>
            
            <div style={{ marginBottom: 12 }}>
              <label className="lb">Campeão <b style={{ color: 'var(--ouro-dk)' }}>+50</b></label>
              <select className="fld" disabled={locked} value={v.campeao} onChange={e => setV({ ...v, campeao: e.target.value })} style={{ marginBottom: 0 }}>
                <option value="">Selecione o país...</option>
                {paises.map(p => <option key={p} value={p}>{FLG[p]} {p}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="lb">Vice-campeão <b style={{ color: 'var(--ouro-dk)' }}>+25</b></label>
              <select className="fld" disabled={locked} value={v.vice} onChange={e => setV({ ...v, vice: e.target.value })} style={{ marginBottom: 0 }}>
                <option value="">Selecione o país...</option>
                {paises.map(p => <option key={p} value={p}>{FLG[p]} {p}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="lb">Artilheiro <b style={{ color: 'var(--ouro-dk)' }}>+30</b></label>
              <select 
                className="fld" 
                disabled={locked} 
                value={isOutro ? 'Outro' : v.artilheiro} 
                onChange={e => {
                  if (e.target.value === 'Outro') {
                    setIsOutro(true);
                    setV({ ...v, artilheiro: '' });
                  } else {
                    setIsOutro(false);
                    setV({ ...v, artilheiro: e.target.value });
                  }
                }}
                style={{ marginBottom: isOutro ? 8 : 0 }}
              >
                <option value="">Selecione o jogador...</option>
                {topScorers.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="Outro">Outro...</option>
              </select>
              {isOutro && (
                <input 
                  className="fld" 
                  disabled={locked} 
                  value={v.artilheiro} 
                  onChange={e => setV({ ...v, artilheiro: e.target.value })} 
                  placeholder="Digite o nome e a seleção" 
                  style={{ marginBottom: 0 }}
                />
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="lb">Seleção surpresa <b style={{ color: 'var(--ouro-dk)' }}>+20</b></label>
              <select className="fld" disabled={locked} value={v.zebra} onChange={e => setV({ ...v, zebra: e.target.value })} style={{ marginBottom: 0 }}>
                <option value="">Selecione o país...</option>
                {paises.map(p => <option key={p} value={p}>{FLG[p]} {p}</option>)}
              </select>
            </div>

            {!locked && <button className="btn btn-pri" style={{ marginTop: 12 }} onClick={() => onSave(v)}>Salvar bônus</button>}
            
            {gabarito && (
              <div style={{ marginTop: 12, borderTop: '1px solid var(--linha)', paddingTop: 10 }}>
                <div className="eyebrow">Gabarito oficial</div>
                <p className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
                  <b>Campeão:</b> {FLG[gabarito.campeao]} {gabarito.campeao} <br/>
                  <b>Vice:</b> {FLG[gabarito.vice]} {gabarito.vice} <br/>
                  <b>Artilheiro:</b> {gabarito.artilheiro} <br/>
                  <b>Surpresa:</b> {FLG[gabarito.zebra]} {gabarito.zebra}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {view === 'raiox' && (
        <>
          <div className="eyebrow">Visualizar por Categoria</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <button className={`btn ${rxTab === 'campeao' ? 'btn-pri' : 'btn-ghost'}`} style={{ padding: '8px', fontSize: 13, borderRadius: 8 }} onClick={() => setRxTab('campeao')}>🏆 Campeão</button>
            <button className={`btn ${rxTab === 'vice' ? 'btn-pri' : 'btn-ghost'}`} style={{ padding: '8px', fontSize: 13, borderRadius: 8 }} onClick={() => setRxTab('vice')}>🥈 Vice</button>
            <button className={`btn ${rxTab === 'artilheiro' ? 'btn-pri' : 'btn-ghost'}`} style={{ padding: '8px', fontSize: 13, borderRadius: 8 }} onClick={() => setRxTab('artilheiro')}>⚽ Artilheiro</button>
            <button className={`btn ${rxTab === 'zebra' ? 'btn-pri' : 'btn-ghost'}`} style={{ padding: '8px', fontSize: 13, borderRadius: 8 }} onClick={() => setRxTab('zebra')}>🦓 Surpresa</button>
          </div>

          {agrupados.length === 0 ? (
             <div className="card empty"><p>Ninguém palpitou nesta categoria ainda.</p></div>
          ) : (
            agrupados.map((grupo) => (
              <div key={grupo.palpite} className="card" style={{ marginBottom: 12, padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--linha)', paddingBottom: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--vinho)' }}>
                    {/* Exibe a bandeira apenas se for país (não artilheiro) */}
                    {FLG[grupo.palpite] ? `${FLG[grupo.palpite]} ` : ''}{grupo.palpite}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--musgo)', background: '#efe6cf', padding: '2px 8px', borderRadius: 12 }}>
                    {grupo.users.length} aposta{grupo.users.length > 1 ? 's' : ''}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {grupo.users.map(u => {
                    const isMe = u.id === me.id;
                    return (
                      <div key={u.id} style={{ 
                        display: 'flex', alignItems: 'center', gap: 6, 
                        background: isMe ? '#FAF3DA' : '#f5f5f5', 
                        border: isMe ? '1px solid var(--ouro2)' : '1px solid #e0e0e0',
                        padding: '4px 8px 4px 4px', borderRadius: 20 
                      }}>
                        <div style={{ 
                          width: 22, height: 22, borderRadius: '50%', 
                          background: isMe ? 'var(--vinho)' : '#d0c8b6', 
                          color: isMe ? 'var(--ouro2)' : '#fff', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontSize: 10, fontWeight: 700 
                        }}>
                          {initials(u.name)}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--carvao)' }}>{u.name}</span>
                        <span style={{ fontSize: 11, marginLeft: 2 }}>{u.isPaying ? '💲' : '🍼'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}