import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();

const schema = z.object({
  jogadorId: z.number().int().positive(),
  jogoId: z.number().int().positive(),
  data: z.string().min(1),
  horario: z.string().min(1)
});

router.get("/", async (_req, res) => {
  const reservas = await prisma.reserva.findMany({
    include: { jogador: true, jogo: true },
    orderBy: [{ data: "asc" }, { horario: "asc" }]
  });
  res.json(reservas);
});

router.post("/", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const reserva = await prisma.reserva.create({
    data: parsed.data,
    include: { jogador: true, jogo: true }
  });

  return res.status(201).json(reserva);
});

router.delete("/:id", async (req, res) => {
  await prisma.reserva.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
