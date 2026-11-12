export type Plataforma = "PC" | "PlayStation" | "Xbox" | "Nintendo Switch";

export interface Jogador {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

export interface Jogo {
  id: number;
  nome: string;
  genero: string;
  plataforma: Plataforma;
}

export interface Reserva {
  id: number;
  jogadorId: number;
  jogoId: number;
  data: string;
  horario: string;
  jogador: Jogador;
  jogo: Jogo;
}

export interface Dashboard {
  jogadores: number;
  jogos: number;
  reservasHoje: number;
}
