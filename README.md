# pi-ez-rtk

`pi-ez-rtk` is a small Pi package that rewrites bash commands through `rtk rewrite` **without** overriding Pi's built-in `bash` tool.

This makes it easier to compose with packages like `pi-ez-worktree` that already own bash execution for cwd routing.

## What it does

- rewrites agent `bash` tool calls via the `tool_call` event
- rewrites user whole-line `!cmd` shell input via the `input` event
- leaves `!!cmd` untouched
- falls back silently when `rtk` is missing, times out, or cannot rewrite the command

## Why this exists

The original `pi-rtk` package overrides the `bash` tool. That conflicts with other extensions that also need to override `bash`, such as worktree-routing packages.

`pi-ez-rtk` takes a middleware-style approach instead:

- command rewriting belongs here
- actual bash execution stays owned by whatever package or built-in tool already handles it

## Prerequisites

- `rtk` installed and available on your `PATH`
- Pi package/runtime support for extensions written in TypeScript

## Install

```bash
pi install /Users/kylehild/pi-packages/pi-ez-rtk
```

Or try it for one run:

```bash
pi -e /Users/kylehild/pi-packages/pi-ez-rtk
```

## Works well with

- `pi-ez-worktree`
- plain built-in Pi bash behavior

## Notes

- For agent tool calls, `pi-ez-rtk` mutates the `bash` tool input before execution.
- For user shell input, `pi-ez-rtk` transforms raw `!cmd` input before normal Pi processing continues.
- It does not know anything about worktrees or any other extension explicitly.
