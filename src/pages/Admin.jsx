// src/pages/Admin.jsx
import { useState } from 'react';
import { fmtDate, PHASE_LABEL, MULT } from '../utils';
import { FLG } from '../data/flags';

export default function Admin({ cfg, me, games, gabarito, members, onAdd, onEdit, onResult, onDel, onGab, onSeed, onUpdateMember, onDelMember, onLogout }) {
  const [t, setT] = useState('jogos');
  const [editId, setEditId] = useState(null);
  const [ng, setNg] = useState({ phase: 'grupos', group: '', home: '', homeFlag: '', away: '', awayFlag: '', kickoff: '' });
  const [g0, setG0] = useState(gabarito || { campeao: '', vice: '', artilheiro: '', zebra: '' });

  const resetForm = () => { 
    setNg({ phase: 'grupos', group: '', home: '', homeFlag: '', away: '', awayFlag: '', kickoff: '' }); 
    setEditId(null); 
  };

  const save = () => {
    if (!ng.home || !ng.away || !ng.kickoff) return;
    if (editId) {
      const orig = games.find(x => x.id === editId);
      onEdit({ ...ng, id: editId, finished: orig.finished, rh: orig.rh, ra: orig.ra });
    } else { 
      onAdd(ng); 
    }
    resetForm();
  };

  const loadEdit = (g) => {
    setNg({ phase: g.phase, group: g.group, home: g.home, homeFlag: g.homeFlag, away: g.away, awayFlag: g.awayFlag, kickoff: g.kickoff });
    setEditId(g.id); 
    setT('jogos'); 
    window.scrollTo(0, 0);
  };

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

  const [isOutroGab, setIsOutroGab] = useState(g0.artilheiro && !topScorers.includes(g0.artilheiro));

  return (
    <div>
      <div className="card" style={{ background: '#faf3da' }}>
        <div className="eyebrow">Painel do organizador</div>
        <p className="muted" style={{ fontSize: 13 }}>Código da família: <b style={{ color: 'var(--vinho)' }}>{cfg?.familyCode}</b>.</p>
      </div>
      <div className="seg">
        {['jogos', 'resultados', 'bônus', 'membros'].map(k => (
          <button key={k} className={t === k ? 'on' : ''} onClick={() => setT(k)}>{k[0].toUpperCase() + k.slice(1)}</button>
        ))}
      </div>

      {t === 'jogos' && (
        <div className="card">
          <div className="eyebrow">{editId ? 'Editar jogo' : 'Adicionar jogo'}</div>
          <div className="row2">
            <div>
              <label className="lb">Fase</label>
              <select className="fld" value={ng.phase} onChange={e => setNg({ ...ng, phase: e.target.value })}>
                {Object.keys(PHASE_LABEL).map(k => <option key={k} value={k}>{PHASE_LABEL[k]} (x{MULT[k]})</option>)}
              </select>
            </div>
            <div>
              <label className="lb">Rodada/Grupo</label>
              <input className="fld" value={ng.group} onChange={e => setNg({ ...ng, group: e.target.value })} placeholder="Grupo C · 2ª" />
            </div>
          </div>
          
          <div className="row2">
            <div>
              <label className="lb">Mandante {ng.homeFlag}</label>
              <select className="fld" value={ng.home} onChange={e => setNg({ ...ng, home: e.target.value, homeFlag: FLG[e.target.value] || '🏳️' })}>
                <option value="">Selecione...</option>
                {paises.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="lb">Visitante {ng.awayFlag}</label>
              <select className="fld" value={ng.away} onChange={e => setNg({ ...ng, away: e.target.value, awayFlag: FLG[e.target.value] || '🏳️' })}>
                <option value="">Selecione...</option>
                {paises.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          
          <label className="lb">Data e hora (Brasília)</label>
          <input 
            className="fld" 
            type="datetime-local" 
            value={ng.kickoff ? ng.kickoff.slice(0, 16) : ''} 
            onChange={e => setNg({ ...ng, kickoff: e.target.value + ':00-03:00' })} 
          />
          
          <div className="row2">
            <button className="btn btn-pri" onClick={save}>{editId ? 'Salvar alterações' : 'Adicionar jogo'}</button>
            {editId && <button className="btn btn-ghost" onClick={resetForm}>Cancelar</button>}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => { if (window.confirm('Isto apaga os jogos atuais do Firebase e recarrega os da sua base local. Continuar?')) onSeed(); }}>
            {games.length === 0 ? 'Carregar jogos da Copa' : 'Recarregar jogos oficiais'}
          </button>
        </div>
      )}

      {t === 'resultados' && (
        <div>
          {games.length === 0 ? (
            <div className="card empty"><div className="em-ic">⚙️</div><p>Nenhum jogo cadastrado.</p></div>
          ) : (
            // AQUI ESTÁ A CORREÇÃO DA ORDENAÇÃO DECRESCENTE
            [...games].sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()).map(g => <AdminResult key={g.id} g={g} onResult={onResult} onDel={onDel} onEditSelect={() => loadEdit(g)} />)
          )}
        </div>
      )}

      {t === 'bônus' && (
        <div className="card">
          <div className="eyebrow">Gabarito dos bônus</div>
          <p className="hint">Preencha no final da Copa. As opções selecionadas refletem a lista oficial de países e artilheiros.</p>
          
          <div style={{ marginBottom: 10 }}>
            <label className="lb">Campeão</label>
            <select className="fld" value={g0.campeao} onChange={e => setG0({ ...g0, campeao: e.target.value })} style={{ marginBottom: 0 }}>
              <option value="">Selecione o país vencedor...</option>
              {paises.map(p => <option key={p} value={p}>{FLG[p]} {p}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="lb">Vice-campeão</label>
            <select className="fld" value={g0.vice} onChange={e => setG0({ ...g0, vice: e.target.value })} style={{ marginBottom: 0 }}>
              <option value="">Selecione o país...</option>
              {paises.map(p => <option key={p} value={p}>{FLG[p]} {p}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="lb">Artilheiro</label>
            <select 
              className="fld" 
              value={isOutroGab ? 'Outro' : g0.artilheiro} 
              onChange={e => {
                if (e.target.value === 'Outro') {
                  setIsOutroGab(true);
                  setG0({ ...g0, artilheiro: '' });
                } else {
                  setIsOutroGab(false);
                  setG0({ ...g0, artilheiro: e.target.value });
                }
              }}
              style={{ marginBottom: isOutroGab ? 8 : 0 }}
            >
              <option value="">Selecione o jogador...</option>
              {topScorers.map(p => <option key={p} value={p}>{p}</option>)}
              <option value="Outro">Outro...</option>
            </select>
            {isOutroGab && (
              <input 
                className="fld" 
                value={g0.artilheiro} 
                onChange={e => setG0({ ...g0, artilheiro: e.target.value })} 
                placeholder="Digite o nome do jogador e a seleção" 
                style={{ marginBottom: 0 }}
              />
            )}
          </div>

          <div style={{ marginBottom: 10 }}>
            <label className="lb">Seleção surpresa</label>
            <select className="fld" value={g0.zebra} onChange={e => setG0({ ...g0, zebra: e.target.value })} style={{ marginBottom: 0 }}>
              <option value="">Selecione o país...</option>
              {paises.map(p => <option key={p} value={p}>{FLG[p]} {p}</option>)}
            </select>
          </div>

          <button className="btn btn-pri" style={{ marginTop: 12 }} onClick={() => onGab(g0)}>Salvar gabarito</button>
        </div>
      )}

      {t === 'membros' && (
        <div>
          <div className="eyebrow">Gerenciar Participantes</div>
          {members.map(m => (
            <AdminMember key={m.id} m={m} onUpdate={onUpdateMember} onDel={onDelMember} isMe={m.id === me.id} />
          ))}
        </div>
      )}

      <button className="btn btn-ghost" style={{ marginTop: 24, width: '100%', color: 'var(--vinho)' }} onClick={onLogout}>
        Sair da conta
      </button>
    </div>
  );
}

function AdminResult({ g, onResult, onDel, onEditSelect }) {
  const [h, setH] = useState(g.rh != null ? String(g.rh) : '');
  const [a, setA] = useState(g.ra != null ? String(g.ra) : '');

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{g.homeFlag} {g.home} × {g.away} {g.awayFlag}</span>
        <span className="muted" style={{ fontSize: 11 }}>{fmtDate(g.kickoff)}</span>
      </div>
      <div className="row2" style={{ alignItems: 'center' }}>
        <input className="si" style={{ width: '100%' }} value={h} onChange={e => setH(e.target.value.replace(/\D/g, '').slice(0, 2))} inputMode="numeric" placeholder="0" />
        <input className="si" style={{ width: '100%' }} value={a} onChange={e => setA(e.target.value.replace(/\D/g, '').slice(0, 2))} inputMode="numeric" placeholder="0" />
      </div>
      <div className="row2" style={{ marginTop: 8 }}>
        <button className="btn btn-gold" onClick={() => { if (h !== '' && a !== '') onResult(g, h, a); }} style={{ fontSize: 13, padding: '12px 6px' }}>{g.finished ? 'Salvar' : 'Lançar'}</button>
        <button className="btn btn-ghost" onClick={onEditSelect} style={{ fontSize: 13, padding: '12px 6px' }}>Editar Info</button>
        <button className="btn btn-ghost" onClick={() => { if (window.confirm('Remover este jogo?')) onDel(g); }} style={{ fontSize: 13, padding: '12px 6px' }}>Excluir</button>
      </div>
      {g.finished && <div className="res">✔ Encerrado {g.rh} × {g.ra}</div>}
    </div>
  );
}

function AdminMember({ m, onUpdate, onDel, isMe }) {
  const [edit, setEdit] = useState(false);
  const [nm, setNm] = useState(m.name);
  const [pin, setPin] = useState(m.pin);
  // Estado local para o pagamento
  const [pay, setPay] = useState(m.isPaying || false);

  if (edit) {
    return (
      <div className="card">
        <div className="eyebrow">Editando participante</div>
        <label className="lb">Nome</label>
        <input className="fld" value={nm} onChange={e => setNm(e.target.value)} />
        <label className="lb">Senha (4 dígitos)</label>
        <input className="fld" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" />
        
        {/* Checkbox para editar o status do pagamento */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', padding: 10, borderRadius: 6 }}>
          <input type="checkbox" id={`pay-${m.id}`} checked={pay} onChange={e => setPay(e.target.checked)} style={{ width: 18, height: 18 }} />
          <label htmlFor={`pay-${m.id}`} style={{ fontSize: 14, fontWeight: 'bold', color: pay ? '#2e7d32' : 'var(--carvao)', cursor: 'pointer' }}>
            {pay ? 'Pagamento Confirmado 🤑' : 'Aguardando Pagamento 🍼'}
          </label>
        </div>

        <div className="row2" style={{ marginTop: 16 }}>
          <button className="btn btn-pri" onClick={() => { onUpdate(m.id, nm, pin, pay); setEdit(false); }}>Salvar</button>
          <button className="btn btn-ghost" onClick={() => setEdit(false)}>Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--carvao)' }}>{m.name} {isMe ? '(Você)' : ''}</div>
        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Senha: {m.pin} · {m.role === 'admin' ? 'Organizador' : 'Membro'}</div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        
        {/* Botão de Atalho Inteligente para alternar o pagamento direto da lista */}
        <button 
          className="btn btn-ghost" 
          style={{ 
            padding: '6px 10px', 
            fontSize: 11, 
            fontWeight: 'bold',
            background: m.isPaying ? '#e8f5e9' : '#fff0f0', 
            color: m.isPaying ? '#2e7d32' : '#d32f2f', 
            border: `1px solid ${m.isPaying ? '#2e7d32' : '#d32f2f'}` 
          }} 
          onClick={() => {
            const novoStatus = !m.isPaying;
            setPay(novoStatus); // Atualiza estado local
            onUpdate(m.id, nm, pin, novoStatus); // Salva no banco de dados
          }}
        >
          {m.isPaying ? '🤑 Pago' : '🍼 Cobrar'}
        </button>

        <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setEdit(true)}>Editar</button>
        {!isMe && (
          <button className="btn btn-ghost" style={{ padding: '6px', fontSize: 12, color: 'var(--vinho)' }} onClick={() => { if(window.confirm(`Excluir ${m.name} permanentemente do bolão?`)) onDel(m.id); }}>❌</button>
        )}
      </div>
    </div>
  );
}