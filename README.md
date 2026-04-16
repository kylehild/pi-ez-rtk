# pi-ez-rtk

`pi-ez-rtk` adds a `bash_rtk` Pi tool.

`bash_rtk` behaves like Pi's normal `bash` tool, but first tries:

```bash
rtk rewrite <command>
```

If RTK returns a rewrite, the rewritten command is executed. Otherwise the original command runs unchanged.

## Why this shape

This package adds a new tool instead of overriding `bash`.

That makes it easier to use alongside packages like `pi-ez-worktree` that already own `bash` for cwd routing, while still giving an explicit RTK-enabled shell tool in sessions where custom tools are exposed.

## Install

```bash
pi install git:github.com/kylehild/pi-ez-rtk
```

Or local path:

```bash
pi install /Users/kylehild/pi-packages/pi-ez-rtk
```

## Usage

Ask Pi to use the `bash_rtk` tool explicitly.

Examples:

- "Run `git status` with `bash_rtk`"
- "Use `bash_rtk` to run `ls -al`"

## Notes

- `bash_rtk` takes the same parameters as `bash`: `command` and optional `timeout`.
- If `rtk rewrite` returns a supported rewrite, that rewritten command runs.
- If RTK has no rewrite or fails, the original command runs unchanged.
