import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();

const schema = z.object({
  nome: z.string().min(2),
  cpf: z.string().min(3),
  telefone: z.string().min(3),
  email: z.string().email()
});

router.get("/", async (_req, res) => {
  res.json(await prisma.jogador.findMany({ orderBy: { nome: "asc" } }));
});

router.post("/", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados inválidos." });

  try {
    const jogador = await prisma.jogador.create({ data: parsed.data });
    return res.status(201).json(jogador);
  } catch {
    return res.status(409).json({ message: "CPF ou e-mail já cadastrado." });
  }
});

router.delete("/:id", async (req, res) => {
  await prisma.jogador.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
