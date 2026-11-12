import { prisma } from "../src/config/prisma.js";
import bcrypt from "bcryptjs";

const senha = await bcrypt.hash("admin123", 10);

await prisma.usuario.upsert({
  where: { email: "admin@arenagamer.com" },
  update: { nome: "Administrador", senha },
  create: {
    nome: "Administrador",
    email: "admin@arenagamer.com",
    senha
  }
});

const jogos = [
  { nome: "Dragon Ball: Sparking! ZERO", genero: "Luta", plataforma: "PC" },
  { nome: "Minecraft", genero: "Sandbox", plataforma: "PC" },
  { nome: "Mario Kart 8 Deluxe", genero: "Corrida", plataforma: "Nintendo Switch" },
  { nome: "Street Fighter 6", genero: "Luta", plataforma: "PlayStation" }
];

for (const jogo of jogos) {
  const existente = await prisma.jogo.findFirst({ where: { nome: jogo.nome } });
  if (!existente) await prisma.jogo.create({ data: jogo });
}

console.log("Seed concluído: usuário administrador e jogos iniciais criados.");
await prisma.$disconnect();
