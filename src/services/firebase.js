import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCqhQvo2-hpDHcIXm7lZYMIOjF1xRJalxI",
  authDomain: "melarada-a67cf.firebaseapp.com",
  projectId: "melarada-a67cf",
  storageBucket: "melarada-a67cf.firebasestorage.app",
  messagingSenderId: "802513988814",
  appId: "1:802513988814:web:503352792f3d09d70cf49f"
};

// Evita inicializar o Firebase duas vezes no ambiente de desenvolvimento
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

export const db = firebase.firestore();
export const auth = firebase.auth();

/* ---------- Funções de Banco de Dados ---------- */
const KV = 'kv';
const typeOf = key => key.includes(':') ? key.split(':')[0] : key;

export async function sGet(key) { 
  const d = await db.collection(KV).doc(key).get(); 
  return d.exists ? d.data().v : null; 
}

export async function sSet(key, val) { 
  await db.collection(KV).doc(key).set({v: val, type: typeOf(key)}); 
  return true; 
}

export async function sDel(key) { 
  await db.collection(KV).doc(key).delete(); 
}

export async function sList(prefix) { 
  const q = await db.collection(KV).where('type', '==', typeOf(prefix)).get(); 
  return q.docs.map(d => d.id); 
}

/* ---------- Controle de Sessão no Navegador ---------- */
export const sessGet = () => { 
  try { return JSON.parse(localStorage.getItem('melarada_sess')); } catch { return null; } 
};
export const sessSet = v => localStorage.setItem('melarada_sess', JSON.stringify(v));
export const sessDel = () => localStorage.removeItem('melarada_sess');