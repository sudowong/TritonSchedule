import express from "express";
import path from "path";

export const app = express();

app.get("/", (req, res) => {
  const resource = path.resolve(process.cwd(), "..", "frontend", "index.html");
  res.sendFile(resource);
});

// Delegate future endpoints below:
