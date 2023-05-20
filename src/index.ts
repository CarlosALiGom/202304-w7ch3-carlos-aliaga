import "./loadEnviroments.js";
import createDebug from "debug";
import chalk from "chalk";
import app from "./server/index.js";
import connectToDatabase from "./database/connectToDatabase.js";

const debug = createDebug("shoppingList-api:root");

const port = process.env.PORT ?? 4005;

const mongoDbConnection = process.env.MONGODB_CONNECTION;

if (!mongoDbConnection) {
  debug("missing environment variables");
  process.exit(1);
}

try {
  await connectToDatabase(mongoDbConnection);

  debug("Connected to DataBase");
} catch (error: unknown) {
  debug(`Error connecting DataBase: ${chalk.red((error as Error).message)}`);
}

app.listen(port, () => {
  debug(chalk.blue(`Listening on http://localhost:${port}`));
});
