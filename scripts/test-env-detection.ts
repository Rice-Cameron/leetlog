import { getDatabaseEnvironment } from './db-utils'

console.log('🧪 Testing Environment Detection')
console.log('================================')

// Test current environment
console.log('\n1. Current Environment:')
const currentEnv = getDatabaseEnvironment()
console.log(`   Result: ${currentEnv.toUpperCase()}`)

// Test with mock environments
console.log('\n2. Testing Mock Environments:')

// Save original values
const originalDbUrl = process.env.DATABASE_URL
const originalNodeEnv = process.env.NODE_ENV

// Test production detection
console.log('\n   📊 Testing Production Detection:')
process.env.DATABASE_URL = 'postgresql://user@ep-prod-123.us-west-2.aws.neon.tech/prod'
process.env.NODE_ENV = 'production'
const prodResult = getDatabaseEnvironment()
console.log(`   ✅ Production test result: ${prodResult}`)

// Test test environment detection
console.log('\n   🧪 Testing Test Environment Detection:')
process.env.DATABASE_URL = 'postgresql://user@ep-test-123.us-west-2.aws.neon.tech/test'
process.env.NODE_ENV = 'test'
const testResult = getDatabaseEnvironment()
console.log(`   ✅ Test environment result: ${testResult}`)

// Test development detection
console.log('\n   💻 Testing Development Detection:')
process.env.DATABASE_URL = 'postgresql://localhost:5432/leetlog_dev'
process.env.NODE_ENV = 'development'
const devResult = getDatabaseEnvironment()
console.log(`   ✅ Development result: ${devResult}`)

// Restore original values
process.env.DATABASE_URL = originalDbUrl
process.env.NODE_ENV = originalNodeEnv

console.log('\n🎯 Test Results Summary:')
console.log(`   Production Detection: ${prodResult === 'production' ? '✅ PASS' : '❌ FAIL'}`)
console.log(`   Test Detection: ${testResult === 'test' ? '✅ PASS' : '❌ FAIL'}`)
console.log(`   Development Detection: ${devResult === 'development' ? '✅ PASS' : '❌ FAIL'}`)

// Validate your actual environment
console.log('\n🔍 Your Actual Environment Validation:')
console.log('   (This is what the system will use in practice)')
const actualEnv = getDatabaseEnvironment()

if (actualEnv === 'production') {
  console.log('   ⚠️  PRODUCTION ENVIRONMENT DETECTED')
  console.log('   ✅ Database safety features are ACTIVE')
  console.log('   🛡️  Destructive operations will require confirmation')
} else {
  console.log(`   ℹ️  Non-production environment (${actualEnv})`)
  console.log('   ⚠️  Make sure this is correct for your setup')
}