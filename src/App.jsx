import { useState, useEffect, useCallback } from 'react';
import { auth, sGet, sSet, sDel, sList, sessGet, sessSet, sessDel } from './services/firebase';
import { gamePoints} from './utils';
import { Crest } from './components/Crest';
import Auth from './components/Auth';
import Inicio from './pages/Inicio';
import Palpites from './pages/Palpites';
import Ranking from './pages/Ranking';
import Bonus from './pages/Bonus';
import Regras from './pages/Regras';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import { SEED } from './data/seed';

export default function App() {
  const [boot, setBoot] = useState(true);
  const [cfg, setCfg] = useState(null);
  const [members, setMembers] = useState([]);
  const [games, setGames] = useState([]);
  const [bets, setBets] = useState({});
  const [bonus, setBonus] = useState({});
  const [gabarito, setGab] = useState(null);
  const [me, setMe] = useState(null);
  const [view, setView] = useState('inicio');
  const [toast, setToast] = useState('');

  const flash = m => { setToast(m); setTimeout(() => setToast(''), 1800); };

  const load = useCallback(async () => {
    const c = await sGet('cfg'); setCfg(c);
    const mk = await sList('member:');
    const ms = (await Promise.all(mk.map(k => sGet(k)))).filter(Boolean);
    ms.sort((a, b) => a.joinedAt - b.joinedAt);
    setMembers(ms);
    const gk = await sList('game:');
    const gs = (await Promise.all(gk.map(k => sGet(k)))).filter(Boolean);
    gs.sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
    setGames(gs);
    const bk = await sList('bet:');
    const bobj = {};
    (await Promise.all(bk.map(async k => [k, await sGet(k)]))).forEach(([k, v]) => { if (v) bobj[k] = v; });
    setBets(bobj);
    const bnk = await sList('bonus:');
    const bnobj = {};
    (await Promise.all(bnk.map(async k => [k, await sGet(k)]))).forEach(([k, v]) => { if (v) bnobj[k] = v; });
    setBonus(bnobj);
    setGab(await sGet('gabarito'));
    return { c, ms };
  }, []);

  useEffect(() => {
    (async () => {
      try { await auth.signInAnonymously(); } catch (e) { console.warn(e); }
      const { ms } = await load();
      const sess = sessGet();
      if (sess) { const found = ms.find(m => m.id === sess.id); if (found) setMe(found); }
      setBoot(false);
    })();
  }, [load]);

  useEffect(() => { 
    const t = setInterval(load, 25000); 
    return () => clearInterval(t); 
  }, [load]);

  function standings() {
    const calcStats = (gList) => {
      const stats = members.map(m => {
        let pts = 0, exact = 0, correct = 0;
        gList.forEach(g => {
          const b = bets['bet:' + m.id + ':' + g.id];
          const p = gamePoints(b, g);
          if (p != null) { 
            pts += p;
            if (b.h === g.rh && b.a === g.ra) exact++;
            if (Math.sign(b.h - b.a) === Math.sign(g.rh - g.ra)) correct++;
          }
        });
        if (gabarito) { 
          const bn = bonus['bonus:' + m.id] || {};
          const eq = (x, y) => x && y && x.trim().toLowerCase() === y.trim().toLowerCase();
          if (eq(bn.campeao, gabarito.campeao)) pts += 50;
          if (eq(bn.vice, gabarito.vice)) pts += 25;
          if (eq(bn.artilheiro, gabarito.artilheiro)) pts += 30;
          if (eq(bn.zebra, gabarito.zebra)) pts += 20;
        }
        return { m, pts, exact, correct };
      });
      return stats.sort((a, b) => b.pts - a.pts || b.exact - a.exact || b.correct - a.correct || a.m.joinedAt - b.m.joinedAt);
    };

    const currentRows = calcStats(games);
    const finishedGames = games.filter(g => g.finished);

    if (finishedGames.length === 0) {
      return currentRows.map(s => ({ ...s, trend: 'same' }));
    }

    const latestKickoff = Math.max(...finishedGames.map(g => new Date(g.kickoff).getTime()));
    const previousGames = games.filter(g => g.finished && new Date(g.kickoff).getTime() < latestKickoff);
    const previousRows = calcStats(previousGames);

    const previousRankMap = {};
    previousRows.forEach((s, i) => { previousRankMap[s.m.id] = i; });

    return currentRows.map((s, i) => {
      const prevRank = previousRankMap[s.m.id];
      let trend = 'same';
      if (prevRank !== undefined) {
        if (i < prevRank) trend = 'up';
        else if (i > prevRank) trend = 'down';
      }
      return { ...s, trend };
    });
  }

  async function createAccount(name, pin, code) {
    const exists = !cfg;
    if (exists) { await sSet('cfg', { familyCode: code || 'MELARADA', adminId: null, createdAt: Date.now() }); }
    const c = exists ? { familyCode: code || 'MELARADA', adminId: null, createdAt: Date.now() } : cfg;
    if (!exists && (code || '').trim().toUpperCase() !== (c.familyCode || '').toUpperCase()) return 'Código da família errado.';
    if (members.some(m => m.name.trim().toLowerCase() === name.trim().toLowerCase())) return 'Esse nome já existe. Use Entrar.';
    const id = 'm_' + Date.now() + '_' + Math.floor(Math.random() * 999);
    const role = members.length === 0 ? 'admin' : 'membro';
    const mem = { id, name: name.trim(), pin, role, joinedAt: Date.now() };
    await sSet('member:' + id, mem);
    if (role === 'admin') { const cc = { ...c, adminId: id }; await sSet('cfg', cc); setCfg(cc); }
    sessSet({ id }); await load(); setMe(mem); setView('inicio'); return null;
  }

  async function login(id, pin) {
    const m = members.find(x => x.id === id);
    if (!m) return 'Escolha seu nome ou crie seu usuário.';
    if (m.pin !== pin) return 'Senha incorreta.';
    sessSet({ id }); setMe(m); setView('inicio'); return null;
  }

  async function logout() { sessDel(); setMe(null); }
  async function saveBet(g, h, a) { const key = 'bet:' + me.id + ':' + g.id; const b = { h: Number(h), a: Number(a), ts: Date.now() }; await sSet(key, b); setBets(prev => ({ ...prev, [key]: b })); flash('Palpite salvo!'); }
  async function saveBonus(obj) { await sSet('bonus:' + me.id, obj); setBonus(p => ({ ...p, ['bonus:' + me.id]: obj })); flash('Bônus salvo!'); }
  async function addGame(g) { const id = 'g_' + Date.now() + '_' + Math.floor(Math.random() * 999); await sSet('game:' + id, { ...g, id, finished: false, rh: null, ra: null }); await load(); flash('Jogo adicionado.'); }
  async function editGame(g) { await sSet('game:' + g.id, g); await load(); flash('Jogo atualizado.'); }
  async function setResult(g, rh, ra) { await sSet('game:' + g.id, { ...g, rh: Number(rh), ra: Number(ra), finished: true }); await load(); flash('Resultado lançado.'); }
  async function delGame(g) { await sDel('game:' + g.id); await load(); flash('Jogo removido.'); }
  async function saveGabarito(obj) { await sSet('gabarito', obj); setGab(obj); flash('Gabarito salvo.'); }
  async function seedExamples() { const old = await sList('game:'); for (const k of old) { await sDel(k); } let i = 0; for (const s of SEED) { i++; await sSet('game:g_' + Date.now() + '_' + i, { ...s, id: 'g_' + Date.now() + '_' + i, finished: false, rh: null, ra: null }); } await load(); flash('Jogos carregados!'); }

  async function updateMember(id, name, pin, isPaying) {
    const m = members.find(x => x.id === id);
    if (!m) return;
    const nm = { ...m, name: name.trim(), pin: pin.trim(), isPaying: isPaying !== undefined ? isPaying : m.isPaying };
    await sSet('member:' + id, nm);
    await load();
    flash('Participante atualizado.');
  }

  async function deleteMember(id) {
    if (me && id === me.id) {
      flash('Você não pode excluir sua própria conta.');
      return;
    }
    await sDel('member:' + id);
    await load();
    flash('Participante removido do bolão.');
  }

  if (boot) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--fundo)' }}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={{ transform: 'scale(1.5)', marginBottom: 36 }}><Crest /></div>
      <div style={{ width: 56, height: 56, border: '5px solid var(--linha)', borderTopColor: 'var(--vinho)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 24 }}></div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--carvao)', fontSize: 13, letterSpacing: 3, fontWeight: 700, marginBottom: 6 }}>CARREGANDO</div>
        <div className="serif" style={{ color: 'var(--vinho)', fontSize: 26, fontWeight: 700 }}>COPA MELARADA</div>
      </div>
    </div>
  );
  
  if (!me) return <Auth cfg={cfg} members={members} onCreate={createAccount} onLogin={login} />;

  const isAdmin = me.role === 'admin';
  const rows = standings();
  const myRank = rows.findIndex(r => r.m.id === me.id);
  const myPts = myRank >= 0 ? rows[myRank].pts : 0;

  const menuItems = [
    ['inicio', '🏰', 'Início'],
    ['palpites', '✍️', 'Palpites'],
    ['ranking', '🏆', 'Rank'],
    ['bonus', '⭐', 'Bônus'],
    ['regras', '📖', 'Regras'],
    [isAdmin ? 'admin' : 'perfil', isAdmin ? '⚙️' : '🛡️', isAdmin ? 'Admin' : 'Perfil']
  ];

  return (
    <div id="app">
      <div className="hdr">
        <div className="who" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span>{me.name}</span>
          <span style={{ fontSize: 11, marginBottom: 6 }}>{myRank === 0 ? 'Goat 🐐' : ''}</span>
          <button onClick={logout} style={{ background: '#faf3da', color: 'var(--vinho-dk)', border: 'none', fontSize: 11, fontWeight: 'bold', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            🚪 Sair
          </button>
        </div>
        <Crest />
        <div className="wm">MELARADA</div>
        <div className="sub">bolão da família melo · copa 2026</div>
      </div>

      <div className="content">
        {view === 'inicio' && <Inicio me={me} games={games} bets={bets} bonus={bonus} rows={rows} myRank={myRank} onBet={saveBet} go={setView} />}        {view === 'palpites' && <Palpites me={me} games={games} bets={bets} members={members} onBet={saveBet} />}
        {view === 'ranking' && <Ranking rows={rows} meId={me.id} />}
        {view === 'bonus' && <Bonus me={me} members={members} bonus={bonus} gabarito={gabarito} onSave={saveBonus} />}
        {view === 'regras' && <Regras />}
        {view === 'perfil' && <Perfil me={me} myPts={myPts} myRank={myRank} total={rows.length} onLogout={logout} />}
        {view === 'admin' && isAdmin && (
          <Admin 
            cfg={cfg} me={me} games={games} gabarito={gabarito} members={members}
            onAdd={addGame} onEdit={editGame} onResult={setResult} onDel={delGame} onGab={saveGabarito} 
            onSeed={seedExamples} onUpdateMember={updateMember} onDelMember={deleteMember} onLogout={logout}
          />
        )}
      </div>

      <div className="nav">
        {menuItems.map(([k, ic, lb]) => (
          <button key={k} className={'nb' + (view === k ? ' on' : '')} onClick={() => setView(k)}>
            <div className="ic">{ic}</div><div className="lab">{lb}</div>
          </button>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}