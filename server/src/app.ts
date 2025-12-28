import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Main route");
});

app.use(authRoutes);
const PORT = 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
