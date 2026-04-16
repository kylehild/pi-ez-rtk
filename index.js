import { createBashTool } from "@mariozechner/pi-coding-agent";
import { spawnSync } from "node:child_process";

const REWRITE_TIMEOUT_MS = 5000;
const RTK_REWRITE_FOUND_CODES = new Set([0, 3]);

function rtkRewriteCommand(command) {
  const result = spawnSync("rtk", ["rewrite", command], {
    encoding: "utf-8",
    timeout: REWRITE_TIMEOUT_MS,
  });

  if (result.error) return undefined;

  const rewritten = (result.stdout ?? "").trimEnd();
  if (!RTK_REWRITE_FOUND_CODES.has(result.status) || !rewritten) return undefined;
  return rewritten;
}

export default function (pi) {
  const tool = createBashTool(process.cwd(), {
    spawnHook: ({ command, cwd, env }) => ({
      command: rtkRewriteCommand(command) ?? command,
      cwd,
      env,
    }),
  });

  pi.registerTool({
    ...tool,
    name: "bash_rtk",
    label: "Bash RTK",
    description: "Execute a bash command, first attempting to rewrite it through rtk for token savings. Falls back to the original command if no rewrite is available.",
    promptSnippet: "Execute a bash command, attempting an rtk rewrite first. Same parameters as bash.",
    promptGuidelines: [
      "Use bash_rtk when you want shell execution with optional rtk rewriting.",
      "Parameters match bash: command string and optional timeout in seconds.",
    ],
  });
}
