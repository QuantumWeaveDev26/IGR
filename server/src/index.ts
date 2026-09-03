import { buildServer } from './app.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const app = buildServer(config);

const port = Number(process.env.PORT || config.PORT || 3000);
const host = process.env.HOST || config.HOST || '0.0.0.0';

async function start() {
  try {
    await app.listen({
      port,
      host
    });
    app.log.info(`🚀 IGR Gateway running on http://${host}:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();

export { app, buildServer };
