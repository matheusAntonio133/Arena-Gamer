import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma.js";

const router = Router();
const secret = process.env.JWT_SECRET ?? "arena-gamer-dev-secret";

router.post("/login", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    senha: z.string().min(1)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Dados de login inválidos." });

  const usuario = await prisma.usuario.findUnique({
    where: { email: parsed.data.email }
  });

  if (!usuario || !(await bcrypt.compare(parsed.data.senha, usuario.senha))) {
    return res.status(401).json({ message: "E-mail ou senha incorretos." });
  }

  const token = jwt.sign({ userId: usuario.id }, secret, { expiresIn: "8h" });

  return res.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  });
});

export default router;
