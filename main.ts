// Nippon Data Atlas — hand-in program.
//
// Copies the site (app/) and its screenshots (screenshots/) into the output
// directory and writes the dossier buildDossier produces from them.
// Standard library only; reads nothing from the network; writes the same
// bytes on every run, so the grader's two runs agree.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The repository root is the directory this file lives in.
const REPO_ROOT = dirname(fileURLToPath(import.meta.url));

// The grader writes to /output; outside it, MAKEFUN_OUTPUT_DIR stands in.
const OUTPUT_DIR = resolve(
  process.env.MAKEFUN_OUTPUT_DIR ?? "/output",
);

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16 * 1024 * 1024,
  app_path_max_bytes: 1000,
};

function fail(message: string): never {
  throw new Error("nippon-data-atlas main: " + message);
}

function main(): void {
  const appDir = join(REPO_ROOT, "app");
  const shotsDir = join(REPO_ROOT, "screenshots");
  if (!existsSync(appDir)) fail("app/ is missing from the repository");
  if (!existsSync(join(appDir, "index.html"))) fail("app/index.html is missing");
  if (!existsSync(shotsDir)) fail("screenshots/ is missing from the repository");

  // Clear the output directory's contents without removing the directory
  // itself: the grader mounts /output, and removing a mount point fails
  // (rmSync on it throws EBUSY, which killed the first graded run).
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const entry of readdirSync(OUTPUT_DIR)) {
    rmSync(join(OUTPUT_DIR, entry), { recursive: true, force: true });
  }
  cpSync(appDir, join(OUTPUT_DIR, "app"), { recursive: true });
  cpSync(shotsDir, join(OUTPUT_DIR, "screenshots"), { recursive: true });

  const dossier = buildDossier(OUTPUT_DIR, CAPS);
  writeFileSync(join(OUTPUT_DIR, "dossier.json"), dossier);

  // Report what was handed in, so a human running this by hand can see
  // at a glance that the output is complete.
  const appCount = countFiles(join(OUTPUT_DIR, "app"));
  const shotCount = countFiles(join(OUTPUT_DIR, "screenshots"));
  console.log(
    "nippon-data-atlas: wrote " + appCount + " app files, " + shotCount +
    " screenshots, dossier.json (" + dossier.length + " bytes) to " + OUTPUT_DIR,
  );
}

function countFiles(dir: string): number {
  let total = 0;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    total += statSync(path).isDirectory() ? countFiles(path) : 1;
  }
  return total;
}

main();
