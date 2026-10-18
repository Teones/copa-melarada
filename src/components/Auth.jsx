// src/components/Auth.jsx
import { useState } from 'react';
import { Crest } from './Crest';

export default function Auth({ members, onCreate, onLogin }) {
  const [isNew, setIsNew] = useState(members.length === 0);
  const [name, setName] = useState('');
  const [selId, setSelId] = useState('');
  const [pin, setPin] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  const submit = async () => {
    setErr('');
    if (isNew) {
      if (!name || !pin) return setErr('Preencha nome e senha.');
      if (pin.length !== 4) return setErr('A senha deve ter exatamente 4 dígitos.');
      const e = await onCreate(name, pin, code);
      if (e) setErr(e);
    } else {
      if (!selId || !pin) return setErr('Escolha seu nome ou crie seu usuário.');
      const e = await onLogin(selId, pin);
      if (e) setErr(e);
    }
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
      <div style={{ transform: 'scale(1.2)', marginBottom: 20 }}><Crest /></div>
      <h2 className="serif" style={{ color: 'var(--vinho)', margin: '0 0 24px 0' }}>COPA MELARADA</h2>
      
      <div className="card" style={{ width: '100%', maxWidth: 340 }}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 16 }}>
          {isNew ? 'Criar novo usuário' : 'Entrar no Bolão'}
        </div>
        
        {isNew ? (
          <>
            <label className="lb">Seu Nome</label>
            <input className="fld" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Simpequison 👑" />
            
            <label className="lb">Senha de 4 dígitos</label>
            <input className="fld" type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} placeholder="0000" />
            
            <label className="lb">Código da Família</label>
            <input className="fld" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Ex: MELARADA" />
          </>
        ) : (
          <>
            <label className="lb">Quem é você?</label>
            <select className="fld" value={selId} onChange={e => setSelId(e.target.value)}>
              <option value="">Selecione seu nome...</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>

            <label className="lb">Senha de 4 dígitos</label>
            <input className="fld" type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} placeholder="0000" />
          </>
        )}

        {err && <div style={{ color: '#9a1b1b', fontSize: 13, marginBottom: 12, fontWeight: 600, textAlign: 'center' }}>{err}</div>}

        <button className="btn btn-pri" style={{ width: '100%', marginBottom: 12, padding: 14 }} onClick={submit}>
          {isNew ? 'Criar Usuário' : 'Entrar'}
        </button>

        <button className="btn btn-ghost" style={{ width: '100%', fontSize: 13 }} onClick={() => { setIsNew(!isNew); setErr(''); setPin(''); }}>
          {isNew ? 'Já tenho usuário (Entrar)' : 'Criar Usuário '}
        </button>
      </div>
    </div>
  );
}