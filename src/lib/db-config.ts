/**
 * Database Configuration Manager
 * Handles dynamic database URL selection based on DATABASE_MODE
 */

export type DatabaseMode = "development" | "production" | "test";

// Neon branch name constants
const NEON_BRANCHES = {
  PRODUCTION: "ep-dark-surf",
  DEVELOPMENT: "ep-sparkling-frog", 
  TEST: "ep-restless-cloud"
} as const;

export interface DatabaseConfig {
  mode: DatabaseMode;
  url: string;
  neonProjectId?: string;
  neonBranch?: string;
}

/**
 * Get database configuration based on DATABASE_MODE environment variable
 * Mode: 1=development, 2=production, 3=test
 */
export function getDatabaseConfig(): DatabaseConfig {
  const mode = process.env.DATABASE_MODE || "1";
  const nodeEnv = process.env.NODE_ENV || "";

  console.log(`🗄️  Database Mode: ${mode} (NODE_ENV: ${nodeEnv})`);

  // Force test mode if NODE_ENV=test (safety override)
  if (nodeEnv === "test") {
    console.log(`🔒 NODE_ENV=test detected, forcing test database`);
    return {
      mode: "test",
      url: process.env.DATABASE_URL_TEST || "",
      neonProjectId: undefined,
      neonBranch: "test-leetlog-db",
    };
  }

  switch (mode) {
    case "1": // Development
      return {
        mode: "development",
        url: process.env.DATABASE_URL_DEV || "",
        neonProjectId: process.env.NEON_PROJECT_ID_DEV,
        neonBranch: process.env.NEON_BRANCH_DEV,
      };

    case "2": // Production
      return {
        mode: "production",
        url: process.env.DATABASE_URL_PROD || "",
        neonProjectId: process.env.NEON_PROJECT_ID_PROD,
        neonBranch: process.env.NEON_BRANCH_PROD,
      };

    case "3": // Test
      return {
        mode: "test",
        url: process.env.DATABASE_URL_TEST || "",
        neonProjectId: process.env.NEON_PROJECT_ID_TEST,
        neonBranch: process.env.NEON_BRANCH_TEST,
      };

    default:
      console.warn(
        `⚠️  Unknown DATABASE_MODE: ${mode}, defaulting to development`
      );
      return {
        mode: "development",
        url: process.env.DATABASE_URL_DEV || "",
        neonProjectId: process.env.NEON_PROJECT_ID_DEV,
        neonBranch: process.env.NEON_BRANCH_DEV,
      };
  }
}

/**
 * Get the active database URL for the current mode
 */
export function getDatabaseUrl(): string {
  const config = getDatabaseConfig();

  if (!config.url) {
    const errorMsg = `Database URL not configured for ${config.mode} mode (DATABASE_MODE=${process.env.DATABASE_MODE})`;
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // Security check: ensure we never accidentally use production URL in test mode
  if (config.mode === "test" && config.url.includes(NEON_BRANCHES.PRODUCTION)) {
    throw new Error(
      "🚨 SAFETY VIOLATION: Test mode attempted to use production database!"
    );
  }

  console.log(
    `📊 Active Database: ${config.mode.toUpperCase()} (${config.url.substring(
      0,
      50
    )}...)`
  );

  // Log the specific branch for verification
  if (config.mode === "test") {
    console.log(`🧪 Test Branch: ${NEON_BRANCHES.TEST} (isolated)`);
  } else if (config.mode === "production") {
    console.log(`🏭 Production Branch: ${NEON_BRANCHES.PRODUCTION}`);
  }

  return config.url;
}

/**
 * Check if currently in production mode
 */
export function isProductionMode(): boolean {
  return getDatabaseConfig().mode === "production";
}

/**
 * Check if currently in test mode
 */
export function isTestMode(): boolean {
  return getDatabaseConfig().mode === "test";
}

/**
 * Validate database configuration and log safety status
 */
export function validateDatabaseConfig(): void {
  const config = getDatabaseConfig();

  console.log(`🔍 Database Configuration Validation:`);
  console.log(`   Mode: ${config.mode}`);
  console.log(`   URL: ${config.url ? "✅ SET" : "❌ MISSING"}`);
  console.log(`   Neon Project: ${config.neonProjectId || "N/A"}`);
  console.log(`   Neon Branch: ${config.neonBranch || "N/A"}`);

  if (!config.url) {
    throw new Error(
      `Missing database URL for ${config.mode} mode. Check your environment variables.`
    );
  }

  // Safety verification
  if (config.mode === "test") {
    if (config.url.includes(NEON_BRANCHES.PRODUCTION)) {
      throw new Error(
        "🚨 CRITICAL SAFETY ERROR: Test mode is using production database URL!"
      );
    }
    console.log(
      `✅ Safety Check: Test mode using isolated database (${NEON_BRANCHES.TEST})`
    );
  }

  if (config.mode === "production") {
    if (!config.url.includes(NEON_BRANCHES.PRODUCTION)) {
      console.warn(
        `⚠️  Warning: Production mode not using expected production branch`
      );
    }
    console.log(`✅ Production mode confirmed (${NEON_BRANCHES.PRODUCTION})`);
  }
}
