# Zavy Skill

Generic Zavy/Zavy360 operations skill for live browser workflows, online
booking configuration, appointment blockers, and API-access limitations.

Business-specific account details belong in the relevant project repo, not in
this skill.

## Helper Scripts

- `scripts/zavy-cdp-helper.mjs` attaches to an existing authenticated
  Chrome/Brave CDP session and performs read-only Zavy tab discovery, patient
  lookup, staff lookup, schema inspection, and non-clinical note extraction.
  It prints JSON to stdout and does not write patient exports.
