import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT || 8000);
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

app.use(express.json());
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker' });
});

async function startServer(): Promise<void> {
  await mongoose.connect(connectionString);
  app.listen(port, () => {
    console.log(`OctoFit Tracker API listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start OctoFit Tracker API:', error);
  process.exit(1);
});
