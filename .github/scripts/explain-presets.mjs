#!/usr/bin/env node
// Reads every preset JSON file in the repo root and prints a Markdown explanation
// of each preset: what it is for, what it extends, and what each setting and
// package rule does. The output is deterministic (no network, no LLM), so it
// always reflects the preset files exactly as committed.
//
// Usage: node .github/scripts/explain-presets.mjs [dir]
// Writes Markdown to stdout.

import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const REPO = "github>gander-settings/renovate";
const dir = process.argv[2] ?? ".";

// Links point at the exact commit in CI, at main when run locally.
const server = process.env.GITHUB_SERVER_URL ?? "https://github.com";
const repo = process.env.GITHUB_REPOSITORY ?? "gander-settings/renovate";
const ref = process.env.GITHUB_SHA ?? "main";
const blob = (file) => `${server}/${repo}/blob/${ref}/${file}`;

// renovate.json is this repo's own Renovate config, not a shareable preset.
const SKIP = new Set(["renovate.json"]);

// Presets from Renovate itself that ours extend, explained in plain words.
const KNOWN_EXTENDS = {
  "config:recommended": "Renovate's recommended defaults (Dependency Dashboard, monorepo and workspace grouping, Merge Confidence badges, ignored test/example folders)",
  "helpers:pinGitHubActionDigests": "pin GitHub Actions to commit digests (with the version as a comment)",
  ":semanticCommits": "Conventional Commits style commit messages and PR titles",
  "group:monorepos": "group packages released together from one monorepo into one PR",
  "docker:pinDigests": "pin Docker image tags in Dockerfiles, Compose files and workflows to digests",
};

// Top-level and packageRule settings, explained. Each function gets the value.
const SETTINGS = {
  enabled: (v) => (v ? "Renovate is enabled for the repo" : "Renovate is turned off: on its next run it closes its PRs and issues and deletes its branches"),
  automerge: (v) => (v ? "**automerge**: Renovate merges the PR itself once the checks pass" : "**no automerge**: the PR waits for a human review"),
  platformAutomerge: (v) => (v ? "uses the platform's native automerge (waits only for required checks)" : "Renovate merges by itself, only when **every** check on the branch is green or skipped, not only the required ones"),
  automergeStrategy: (v) => `automerge with the \`${v}\` strategy`,
  rebaseWhen: (v) => `rebase branches when: \`${v}\``,
  minimumReleaseAge: (v) => (v === null ? "no release age: updates are proposed as soon as they are released" : `wait **${v}** after a release before proposing it`),
  minimumReleaseAgeBehaviour: (v) =>
    v === "timestamp-required"
      ? "updates without a release timestamp are treated as too fresh (they wait instead of being automerged)"
      : v === "timestamp-optional"
        ? "updates without a release timestamp are not held back by the release age"
        : `release age behaviour: \`${v}\``,
  internalChecksFilter: (v) => (v === "strict" ? "do not create a branch until the release age has passed (no pending PRs)" : `internal checks filter: \`${v}\``),
  dependencyDashboard: (v) => (v ? "Dependency Dashboard issue is enabled" : "no Dependency Dashboard issue"),
  dependencyDashboardApproval: (v) => (v ? "updates wait in the Dependency Dashboard until you tick them there" : "updates do not need Dependency Dashboard approval"),
  separateMajorMinor: (v) => (v ? "major updates get their own PR, separate from minor/patch" : "major updates are combined with minor/patch"),
  separateMultipleMajor: (v) => (v ? "each major version gets its own PR" : "only the newest major gets a PR"),
  separateMultipleMinor: (v) => (v ? "each minor line gets its own PR" : "one PR per package with its newest minor"),
  separateMinorPatch: (v) => (v ? "patch updates get their own PR, separate from minor" : "patch and minor updates are combined"),
  forkProcessing: (v) => `fork processing: \`${v}\` (whether Renovate runs in forked repos)`,
  rangeStrategy: (v) => `range strategy \`${v}\`${v === "bump" ? ": raise the version constraint in the manifest, not only the lock file" : ""}`,
  allowedVersions: (v) => `only allow versions matching \`${v}\``,
  assignees: (v) => `assign PRs to ${list(v.map((a) => `@${a}`))}`,
  labels: (v) => `label PRs with ${list(v.map((l) => `\`${l}\``))}`,
  schedule: (v) => `schedule: ${list(v.map((s) => `\`${s}\``))}`,
  prBodyColumns: (v) => `PR table columns: ${list(v.map((c) => `\`${c}\``))}`,
  lockFileMaintenance: (v) => object("lock file maintenance", v),
  vulnerabilityAlerts: (v) => object("vulnerability fixes", v),
};

// packageRules matchers, explained.
const MATCHERS = {
  matchUpdateTypes: (v) => `update type ${list(v.map(code), "or")}`,
  matchManagers: (v) => `manager ${list(v.map(code), "or")}`,
  matchDatasources: (v) => `datasource ${list(v.map(code), "or")}`,
  matchPackageNames: (v) => (v.length === 1 && v[0] === "*" ? "every package" : `package ${list(v.map(code), "or")}`),
  matchDepNames: (v) => `dependency ${list(v.map(code), "or")}`,
  matchCurrentVersion: (v) => (v.startsWith("!") ? `current version not matching \`${v.slice(1)}\`` : `current version matching \`${v}\``),
  matchDepTypes: (v) => `dependency type ${list(v.map(code), "or")}`,
  matchFileNames: (v) => `file ${list(v.map(code), "or")}`,
};

const IGNORED_KEYS = new Set(["$schema", "description", "extends", "packageRules"]);

function code(v) {
  return `\`${v}\``;
}

function list(items, conjunction = "and") {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items.at(-1)}`;
}

function explain(key, value) {
  const fn = SETTINGS[key];
  if (fn) return fn(value);
  return `\`${key}\`: \`${JSON.stringify(value)}\``;
}

// Inside nested objects (lockFileMaintenance, vulnerabilityAlerts) some keys mean
// something narrower than at the top level.
const NESTED = {
  enabled: (v) => (v ? "enabled" : "disabled"),
  automerge: (v) => (v ? "automerged once the checks pass" : "never automerged"),
  minimumReleaseAge: (v) => (v === null ? "no release age, proposed right away" : `wait ${v} after a release`),
};

function object(label, value) {
  const parts = Object.entries(value).map(([k, v]) => (NESTED[k] ? NESTED[k](v) : explain(k, v)));
  return `${label}: ${parts.join("; ")}`;
}

function explainExtends(name) {
  const params = name.match(/^github>gander-settings\/renovate:(\w+)(?:\((.*)\))?$/);
  if (params) {
    const [, preset, args] = params;
    return `\`${name}\`: this repo's \`${preset}\` preset${args ? ` with arguments \`${args}\`` : ""}`;
  }
  const known = KNOWN_EXTENDS[name];
  return known ? `\`${name}\`: ${known}` : `\`${name}\``;
}

function explainRule(rule, index) {
  const lines = [];
  const matchers = Object.entries(rule)
    .filter(([k]) => k.startsWith("match"))
    .map(([k, v]) => (MATCHERS[k] ? MATCHERS[k](v) : `\`${k}\` = \`${JSON.stringify(v)}\``));
  const scope = matchers.length ? matchers.join(", and ") : "every update";
  lines.push(`${index + 1}. ${rule.description ? `**${rule.description}**` : `**Rule for ${scope}** (no description)`}`);
  lines.push(`   - Applies to: ${scope}`);

  const effects = Object.entries(rule)
    .filter(([k]) => !k.startsWith("match") && k !== "description")
    .map(([k, v]) => explain(k, v));
  if (effects.length) lines.push(`   - Effect: ${effects.join("; ")}`);
  return lines.join("\n");
}

function kind(name, preset) {
  if (name === "default") return "Base + automerge (the default preset)";
  if (name === "base") return "Base config";
  if (name === "defaults") return "Deprecated alias";
  if (/\{\{arg\d\}\}/.test(JSON.stringify(preset))) return "Parameterised modifier";
  return "Modifier";
}

function usage(name, preset) {
  const args = [...new Set(JSON.stringify(preset).match(/\{\{arg\d\}\}/g) ?? [])].sort();
  const ref = name === "default" ? REPO : `${REPO}:${name}`;
  return args.length ? `${ref}(${args.map((a) => a.slice(2, -2).replace("arg", "<arg") + ">").join(",")})` : ref;
}

function explainPreset(file) {
  const name = basename(file, ".json");
  const preset = JSON.parse(readFileSync(join(dir, file), "utf8"));
  const out = [];

  out.push(`## \`${name}\``);
  out.push("");
  out.push(`**${kind(name, preset)}** · \`${usage(name, preset)}\` · [${file}](${blob(file)})`);
  out.push("");
  for (const line of preset.description ?? []) out.push(`> ${line}`);
  if (preset.description) out.push("");

  if (preset.extends?.length) {
    out.push("**Extends**");
    out.push("");
    for (const e of preset.extends) out.push(`- ${explainExtends(e)}`);
    out.push("");
  }

  const settings = Object.entries(preset).filter(([k]) => !IGNORED_KEYS.has(k));
  if (settings.length) {
    out.push("**Settings**");
    out.push("");
    for (const [k, v] of settings) out.push(`- \`${k}\`: ${explain(k, v)}`);
    out.push("");
  }

  if (preset.packageRules?.length) {
    out.push(`**Package rules** (${preset.packageRules.length})`);
    out.push("");
    preset.packageRules.forEach((rule, i) => out.push(explainRule(rule, i)));
    out.push("");
  }

  return { name, kind: kind(name, preset), summary: (preset.description ?? [""])[0], text: out.join("\n") };
}

// default first, then base, then the rest alphabetically.
const ORDER = ["default", "base"];
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".json") && !SKIP.has(f))
  .sort((a, b) => {
    const ia = ORDER.indexOf(basename(a, ".json"));
    const ib = ORDER.indexOf(basename(b, ".json"));
    return (ia < 0 ? ORDER.length : ia) - (ib < 0 ? ORDER.length : ib) || a.localeCompare(b);
  });

const presets = files.map(explainPreset);

const md = [
  "# Renovate presets explained",
  "",
  `${presets.length} presets in \`gander-settings/renovate\`. Start \`extends\` with \`${REPO}\` (base + automerge) or \`${REPO}:base\`; every other preset is a modifier listed after it.`,
  "",
  "| Preset | Kind | Summary |",
  "| --- | --- | --- |",
  ...presets.map((p) => `| \`${p.name}\` | ${p.kind} | ${p.summary.replace(/\|/g, "\\|")} |`),
  "",
  ...presets.map((p) => p.text),
].join("\n");

process.stdout.write(`${md}\n`);
