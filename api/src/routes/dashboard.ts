import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const hoje = new Date().toISOString().slice(0, 10);

  const [jogadores, jogos, reservasHoje] = await Promise.all([
    prisma.jogador.count(),
    prisma.jogo.count(),
    prisma.reserva.count({ where: { data: hoje } })
  ]);

  res.json({ jogadores, jogos, reservasHoje });
});

export default router;
