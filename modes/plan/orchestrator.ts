import chalk from "chalk";
import { confirm, isCancel, spinner, text } from "@clack/prompts";
import { ToolLoopAgent, stepCountIs } from "ai";
import { getAgentModel } from "../../ai/ai.config.ts";
import { ActionTracker } from "../agent/action-tracker.ts";
import { ToolExecutor } from "../agent/tool-executor.ts";
import { createAgentTools } from "../agent/agent-tools.ts";
import { defaultAgentConfig } from "../agent/types.ts";
import { runApprovalFlow } from "../agent/approval.ts";
import { renderTerminalMarkdown } from "../../tui/terminal-md.ts";
import { generatePlan } from "./planner.ts";
import { printPlan, selectSteps } from "./selection.ts";
import type { PlanStep } from "./types.ts";
import { createWebTools } from "./web-tools.ts";


function stepPrompt(goal: string, step: PlanStep): string {
  return [`Goal: ${goal}`, `Step: ${step.title}`, step.description].join('\n');
}


export async function runPlanMode(): Promise<void> {
  console.log(chalk.bold("\n🧭 Plan Mode\n"));

  const goal = await text({ message: "What is your goal?" });
  if (isCancel(goal) || !goal.trim()) return;

  const s = spinner();
  s.start("Researching codebase/web & drafting a step-by-step plan...");

  let plan;
  try {
    plan = await generatePlan(goal);
    s.stop(chalk.green("Plan generated successfully!"));
  } catch (err: any) {
    s.stop(chalk.red("Failed to generate plan"));
    console.log(chalk.red(`\n❌ Plan Generation Error: ${err?.message || err}`));
    console.log(chalk.yellow("Tip: If using a free model, it may be temporarily busy. Try another free model in .env\n"));
    return;
  }

  printPlan(plan);

  const selected = await selectSteps(plan);
  if (selected.length === 0) return;

  const proceed = await confirm({
    message: `Execute ${selected.length} step(s)`,
    initialValue: true,
  });
  if (isCancel(proceed) || !proceed) return;

  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);

  const tools = {
    ...createAgentTools(executor),
    ...createWebTools(tracker)
  };

  for (const step of selected) {
    console.log(chalk.bold(`\n🔧 ${step.title}\n`));

    const agent = new ToolLoopAgent({
      model: getAgentModel(),
      stopWhen: stepCountIs(30),
      tools
    });

    try {
      const r = await agent.generate({ prompt: stepPrompt(plan.goal, step) });
      if (r.text) {
        console.log(renderTerminalMarkdown(r.text));
      }
    } catch (err: any) {
      console.log(chalk.red(`\n❌ Error on step ${step.title}: ${err?.message || err}\n`));
    }
  }

  const ok = await runApprovalFlow(tracker);

  if(!ok) return executor.clearStaging();

   const { errors } = executor.applyApprovedFromTracker();
  if (errors.length) {
    console.log(chalk.red('\nSome operations reported errors:\n'));
    for (const e of errors) console.log(chalk.red(`  • ${e}`));
  } else {
    console.log(chalk.green('\n✓ Applied.\n'));
  }
  executor.clearStaging();
}
