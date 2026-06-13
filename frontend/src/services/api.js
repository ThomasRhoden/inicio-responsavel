// Serviço de comunicação com o backend FastAPI.
// Centraliza a URL base e os wrappers para cada endpoint.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Função genérica para enviar requisições à API.
// Recebe o caminho relativo e opções de fetch, tratando erros JSON.
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

// Encapsula a chamada ao endpoint de criação de usuário.
export function criarUsuario(dados) {
  return fetchAPI('/usuarios', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function calcularCLT(dados) {
  // Envia salário e dependentes para calcular descontos CLT.
  return fetchAPI('/simular/clt', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function compararCLTPJ(dados) {
  // Compara os custos CLT e PJ utilizando o backend.
  return fetchAPI('/simular/clt-vs-pj', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function simularMEI(dados) {
  // Simula impostos e custo do MEI.
  return fetchAPI('/simular/mei', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

// Busca o estado de gamificação do usuário.
export function getGamificacao(usuarioId) {
  return fetchAPI(`/gamificacao/${usuarioId}`);
}

export function getLembretes() {
  // Lista lembretes já criados.
  return fetchAPI('/lembretes');
}

// Cria um novo lembrete no backend.
export function criarLembrete(dados) {
  return fetchAPI('/lembretes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}
