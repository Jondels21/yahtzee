import express from 'express';

const app = express();
const PORT = 3000;

app.get("/health", (_req, res) => {
  res.json({
    status: 'OK'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});

