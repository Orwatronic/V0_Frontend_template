#!/usr/bin/env tsx

import { execSync } from "child_process"

try {
  console.log("🔍 Running i18n key validation...\n")

  // Run the i18n key checker
  const output = execSync("tsx scripts/check-i18n-keys.ts", {
    encoding: "utf-8",
    cwd: process.cwd(),
  })

  console.log(output)
} catch (error: any) {
  console.log("Script output:")
  console.log(error.stdout || error.message)

  if (error.status !== 0) {
    console.log("\n❌ Found i18n issues that need to be fixed")
  }
}
