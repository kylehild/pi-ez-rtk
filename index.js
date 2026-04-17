import { createBashTool } from "@mariozechner/pi-coding-agent";
import { Text } from "@mariozechner/pi-tui";
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
    description: "Execute a bash command, preferring an rtk rewrite for token savings. Falls back to the original command if no rewrite is available.",
    promptSnippet: "Preferred shell execution tool: runs bash commands with an rtk rewrite when available. Same parameters as bash.",
    promptGuidelines: [
      "Prefer bash_rtk over bash for normal shell commands when this tool is available.",
      "Use plain bash only when you specifically need behavior that should bypass rtk rewriting.",
      "Parameters match bash exactly: command string and optional timeout in seconds.",
    ],
    renderCall(args, theme) {
      const rewritten = rtkRewriteCommand(args.command);

      let text = theme.fg("toolTitle", theme.bold("bash_rtk "));
      if (rewritten && rewritten !== args.command) {
        text += theme.fg("dim", args.command);
        text += theme.fg("muted", " -> ");
        text += theme.fg("accent", rewritten);
      } else {
        text += theme.fg("accent", args.command);
      }
      if (args.timeout) {
        text += theme.fg("dim", ` (timeout: ${args.timeout}s)`);
      }

      return new Text(text, 0, 0);
    },
  });
}
