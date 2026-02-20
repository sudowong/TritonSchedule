import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

// FOR DEV
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

