# Changelog

## 0.2.0 - 2026-04-16

- Replace the old bash tool mutation approach with an explicit `bash_rtk` tool
- Run commands through `rtk rewrite` before execution when a rewrite is available
- Keep the normal `bash` tool untouched to avoid conflicts with packages like `pi-ez-worktree`

## 0.1.0 - 2026-04-16

- Initial release
- Rewrite agent `bash` tool calls via `tool_call`
- Rewrite user whole-line `!cmd` shell input via `input`
- Leave `!!cmd` unchanged
- Avoid overriding the built-in `bash` tool for better extension composition
