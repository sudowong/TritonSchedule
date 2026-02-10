import dotenv from "dotenv";
import express from "express";
import path from "path";

// Endpoint routers
import courseRouter from "./routes/courseRouter.js";
import rmpRouter from "./routes/rmpRouter.js";
import refreshRouter from "./routes/refreshRouter.js";

// Middleware 
import { requireApiSecret } from "./middleware/requireApiSecret.js";

export const app = express(); // Set up express app

dotenv.config(); // Initialize .env variables

const PORT = 3000;

// Serve static
app.get("/", (req, res) => { // Serve index.html
  const resource = path.resolve(process.cwd(), "..", "frontend", "index.html");
  res.sendFile(resource);
});

// Middleware
app.use(express.json());

app.use(requireApiSecret); // Auth to protect internal endpoints 

// Base Routes
app.use("/course", courseRouter);

app.use("/rmp", rmpRouter);

app.use("/refresh", refreshRouter);

// Listening port
app.listen(PORT, () => {
  console.log('Server started');
});


