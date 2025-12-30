import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import channelRoutes from "./routes/channel.routes";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Main route");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", channelRoutes);
app.use("/api/v1", messageRoutes);
const PORT = 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
