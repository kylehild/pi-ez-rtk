# Changelog

## 0.1.0 - 2026-04-16

- Initial release
- Rewrite agent `bash` tool calls via `tool_call`
- Rewrite user whole-line `!cmd` shell input via `input`
- Leave `!!cmd` unchanged
- Avoid overriding the built-in `bash` tool for better extension composition
