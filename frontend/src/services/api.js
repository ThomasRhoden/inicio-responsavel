const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchAPI(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.detail || 'Erro na requisição à API');
  }

  return response.json();
}

export function criarUsuario(dados) {
  return fetchAPI('/usuarios', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function calcularCLT(dados) {
  return fetchAPI('/simular/clt', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function compararCLTPJ(dados) {
  return fetchAPI('/simular/clt-vs-pj', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function simularMEI(dados) {
  return fetchAPI('/simular/mei', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function getGamificacao(usuarioId) {
  return fetchAPI(`/gamificacao/${usuarioId}`);
}

export function getLembretes() {
  return fetchAPI('/lembretes');
}

export function criarLembrete(dados) {
  return fetchAPI('/lembretes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}
