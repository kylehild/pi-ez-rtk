import { isToolCallEventType } from "@mariozechner/pi-coding-agent";
import { execFileSync } from "node:child_process";

const REWRITE_TIMEOUT_MS = 5000;

function rtkRewriteCommand(command) {
  try {
    const rewritten = execFileSync("rtk", ["rewrite", command], {
      encoding: "utf-8",
      timeout: REWRITE_TIMEOUT_MS,
    }).trimEnd();
    return rewritten || undefined;
  } catch {
    return undefined;
  }
}

function rewriteWholeLineBashInput(text) {
  const match = text.match(/^(\s*)(!!?)([\s\S]*)$/);
  if (!match) return undefined;

  const [, leading, prefix, commandPart] = match;
  if (prefix === "!!") return undefined;

  const rewritten = rtkRewriteCommand(commandPart);
  if (!rewritten) return undefined;

  return `${leading}!${rewritten}`;
}

export default function (pi) {
  pi.on("tool_call", (event) => {
    if (!isToolCallEventType("bash", event)) return;

    const rewritten = rtkRewriteCommand(event.input.command);
    if (!rewritten) return;

    event.input.command = rewritten;
  });

  pi.on("input", (event) => {
    if (event.source === "extension") return { action: "continue" };

    const rewrittenText = rewriteWholeLineBashInput(event.text);
    if (!rewrittenText) return { action: "continue" };

    return {
      action: "transform",
      text: rewrittenText,
      images: event.images,
    };
  });
}
