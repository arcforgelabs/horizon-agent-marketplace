# Horizon Pro Dental — Arc Forge Marketplace

Public, unlisted agent plugins prepared by Arc Forge Labs for Horizon Pro
Dental. This marketplace contains only Horizon-approved plugins and no patient
records, credentials, or browser sessions.

## Codex — about 2 minutes

Run these commands in a terminal:

```bash
codex plugin marketplace add arcforgelabs/horizon-agent-marketplace
codex plugin add horizon-zavy@arc-forge-horizon
```

Start a new Codex task and ask: **Use Horizon Zavy and summarise the current
screen.** Sign in to Zavy in the browser if needed; never paste a password or
patient record into chat.

## Claude Code — about 2 minutes

Run these commands inside Claude Code:

```text
/plugin marketplace add arcforgelabs/horizon-agent-marketplace
/plugin install horizon-zavy@arc-forge-horizon
```

Run `/reload-plugins` if prompted, then start a new conversation and ask:
**Use Horizon Zavy and summarise the current screen.**

## Cursor

In the team dashboard, open **Settings → Plugins → Import** and import:

```text
https://github.com/arcforgelabs/horizon-agent-marketplace
```

Publish **Horizon Zavy** as Optional or Default On and enable **Auto Refresh**.

## Updates

- Codex: `codex plugin marketplace upgrade arc-forge-horizon`, then reinstall
  or update **Horizon Zavy** if offered.
- Claude Code: `/plugin marketplace update arc-forge-horizon`, then update the
  plugin in `/plugin`.
- Cursor: enable Auto Refresh on the imported marketplace.

Open a new conversation after an update so the refreshed skill is loaded.

## Maintainer source sync

The published payload is generated from the private `arc-forge-tools` source.
From this repository, run:

```bash
npm run sync-source -- ../arc-forge-tools
npm test
```

When the payload changes, the sync command bumps the patch version across all
plugin and marketplace manifests. Review, commit, and push the generated update.
