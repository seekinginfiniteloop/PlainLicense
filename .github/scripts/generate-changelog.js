// .github/src/generate-changelog.ts
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
var licensesDir = path.join("docs", "licenses");
var projectChangelogPath = "docs/CHANGELOG.md";
function getLastTag() {
  try {
    return execSync("git describe --tags --abbrev=0").toString().trim();
  } catch (error) {
    return "";
  }
}
function getCommitsSince(tag) {
  const command = tag ? `git log ${tag}..HEAD --format="%h|%s|%b"` : 'git log --format="%h|%s|%b"';
  return execSync(command).toString().trim().split("\n\n").filter(Boolean);
}
function parseCommit(commitString) {
  const [hash, subject, body] = commitString.split("|");
  const match = subject.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/);
  if (match) {
    const [, type, scope, description] = match;
    return {
      hash,
      type,
      // Explicitly cast to CommitType
      scope: scope || void 0,
      description,
      body
    };
  }
  return void 0;
}
var changeCategoryMap = /* @__PURE__ */ new Map([
  ["subs", "minor"],
  ["feat", "minor"],
  ["script", "minor"],
  ["admin", "patch"],
  ["fix", "patch"],
  ["content", "patch"]
]);
function categorizeChange(type) {
  return changeCategoryMap.get(type) || "other";
}
function appendToChangelogSections(changelogSections, category, entry) {
  changelogSections[category] += entry;
}
function writeChangelogFile(filePath, content) {
  fs.writeFileSync(filePath, content);
}
async function generateChangelog() {
  const lastTag = getLastTag();
  let projectChangelog = "# Changelog\n\n";
  const licenseChangelogs = {};
  const commits = getCommitsSince(lastTag);
  const changelogSections = {
    minor: "## Minor Changes\n\n",
    patch: "## Patch Changes\n\n",
    other: "## Other Changes\n\n"
  };
  commits.forEach((commit) => {
    const parsedCommit = parseCommit(commit);
    if (parsedCommit) {
      const { hash, type, scope, description, body } = parsedCommit;
      const changeCategory = categorizeChange(type);
      const changeEntry = `- ${type}${scope ? `(${scope})` : ""}: ${description} (${hash})
`;
      appendToChangelogSections(changelogSections, changeCategory, changeEntry);
      if (scope && scope.includes("-")) {
        if (!licenseChangelogs[scope]) {
          licenseChangelogs[scope] = "# Changelog\n\n";
        }
        licenseChangelogs[scope] += changeEntry;
      }
      if (body.includes("BREAKING CHANGE:")) {
        const breakingChange = body.split("BREAKING CHANGE:")[1].trim();
        changelogSections.minor = `## Breaking Changes

- ${breakingChange}

` + changelogSections.minor;
      }
    }
  });
  Object.values(changelogSections).forEach((section) => {
    if (section.split("\n").length > 2) {
      projectChangelog += section + "\n";
    }
  });
  writeChangelogFile(projectChangelogPath, projectChangelog);
  Object.entries(licenseChangelogs).forEach(([license, changelog]) => {
    const [category, name] = license.split("-");
    const licenseDir = path.join(licensesDir, category, name);
    const licenseChangelogPath = path.join(licenseDir, "CHANGELOG.md");
    writeChangelogFile(licenseChangelogPath, changelog);
  });
  console.log("Changelogs generated successfully.");
}
generateChangelog();
