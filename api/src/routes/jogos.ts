import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();

const schema = z.object({
  nome: z.string().min(2),
  genero: z.string().min(2),
  plataforma: z.string().min(2)
});

router.get("/", async (_req, res) => {
  res.json(await prisma.jogo.findMany({ orderBy: { nome: "asc" } }));
});

router.post("/", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  const jogo = await prisma.jogo.create({ data: parsed.data });
  return res.status(201).json(jogo);
});

router.delete("/:id", async (req, res) => {
  await prisma.jogo.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
