import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import jogadoresRoutes from "./routes/jogadores.js";
import jogosRoutes from "./routes/jogos.js";
import reservasRoutes from "./routes/reservas.js";
import dashboardRoutes from "./routes/dashboard.js";
import { auth } from "./middleware/auth.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", auth, dashboardRoutes);
app.use("/api/jogadores", auth, jogadoresRoutes);
app.use("/api/jogos", auth, jogosRoutes);
app.use("/api/reservas", auth, reservasRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});
