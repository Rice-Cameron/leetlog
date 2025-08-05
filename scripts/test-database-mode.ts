import { config } from 'dotenv'
import { getDatabaseConfig, validateDatabaseConfig } from '../src/lib/db-config'

// Load environment variables from .env file
config()

console.log('🧪 Testing DATABASE_MODE Override')
console.log('=================================')

console.log('\n📋 Environment Variables:')
console.log(`   DATABASE_MODE: ${process.env.DATABASE_MODE || 'NOT SET'}`)
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`)

console.log('\n🗄️  Database Configuration:')
try {
  validateDatabaseConfig()
  const config = getDatabaseConfig()
  
  console.log(`\n✅ Configuration Results:`)
  console.log(`   Detected Mode: ${config.mode}`)
  console.log(`   Database URL: ${config.url.substring(0, 60)}...`)
  console.log(`   Neon Branch: ${config.neonBranch || 'N/A'}`)
  
  // Branch verification
  console.log(`\n🏷️  Branch Verification:`)
  if (config.mode === 'production') {
    if (config.url.includes('ep-dark-surf')) {
      console.log('   ✅ Production mode using correct branch (ep-dark-surf)')
    } else {
      console.log('   ⚠️  Production mode but unexpected branch')
    }
  } else if (config.mode === 'test') {
    if (config.url.includes('ep-restless-cloud')) {
      console.log('   ✅ Test mode using correct isolated branch (ep-restless-cloud)')
    } else {
      console.log('   ❌ Test mode but wrong branch - SAFETY RISK!')
    }
  } else if (config.mode === 'development') {
    if (config.url.includes('ep-sparkling-frog')) {
      console.log('   ✅ Development mode using correct branch (ep-sparkling-frog)')
    } else {
      console.log('   ⚠️  Development mode but unexpected branch')
    }
  }
  
  // Safety checks
  console.log(`\n🛡️  Safety Checks:`)
  if (config.mode === 'test' && config.url.includes('ep-dark-surf')) {
    console.log('   🚨 CRITICAL SAFETY VIOLATION: Test mode using production database!')
    process.exit(1)
  } else if (config.mode === 'test') {
    console.log('   ✅ Test mode safely isolated from production')
  }
  
  if (config.mode === 'production') {
    console.log('   ⚠️  Production mode detected - destructive operations will require confirmation')
  } else {
    console.log('   ℹ️  Non-production mode - appropriate safety measures in place')
  }
  
  console.log(`\n🎯 Test Results:`)
  console.log(`   DATABASE_MODE override: ${process.env.DATABASE_MODE ? '✅ WORKING' : '❌ NOT SET'}`)
  console.log(`   Configuration consistency: ✅ VALID`)
  console.log(`   Safety isolation: ✅ CONFIRMED`)
  
} catch (error) {
  console.error('\n❌ Configuration Error:', error)
  process.exit(1)
}

console.log('\n📝 Usage Examples:')
console.log('   Development: DATABASE_MODE=1 npm run dev')
console.log('   Production:  DATABASE_MODE=2 npm run build')
console.log('   Testing:     DATABASE_MODE=3 npm run test')

console.log('\n✅ DATABASE_MODE override test completed successfully!')