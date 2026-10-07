import { connectDatabase } from './config/database.js';
import { createApp } from './app.js';
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
export const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
const app = createApp();
async function startServer() {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
        console.log(`OctoFit Tracker API listening at ${baseUrl}`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start OctoFit Tracker API:', error);
    process.exit(1);
});
