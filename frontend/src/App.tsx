import { useEffect, useState } from "react";
import { api, setToken } from "./api";
import type { Dashboard, Jogador, Jogo, Reserva } from "@arena-gamer/shared";

type Tela = "dashboard" | "jogadores" | "jogos" | "reservas";

export default function App() {
  const [token, setTokenState] = useState(localStorage.getItem("arena_token"));
  const [tela, setTela] = useState<Tela>("dashboard");

  useEffect(() => setToken(token), [token]);

  if (!token) {
    return <Login onLogin={(value) => {
      localStorage.setItem("arena_token", value);
      setTokenState(value);
    }} />;
  }

  return (
    <Layout tela={tela} setTela={setTela} logout={() => {
      localStorage.removeItem("arena_token");
      setTokenState(null);
    }}>
      {tela === "dashboard" && <DashboardPage />}
      {tela === "jogadores" && <JogadoresPage />}
      {tela === "jogos" && <JogosPage />}
      {tela === "reservas" && <ReservasPage />}
    </Layout>
  );
}

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("admin@arenagamer.com");
  const [senha, setSenha] = useState("admin123");
  const [erro, setErro] = useState("");

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    try {
      const { data } = await api.post("/auth/login", { email, senha });
      onLogin(data.token);
    } catch {
      setErro("E-mail ou senha incorretos.");
    }
  }

  return (
    <main className="login">
      <form className="login-card" onSubmit={entrar}>
        <div className="logo">🎮</div>
        <h1>Arena Gamer</h1>
        <p>Entre para gerenciar sua arena.</p>
        <label>E-mail</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <label>Senha</label>
        <input value={senha} onChange={e => setSenha(e.target.value)} type="password" />
        {erro && <div className="error">{erro}</div>}
        <button>Entrar</button>
      </form>
    </main>
  );
}

function Layout({ tela, setTela, logout, children }: {
  tela: Tela; setTela: (t: Tela) => void; logout: () => void; children: React.ReactNode;
}) {
  return (
    <div className="app">
      <aside>
        <div className="brand">🎮 <span>Arena Gamer</span></div>
        <nav>
          <button className={tela === "dashboard" ? "active" : ""} onClick={() => setTela("dashboard")}>🏠 Dashboard</button>
          <button className={tela === "jogadores" ? "active" : ""} onClick={() => setTela("jogadores")}>👤 Jogadores</button>
          <button className={tela === "jogos" ? "active" : ""} onClick={() => setTela("jogos")}>🎮 Jogos</button>
          <button className={tela === "reservas" ? "active" : ""} onClick={() => setTela("reservas")}>📅 Reservas</button>
        </nav>
        <button className="logout" onClick={logout}>Sair</button>
      </aside>
      <section className="content">{children}</section>
    </div>
  );
}

function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => { api.get("/dashboard").then(r => setData(r.data)); }, []);

  return (
    <>
      <Header title="Dashboard" subtitle="Visão geral da Arena Gamer" />
      <div className="cards">
        <Card title="Jogadores" value={data?.jogadores ?? "..."} icon="👤" />
        <Card title="Jogos" value={data?.jogos ?? "..."} icon="🎮" />
        <Card title="Reservas hoje" value={data?.reservasHoje ?? "..."} icon="📅" />
      </div>
      <div className="welcome">
        <h2>Bem-vindo à Arena Gamer!</h2>
        <p>Gerencie jogadores, jogos e reservas em um só lugar.</p>
      </div>
    </>
  );
}

function Card({ title, value, icon }: { title: string; value: number | string; icon: string }) {
  return <div className="card"><span className="card-icon">{icon}</span><div><small>{title}</small><strong>{value}</strong></div></div>;
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return <header><div><h1>{title}</h1><p>{subtitle}</p></div></header>;
}

function JogadoresPage() {
  const [items, setItems] = useState<Jogador[]>([]);
  const [form, setForm] = useState({ nome: "", cpf: "", telefone: "", email: "" });

  async function carregar() { setItems((await api.get("/jogadores")).data); }
  useEffect(() => { carregar(); }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/jogadores", form);
    setForm({ nome: "", cpf: "", telefone: "", email: "" });
    carregar();
  }

  async function excluir(id: number) { await api.delete(`/jogadores/${id}`); carregar(); }

  return (
    <>
      <Header title="Jogadores" subtitle="Cadastre e gerencie os jogadores da arena." />
      <FormCard title="Novo jogador" onSubmit={salvar}>
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
        <input placeholder="CPF" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} />
        <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} />
        <input placeholder="E-mail" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      </FormCard>
      <Table headers={["Nome", "CPF", "Telefone", "E-mail", "Ação"]}>
        {items.map(i => <tr key={i.id}><td>{i.nome}</td><td>{i.cpf}</td><td>{i.telefone}</td><td>{i.email}</td><td><button className="danger" onClick={() => excluir(i.id)}>Excluir</button></td></tr>)}
      </Table>
    </>
  );
}

function JogosPage() {
  const [items, setItems] = useState<Jogo[]>([]);
  const [form, setForm] = useState({ nome: "", genero: "", plataforma: "PC" });

  async function carregar() { setItems((await api.get("/jogos")).data); }
  useEffect(() => { carregar(); }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/jogos", form);
    setForm({ nome: "", genero: "", plataforma: "PC" });
    carregar();
  }

  async function excluir(id: number) { await api.delete(`/jogos/${id}`); carregar(); }

  return (
    <>
      <Header title="Jogos" subtitle="Cadastre os jogos disponíveis na arena." />
      <FormCard title="Novo jogo" onSubmit={salvar}>
        <input placeholder="Nome do jogo" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
        <input placeholder="Gênero" value={form.genero} onChange={e => setForm({...form, genero: e.target.value})} />
        <select value={form.plataforma} onChange={e => setForm({...form, plataforma: e.target.value})}>
          <option>PC</option><option>PlayStation</option><option>Xbox</option><option>Nintendo Switch</option>
        </select>
      </FormCard>
      <Table headers={["Jogo", "Gênero", "Plataforma", "Ação"]}>
        {items.map(i => <tr key={i.id}><td>{i.nome}</td><td>{i.genero}</td><td>{i.plataforma}</td><td><button className="danger" onClick={() => excluir(i.id)}>Excluir</button></td></tr>)}
      </Table>
    </>
  );
}

function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [form, setForm] = useState({ jogadorId: "", jogoId: "", data: "", horario: "" });

  async function carregar() {
    const [r, j, g] = await Promise.all([api.get("/reservas"), api.get("/jogadores"), api.get("/jogos")]);
    setReservas(r.data); setJogadores(j.data); setJogos(g.data);
  }
  useEffect(() => { carregar(); }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/reservas", {
      ...form,
      jogadorId: Number(form.jogadorId),
      jogoId: Number(form.jogoId)
    });
    setForm({ jogadorId: "", jogoId: "", data: "", horario: "" });
    carregar();
  }

  async function excluir(id: number) { await api.delete(`/reservas/${id}`); carregar(); }

  return (
    <>
      <Header title="Reservas" subtitle="Agende horários para os jogadores." />
      <FormCard title="Nova reserva" onSubmit={salvar}>
        <select value={form.jogadorId} onChange={e => setForm({...form, jogadorId: e.target.value})}>
          <option value="">Selecione o jogador</option>
          {jogadores.map(j => <option key={j.id} value={j.id}>{j.nome}</option>)}
        </select>
        <select value={form.jogoId} onChange={e => setForm({...form, jogoId: e.target.value})}>
          <option value="">Selecione o jogo</option>
          {jogos.map(j => <option key={j.id} value={j.id}>{j.nome}</option>)}
        </select>
        <input type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})} />
        <input type="time" value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} />
      </FormCard>
      <Table headers={["Jogador", "Jogo", "Data", "Horário", "Ação"]}>
        {reservas.map(r => <tr key={r.id}><td>{r.jogador.nome}</td><td>{r.jogo.nome}</td><td>{r.data}</td><td>{r.horario}</td><td><button className="danger" onClick={() => excluir(r.id)}>Excluir</button></td></tr>)}
      </Table>
    </>
  );
}

function FormCard({ title, onSubmit, children }: { title: string; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode }) {
  return <form className="form-card" onSubmit={onSubmit}><h2>{title}</h2><div className="form-grid">{children}</div><button>Salvar</button></form>;
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
