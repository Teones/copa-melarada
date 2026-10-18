// src/components/Crest.jsx
export const Crest = () => (
  <svg className="crest" viewBox="0 0 46 54" aria-hidden="true">
    <path d="M3 4 H43 V30 C43 42 34 49 23 53 C12 49 3 42 3 30 Z" fill="#8B1A2B" stroke="#E3C15A" strokeWidth="2.5" />
    {[0, 1, 2].map(r => [0, 1].map(c => (
      <circle key={r + '-' + c} cx={16 + c * 14} cy={15 + r * 11} r="3.6" fill="#E3C15A" />
    )))}
  </svg>
);