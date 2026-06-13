"use client";

// Página principal do frontend.
// Gerencia abas, formulários, estado de gamificação e chamadas à API.
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
  // Estado local da página principal.
  const [activeTab, setActiveTab] = useState('simular');
  const [mensagem, setMensagem] = useState('');
  const [resultado, setResultado] = useState(null);
  const [lembretes, setLembretes] = useState([]);
  const [gamificacao, setGamificacao] = useState(null);
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
    // Sempre que o usuário trocar de aba, recarrega a gamificação.
    // Se estiver na aba de lembretes, também busca a lista de lembretes.
    if (activeTab === 'lembretes') {
      carregarLembretes();
    }
    carregarGamificacao();
  }, [activeTab]);

  async function carregarGamificacao() {
    // Busca o estado de gamificação do usuário 1.
    try {
      const dados = await getGamificacao(1);
      const old = gamificacao;
      if (old && old.conquistas && dados.conquistas) {
        const oldIds = new Set(old.conquistas.map((c) => c.id));
        const novas = dados.conquistas.filter((c) => !oldIds.has(c.id));
        if (novas.length > 0) {
          setMensagem(`Conquista desbloqueada: ${novas.map((n) => n.titulo).join(', ')}`);
        }
      }
      setGamificacao(dados);
    } catch (error) {
      // Em caso de erro, mantém o estado de gamificação nulo.
      setGamificacao(null);
    }
  }

  async function carregarLembretes() {
    // Busca os lembretes do backend e atualiza a interface.
    try {
      const dados = await getLembretes();
      setLembretes(dados);
      setMensagem('');
    } catch (error) {
      setMensagem(error.message);
    }
  }

  function handleChange(event) {
    // Atualiza o estado do formulário para qualquer campo editado.
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const nivelAtual = gamificacao ? Math.floor(gamificacao.pontos / 25) + 1 : 1;
  const xpAtual = gamificacao ? gamificacao.pontos % 25 : 0;
  const xpMaximo = 25;
  const progressoXP = Math.min(100, Math.round((xpAtual / xpMaximo) * 100));
  const questAtual = gamificacao
    ? gamificacao.conquistas.length === 0
      ? 'Desbloqueie a primeira conquista criando um lembrete'
      : 'Acumule 25 pontos para subir de nível'
    : 'Inicie sua jornada responsável.';

  async function handleSimularCLT(event) {
    // Envia a simulação de CLT para o backend e exibe o resultado.
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
    // Envia dados para comparar CLT contra PJ.
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
    // Envia a simulação de MEI ao backend.
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
    // Cria um novo lembrete no backend e atualiza a lista local.
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
    // Cadastra um novo usuário no backend.
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
    <main className="min-h-screen bg-[#081124] text-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400/70">Missão Responsável</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Início Responsável</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Transforme suas finanças em uma jornada de conquistas, decisões e metas reais.</p>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-slate-100 text-slate-950 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 text-slate-200 ring-1 ring-slate-700 hover:bg-slate-800'
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

        {gamificacao && (
          <div className="mb-6 rounded-[2rem] overflow-hidden shadow-xl shadow-cyan-500/15 border border-cyan-400/10 bg-slate-950/80">
            <div className="rpg-card">
              <div className="rpg-card-inner">
                <div className="rpg-avatar-card">
                  <div className="rpg-avatar-ring">
                    <div className="rpg-avatar">
                      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="58" fill="rgba(255,255,255,0.14)" />
                        <path d="M34 72C34 72 40 52 60 52C80 52 86 72 86 72C86 72 72 76 60 76C48 76 34 72 34 72Z" fill="white" opacity="0.92" />
                        <path d="M44 52C44 52 50 36 60 36C70 36 76 52 76 52" stroke="white" strokeWidth="6" strokeLinecap="round" />
                        <path d="M56 84C56 84 52 96 60 96C68 96 64 84 64 84" fill="white" />
                      </svg>
                    </div>
                  </div>
                  <div className="rpg-avatar-label">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-100">Aventureiro</p>
                    <h3 className="mt-1 text-2xl font-bold text-white">Nível {nivelAtual}</h3>
                  </div>
                </div>

                <div className="rpg-card-content">
                  <div className="rpg-meta">
                    <div>
                      <p className="text-sm text-slate-100/80">Pontos</p>
                      <p className="text-3xl font-semibold text-white">{gamificacao.pontos}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-100/80">Conquistas</p>
                      <p className="text-3xl font-semibold text-white">{gamificacao.conquistas.length}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {gamificacao.conquistas.slice(0, 4).map((c) => (
                      <Badge key={c.id} titulo={c.titulo} conquistado={true} />
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="rpg-xp-label">
                      <span>{xpAtual} / {xpMaximo} XP</span>
                      <span className="text-slate-200/80">Próximo nível</span>
                    </div>
                    <div className="xp-meter">
                      <div className="xp-meter-fill" style={{ width: `${progressoXP}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-4">
                    <p className="text-sm uppercase tracking-[0.25em] text-amber-100">Missão atual</p>
                    <p className="mt-2 text-white">{questAtual}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="space-y-6">
          {mensagem && <div className="rounded-3xl border border-cyan-500/10 bg-slate-900/80 p-4 text-slate-100">{mensagem}</div>}

          {activeTab === 'simular' && (
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-sm shadow-slate-900/30">
              <h2 className="text-2xl font-semibold mb-4 text-white">Simulação CLT</h2>
              <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleSimularCLT}>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Salário bruto</span>
                  <input
                    type="number"
                    name="salario_bruto"
                    value={form.salario_bruto}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Dependentes</span>
                  <input
                    type="number"
                    name="dependentes"
                    value={form.dependentes}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <div className="flex items-end">
                  <button className="inline-flex w-full justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 shadow-md shadow-sky-500/20 hover:bg-sky-400">
                    Calcular CLT
                  </button>
                </div>
              </form>

              {resultado && (
                <div className="mt-6 rounded-3xl bg-slate-900/80 p-5 text-slate-100">
                  <h3 className="text-xl font-semibold mb-3">Resultado</h3>
                  <pre className="overflow-x-auto rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-200">{JSON.stringify(resultado, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'mei' && (
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-sm shadow-slate-900/30">
              <h2 className="text-2xl font-semibold mb-4 text-white">Simulação MEI</h2>
              <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleSimularMEI}>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Faturamento mensal</span>
                  <input
                    type="number"
                    name="faturamento_mensal"
                    value={form.faturamento_mensal}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="block text-sm font-medium text-slate-200">CNAE (opcional)</span>
                  <input
                    type="text"
                    name="cnae"
                    value={form.cnae}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <div className="flex items-end sm:col-span-3">
                  <button className="inline-flex w-full justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 shadow-md shadow-sky-500/20 hover:bg-sky-400">
                    Simular MEI
                  </button>
                </div>
              </form>

              {resultado && (
                <div className="mt-6 rounded-3xl bg-slate-900/80 p-5 text-slate-100">
                  <h3 className="text-xl font-semibold mb-3">Resultado</h3>
                  <pre className="overflow-x-auto rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-200">{JSON.stringify(resultado, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lembretes' && (
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-sm shadow-slate-900/30">
              <h2 className="text-2xl font-semibold mb-4 text-white">Lembretes</h2>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCriarLembrete}>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Título</span>
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Descrição</span>
                  <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                    rows="4"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Vencimento</span>
                  <input
                    type="date"
                    name="data_vencimento"
                    value={form.data_vencimento}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Categoria</span>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  >
                    <option>FISCAL</option>
                    <option>GESTÃO</option>
                    <option>ANÁLISE</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Prioridade</span>
                  <select
                    name="prioridade"
                    value={form.prioridade}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  >
                    <option>ALTA</option>
                    <option>MÉDIA</option>
                    <option>BAIXA</option>
                  </select>
                </label>
                <div className="flex items-end sm:col-span-2">
                  <button className="inline-flex w-full justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 shadow-md shadow-sky-500/20 hover:bg-sky-400">
                    Criar lembrete
                  </button>
                </div>
              </form>

              <div className="mt-6 space-y-4">
                {lembretes.length > 0 ? (
                  lembretes.map((lembrete) => (
                    <div key={lembrete.id} className="rounded-3xl border border-slate-700 bg-slate-900/70 p-4 text-slate-200">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-white">{lembrete.titulo}</h3>
                        <span className="text-sm text-slate-400">{lembrete.categoria}</span>
                      </div>
                      <p className="mt-2 text-slate-300">{lembrete.descricao}</p>
                      <p className="mt-3 text-sm text-slate-500">Vencimento: {lembrete.data_vencimento}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 text-slate-400">Nenhum lembrete encontrado.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'usuario' && (
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6 shadow-sm shadow-slate-900/30">
              <h2 className="text-2xl font-semibold mb-4 text-white">Cadastrar usuário</h2>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCriarUsuario}>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Nome</span>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Senha</span>
                  <input
                    type="password"
                    name="senha"
                    value={form.senha}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-200">Situação atual</span>
                  <select
                    name="situacao_atual"
                    value={form.situacao_atual}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100"
                  >
                    <option>DESEMPREGADO</option>
                    <option>EMPREGADO</option>
                    <option>FREELANCER</option>
                  </select>
                </label>
                <div className="flex items-end sm:col-span-2">
                  <button className="inline-flex w-full justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 shadow-md shadow-sky-500/20 hover:bg-sky-400">
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
