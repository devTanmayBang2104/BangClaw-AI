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
    bot.launch();
    console.log(chalk.green("\n✓ Telegram bot is running! (Press Ctrl+C to stop)"));
  } catch (err: any) {
    console.log(chalk.red(`\n❌ Failed to start Telegram bot: ${err.message}\n`));
    return;
  }

  try {
    await bot.telegram.sendMessage(ownerId, WELCOME, { parse_mode: "Markdown" });
    console.log(chalk.green("Sent welcome message to your Telegram chat.\n"));
  } catch {
    console.log(
      chalk.cyan(
        "📱 Action needed: Open your bot in Telegram and tap 'START': https://t.me/BangClaw4bot\n"
      )
    );
  }

  await new Promise<void>((resolve) => {
    const stop = () => {
      bot.stop("SIGINT");
      resolve();
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
}
