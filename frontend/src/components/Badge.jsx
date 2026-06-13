"use client";

// Componente visual simples para exibir um emblema de conquista.
// Usa dois estilos diferentes para mostrar se a conquista foi desbloqueada.
export default function Badge({ titulo, conquistado }) {
  // Componente simples para exibir uma badge de conquista.
  // Usa estilos diferentes para badges desbloqueadas e bloqueadas.
  return (
    <div className={`badge-pill ${conquistado ? 'badge-unlocked' : 'badge-locked'}`}>
      {conquistado ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2l2.9 5.88L21 9.24l-4.5 4.39L17.8 21 12 17.77 6.2 21l1.3-7.37L3 9.24l6.1-1.36L12 2z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      )}
      <span>{titulo}</span>
    </div>
  );
}
