import { Telegraf } from "telegraf";
import chalk from "chalk";
import { WELCOME } from "./constants";
import { registerHandlers } from "./handlers";

export async function runTelegramMode() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = process.env.TELEGRAM_OWNER_ID;

  if (!token || !ownerId) {
    console.log(chalk.red("\n❌ Telegram configuration missing."));
    console.log(chalk.yellow("Please set TELEGRAM_BOT_TOKEN and TELEGRAM_OWNER_ID in your .env file.\n"));
    return;
  }

  let bot: Telegraf;
  try {
    bot = new Telegraf(token);
    registerHandlers(bot);
    bot.catch((err: any) => {
      console.error(chalk.red("Telegram Bot Error:"), err?.message || err);
    });

    console.log(chalk.green("\n✓ Telegram bot is running! (Keep this terminal window open, press Ctrl+C to stop)"));
  } catch (err: any) {
    console.log(chalk.red(`\n❌ Failed to start Telegram bot: ${err.message}\n`));
    return;
  }

  try {
    await bot.telegram.sendMessage(ownerId, WELCOME, { parse_mode: "Markdown" });
    console.log(chalk.green("Sent welcome message to your Telegram chat.\n"));
  } catch {}

  await bot.launch();

  await new Promise<void>((resolve) => {
    process.once("SIGINT", () => {
      bot.stop("SIGINT");
      resolve();
    });
    process.once("SIGTERM", () => {
      bot.stop("SIGTERM");
      resolve();
    });
  });
}
