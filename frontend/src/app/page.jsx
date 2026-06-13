"use client";

import { useEffect, useState } from 'react';
import {
  criarUsuario,
  calcularCLT,
  compararCLTPJ,
  simularMEI,
  getLembretes,
  criarLembrete,
  getGamificacao,
} from '../services/api';
import Badge from '../components/Badge';

const tabs = [
  { id: 'simular', label: 'Simular salários' },
  { id: 'mei', label: 'Simular MEI' },
  { id: 'lembretes', label: 'Lembretes' },
  { id: 'usuario', label: 'Cadastrar usuário' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('simular');
  const [mensagem, setMensagem] = useState('');
  const [resultado, setResultado] = useState(null);
  const [lembretes, setLembretes] = useState([]);
  const [gamificacao, setGamificacao] = useState(null);
  const [prevGamificacao, setPrevGamificacao] = useState(null);
  const [form, setForm] = useState({
    salario_bruto: 3500,
    dependentes: 0,
    faturamento_mensal: 5000,
    cnae: '',
    titulo: '',
    descricao: '',
    data_vencimento: '',
    categoria: 'FISCAL',
    prioridade: 'MEDIA',
    nome: '',
    email: '',
    senha: '',
    situacao_atual: 'DESEMPREGADO',
  });

  useEffect(() => {
    if (activeTab === 'lembretes') {
      carregarLembretes();
    }
    // carregar gamificação sempre que a página carregar
    carregarGamificacao();
  }, [activeTab]);

  async function carregarGamificacao() {
    try {
      const dados = await getGamificacao(1);
      // detectar novas conquistas em comparação com o estado anterior
      const old = gamificacao;
      if (old && old.conquistas && dados.conquistas) {
        const oldIds = new Set(old.conquistas.map((c) => c.id));
        const novas = dados.conquistas.filter((c) => !oldIds.has(c.id));
        if (novas.length > 0) {
          setMensagem(`Conquista desbloqueada: ${novas.map((n) => n.titulo).join(', ')}`);
        }
      }
      setPrevGamificacao(old);
      setGamificacao(dados);
    } catch (error) {
      // não bloquear a UI por erro da gamificação
      setGamificacao(null);
    }
  }

  async function carregarLembretes() {
    try {
      const dados = await getLembretes();
      setLembretes(dados);
      setMensagem('');
    } catch (error) {
      setMensagem(error.message);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSimularCLT(event) {
    event.preventDefault();
    setMensagem('Carregando...');
    try {
      const dados = await calcularCLT({
        salario_bruto: Number(form.salario_bruto),
        dependentes: Number(form.dependentes),
      });
      setResultado(dados);
      setMensagem('Simulação CLT concluída.');
        carregarGamificacao();
    } catch (error) {
      setMensagem(error.message);
      setResultado(null);
    }
  }

  async function handleCompararCLTPJ(event) {
    event.preventDefault();
    setMensagem('Carregando...');
    try {
      const dados = await compararCLTPJ({
        salario_bruto: Number(form.salario_bruto),
        dependentes: Number(form.dependentes),
      });
      setResultado(dados);
      setMensagem('Comparação CLT vs PJ concluída.');
    } catch (error) {
      setMensagem(error.message);
      setResultado(null);
    }
  }

  async function handleSimularMEI(event) {
    event.preventDefault();
    setMensagem('Carregando...');
    try {
      const dados = await simularMEI({
        faturamento_mensal: Number(form.faturamento_mensal),
        cnae: form.cnae || undefined,
      });
      setResultado(dados);
      setMensagem('Simulação MEI concluída.');
    } catch (error) {
      setMensagem(error.message);
      setResultado(null);
    }
  }

  async function handleCriarLembrete(event) {
    event.preventDefault();
    setMensagem('Salvando lembrete...');
    try {
      await criarLembrete({
        titulo: form.titulo,
        descricao: form.descricao,
        data_vencimento: form.data_vencimento,
        categoria: form.categoria,
        prioridade: form.prioridade,
      });
      setMensagem('Lembrete criado com sucesso.');
      setForm((prev) => ({ ...prev, titulo: '', descricao: '', data_vencimento: '' }));
      carregarLembretes();
        carregarGamificacao();
    } catch (error) {
      setMensagem(error.message);
    }
  }

  async function handleCriarUsuario(event) {
    event.preventDefault();
    setMensagem('Salvando usuário...');
    try {
      await criarUsuario({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        situacao_atual: form.situacao_atual,
      });
      setMensagem('Usuário cadastrado com sucesso.');
      setForm((prev) => ({ ...prev, nome: '', email: '', senha: '' }));
    } catch (error) {
      setMensagem(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Início Responsável</h1>
          <p className="mt-2 text-slate-600">Teste as simulações e lembretes diretamente no frontend.</p>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setResultado(null);
                setMensagem('');
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Painel de gamificação */}
        {gamificacao && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Pontos: {gamificacao.pontos}</h3>
                <p className="text-sm text-slate-600">Conquistas desbloqueadas: {gamificacao.conquistas.length}</p>
              </div>
              <div className="flex gap-2">
                {gamificacao.conquistas.slice(0, 6).map((c) => (
                  <Badge key={c.id} titulo={c.titulo} conquistado={true} />
                ))}
              </div>
            </div>
          </div>
        )}

        <section className="space-y-6">
          {mensagem && <div className="rounded-xl bg-slate-100 p-4 text-slate-800">{mensagem}</div>}

          {activeTab === 'simular' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Simulação CLT</h2>
              <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleSimularCLT}>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Salário bruto</span>
                  <input
                    type="number"
                    name="salario_bruto"
                    value={form.salario_bruto}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Dependentes</span>
                  <input
                    type="number"
                    name="dependentes"
                    value={form.dependentes}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <div className="flex items-end">
                  <button className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm hover:bg-slate-700">
                    Calcular CLT
                  </button>
                </div>
              </form>

              {resultado && (
                <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                  <h3 className="text-xl font-semibold mb-3">Resultado</h3>
                  <pre className="overflow-x-auto rounded-2xl bg-slate-100 p-4 text-sm text-slate-800">{JSON.stringify(resultado, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'mei' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Simulação MEI</h2>
              <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleSimularMEI}>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Faturamento mensal</span>
                  <input
                    type="number"
                    name="faturamento_mensal"
                    value={form.faturamento_mensal}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="block text-sm font-medium">CNAE (opcional)</span>
                  <input
                    type="text"
                    name="cnae"
                    value={form.cnae}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <div className="flex items-end sm:col-span-3">
                  <button className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm hover:bg-slate-700">
                    Simular MEI
                  </button>
                </div>
              </form>

              {resultado && (
                <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                  <h3 className="text-xl font-semibold mb-3">Resultado</h3>
                  <pre className="overflow-x-auto rounded-2xl bg-slate-100 p-4 text-sm text-slate-800">{JSON.stringify(resultado, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lembretes' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Lembretes</h2>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCriarLembrete}>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Título</span>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Data de vencimento</span>
                  <input
                    type="date"
                    name="data_vencimento"
                    value={form.data_vencimento}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="block text-sm font-medium">Descrição</span>
                  <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                    rows={4}
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Categoria</span>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  >
                    <option>FISCAL</option>
                    <option>TRABALHISTA</option>
                    <option>PESSOAL</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Prioridade</span>
                  <select
                    name="prioridade"
                    value={form.prioridade}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  >
                    <option>BAIXA</option>
                    <option>MEDIA</option>
                    <option>ALTA</option>
                  </select>
                </label>
                <div className="flex items-end sm:col-span-2">
                  <button className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm hover:bg-slate-700">
                    Criar lembrete
                  </button>
                </div>
              </form>

              <div className="mt-6 grid gap-4">
                {lembretes.length === 0 ? (
                  <p className="text-slate-600">Nenhum lembrete encontrado.</p>
                ) : (
                  lembretes.map((item) => (
                    <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <h3 className="text-lg font-semibold">{item.titulo}</h3>
                      <p className="text-sm text-slate-600">{item.descricao}</p>
                      <p className="mt-2 text-sm">Vencimento: {item.data_vencimento}</p>
                      <p className="text-sm">Categoria: {item.categoria} • Prioridade: {item.prioridade}</p>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'usuario' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Cadastrar novo usuário</h2>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCriarUsuario}>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Nome</span>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Senha</span>
                  <input
                    type="password"
                    name="senha"
                    value={form.senha}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium">Situação atual</span>
                  <select
                    name="situacao_atual"
                    value={form.situacao_atual}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  >
                    <option>DESEMPREGADO</option>
                    <option>ESTAGIARIO</option>
                    <option>MENOR_APRENDIZ</option>
                    <option>CLT</option>
                    <option>PJ</option>
                    <option>MEI</option>
                    <option>ME</option>
                    <option>SIMPLES_NACIONAL</option>
                  </select>
                </label>
                <div className="flex items-end sm:col-span-2">
                  <button className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm hover:bg-slate-700">
                    Cadastrar usuário
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
