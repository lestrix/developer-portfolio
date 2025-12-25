#!/usr/bin/env tsx

/**
 * Interactive Project Initialization Script
 *
 * This script helps you customize the template for your specific project.
 * It will:
 * 1. Ask for project configuration
 * 2. Replace all template placeholders
 * 3. Rename files to match your entity names
 * 4. Remove template-specific files
 * 5. Initialize git repository
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

interface Config {
  appName: string;
  packageScope: string;
  EntityName: string;
  entityName: string;
  entityNamePlural: string;
  TableName: string;
  awsRegion: string;
}

// Default AWS regions for easy selection
const AWS_REGIONS = [
  { title: "US East (N. Virginia)", value: "us-east-1" },
  { title: "US East (Ohio)", value: "us-east-2" },
  { title: "US West (N. California)", value: "us-west-1" },
  { title: "US West (Oregon)", value: "us-west-2" },
  { title: "EU (Ireland)", value: "eu-west-1" },
  { title: "EU (Frankfurt)", value: "eu-central-1" },
  { title: "EU (London)", value: "eu-west-2" },
  { title: "EU (Paris)", value: "eu-west-3" },
  { title: "Asia Pacific (Singapore)", value: "ap-southeast-1" },
  { title: "Asia Pacific (Tokyo)", value: "ap-northeast-1" },
  { title: "Asia Pacific (Sydney)", value: "ap-southeast-2" },
];

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function promptForConfig(): Promise<Config> {
  console.log("\n🚀 Welcome to Effect Serverless Template Setup!\n");
  console.log("This wizard will help you customize the template for your project.\n");

  const questions = [
    {
      type: "text",
      name: "appName",
      message: "What is your application name? (kebab-case)",
      initial: "my-serverless-app",
      validate: (value: string) =>
        /^[a-z][a-z0-9-]*$/.test(value) || "Must be kebab-case (lowercase with hyphens)",
    },
    {
      type: "text",
      name: "packageScope",
      message: "What is your package scope? (e.g., @mycompany)",
      initial: (prev: string) => `@${prev.split("-")[0]}`,
      validate: (value: string) =>
        /^@[a-z][a-z0-9-]*$/.test(value) || "Must start with @ and be kebab-case",
    },
    {
      type: "text",
      name: "EntityName",
      message: "What is your main entity name? (PascalCase, singular)",
      initial: "Todo",
      validate: (value: string) =>
        /^[A-Z][a-zA-Z0-9]*$/.test(value) || "Must be PascalCase (e.g., Todo, BlogPost, User)",
    },
    {
      type: "text",
      name: "entityNamePlural",
      message: "What is the plural form? (camelCase)",
      initial: (prev: string) => toCamelCase(prev) + "s",
      validate: (value: string) =>
        /^[a-z][a-zA-Z0-9]*$/.test(value) || "Must be camelCase (e.g., todos, posts, users)",
    },
    {
      type: "select",
      name: "awsRegion",
      message: "Select your AWS region:",
      choices: AWS_REGIONS,
      initial: 5, // eu-central-1
    },
  ];

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log("\n❌ Setup cancelled.");
      process.exit(1);
    },
  });

  return {
    ...answers,
    entityName: toCamelCase(answers.EntityName),
    TableName: `${answers.EntityName}Table`,
  };
}

function replaceInFile(filePath: string, replacements: Record<string, string>): void {
  let content = fs.readFileSync(filePath, "utf8");

  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g");
    content = content.replace(regex, value);
  }

  fs.writeFileSync(filePath, content, "utf8");
}

function findAndReplaceInDirectory(dir: string, replacements: Record<string, string>): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip node_modules, .git, .sst, dist, and other build directories
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === ".sst" ||
      entry.name === "dist" ||
      entry.name === "build" ||
      entry.name === ".cache"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      findAndReplaceInDirectory(fullPath, replacements);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") ||
        entry.name.endsWith(".tsx") ||
        entry.name.endsWith(".json") ||
        entry.name.endsWith(".md") ||
        entry.name.endsWith(".html") ||
        entry.name.endsWith(".yml") ||
        entry.name.endsWith(".yaml"))
    ) {
      console.log(`  Updating ${path.relative(rootDir, fullPath)}`);
      replaceInFile(fullPath, replacements);
    }
  }
}

function renameEntityFiles(config: Config): void {
  console.log("\n📝 Renaming entity files...");

  // Rename Todo.ts to {EntityName}.ts
  const todoSchemaPath = path.join(rootDir, "packages/shared/src/schemas/Todo.ts");
  const entitySchemaPath = path.join(
    rootDir,
    `packages/shared/src/schemas/${config.EntityName}.ts`
  );
  if (fs.existsSync(todoSchemaPath)) {
    fs.renameSync(todoSchemaPath, entitySchemaPath);
    console.log(`  Renamed Todo.ts → ${config.EntityName}.ts`);
  }

  // Rename Todo.test.ts to {EntityName}.test.ts
  const todoTestPath = path.join(rootDir, "packages/shared/src/schemas/Todo.test.ts");
  const entityTestPath = path.join(
    rootDir,
    `packages/shared/src/schemas/${config.EntityName}.test.ts`
  );
  if (fs.existsSync(todoTestPath)) {
    fs.renameSync(todoTestPath, entityTestPath);
    console.log(`  Renamed Todo.test.ts → ${config.EntityName}.test.ts`);
  }

  // Rename TodoRepository.ts to {EntityName}Repository.ts
  const todoRepoPath = path.join(rootDir, "apps/backend/services/TodoRepository.ts");
  const entityRepoPath = path.join(
    rootDir,
    `apps/backend/services/${config.EntityName}Repository.ts`
  );
  if (fs.existsSync(todoRepoPath)) {
    fs.renameSync(todoRepoPath, entityRepoPath);
    console.log(`  Renamed TodoRepository.ts → ${config.EntityName}Repository.ts`);
  }

  // Rename TodoRepository.test.ts to {EntityName}Repository.test.ts
  const todoRepoTestPath = path.join(rootDir, "apps/backend/services/TodoRepository.test.ts");
  const entityRepoTestPath = path.join(
    rootDir,
    `apps/backend/services/${config.EntityName}Repository.test.ts`
  );
  if (fs.existsSync(todoRepoTestPath)) {
    fs.renameSync(todoRepoTestPath, entityRepoTestPath);
    console.log(`  Renamed TodoRepository.test.ts → ${config.EntityName}Repository.test.ts`);
  }
}

function cleanupTemplateFiles(): void {
  console.log("\n🧹 Cleaning up template files...");

  const filesToRemove = [
    path.join(rootDir, "packages/shared/src/schemas/Entity.template.ts"),
    path.join(rootDir, "SETUP.md"),
    path.join(rootDir, "template.config.json"),
    path.join(rootDir, "examples"),
  ];

  for (const file of filesToRemove) {
    if (fs.existsSync(file)) {
      if (fs.statSync(file).isDirectory()) {
        fs.rmSync(file, { recursive: true, force: true });
        console.log(`  Removed directory: ${path.basename(file)}`);
      } else {
        fs.unlinkSync(file);
        console.log(`  Removed file: ${path.basename(file)}`);
      }
    }
  }

  // Remove this script itself
  const scriptPath = path.join(rootDir, "scripts/init-project.ts");
  if (fs.existsSync(scriptPath)) {
    fs.unlinkSync(scriptPath);
    console.log(`  Removed script: init-project.ts`);
  }

  // Remove setup-template.ts if it exists
  const setupTemplatePath = path.join(rootDir, "scripts/setup-template.ts");
  if (fs.existsSync(setupTemplatePath)) {
    fs.unlinkSync(setupTemplatePath);
    console.log(`  Removed script: setup-template.ts`);
  }
}

function updatePackageJson(config: Config): void {
  console.log("\n📦 Updating package.json scripts...");

  const packageJsonPath = path.join(rootDir, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Remove the init script
  delete packageJson.scripts.init;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf8");
  console.log("  Removed 'init' script from package.json");
}

async function initGitRepo(): Promise<void> {
  console.log("\n📚 Would you like to initialize a new git repository?");

  const { initGit } = await prompts({
    type: "confirm",
    name: "initGit",
    message: "Initialize git repository?",
    initial: true,
  });

  if (initGit) {
    const { execSync } = await import("child_process");

    // Remove existing .git if present
    const gitDir = path.join(rootDir, ".git");
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }

    execSync("git init", { cwd: rootDir, stdio: "inherit" });
    execSync("git add .", { cwd: rootDir, stdio: "inherit" });
    execSync('git commit -m "Initial commit from effect-serverless-template"', {
      cwd: rootDir,
      stdio: "inherit",
    });

    console.log("✅ Git repository initialized with initial commit");
  }
}

async function main() {
  try {
    // Step 1: Prompt for configuration
    const config = await promptForConfig();

    // Step 2: Display configuration summary
    console.log("\n📋 Configuration Summary:");
    console.log(`  App Name:       ${config.appName}`);
    console.log(`  Package Scope:  ${config.packageScope}`);
    console.log(`  Entity Name:    ${config.EntityName} (singular)`);
    console.log(`  Entity Plural:  ${config.entityNamePlural}`);
    console.log(`  Table Name:     ${config.TableName}`);
    console.log(`  AWS Region:     ${config.awsRegion}`);

    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: "Proceed with this configuration?",
      initial: true,
    });

    if (!confirm) {
      console.log("\n❌ Setup cancelled.");
      process.exit(1);
    }

    // Step 3: Create replacements map
    const replacements = {
      "{{appName}}": config.appName,
      "{{packageScope}}": config.packageScope,
      "{{EntityName}}": config.EntityName,
      "{{entityName}}": config.entityName,
      "{{entityNamePlural}}": config.entityNamePlural,
      "{{TableName}}": config.TableName,
      "{{awsRegion}}": config.awsRegion,
      // Legacy replacements for backward compatibility
      "@todo": config.packageScope,
      "effect-serverless-todo": config.appName,
      Todo: config.EntityName,
      todo: config.entityName,
      todos: config.entityNamePlural,
      TodoTable: config.TableName,
    };

    // Step 4: Replace placeholders in all files
    console.log("\n🔄 Replacing placeholders in files...");
    findAndReplaceInDirectory(rootDir, replacements);

    // Step 5: Rename entity files
    renameEntityFiles(config);

    // Step 6: Update package.json
    updatePackageJson(config);

    // Step 7: Cleanup template files
    cleanupTemplateFiles();

    // Step 8: Initialize git repository
    await initGitRepo();

    // Success!
    console.log("\n✨ Project initialization complete!\n");
    console.log("Next steps:");
    console.log("  1. Run 'pnpm install' to install dependencies");
    console.log("  2. Run 'pnpm dev' to start the backend");
    console.log("  3. Run 'pnpm dev:frontend' to start the frontend");
    console.log("  4. Run 'pnpm deploy' to deploy to AWS\n");
    console.log(`Happy coding with your ${config.appName}! 🎉\n`);
  } catch (error) {
    console.error("\n❌ Error during setup:", error);
    process.exit(1);
  }
}

main();
