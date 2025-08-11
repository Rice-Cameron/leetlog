import { getDatabaseEnvironment } from './db-utils'

console.log('Testing Environment Detection')
console.log('================================')

// Test current environment
console.log('\n1. Current Environment:')
const currentEnv = getDatabaseEnvironment()
console.log(`   Result: ${currentEnv.toUpperCase()}`)

// Test with mock environments
console.log('\n2. Testing Mock Environments:')

// Note: We can't directly modify NODE_ENV as it's readonly, so we'll test with different DATABASE_URL patterns
console.log('\n   Testing Production Detection (by URL pattern):')
// Mock production URL pattern
const originalDbUrl = process.env.DATABASE_URL
Object.defineProperty(process.env, 'DATABASE_URL', {
  value: 'postgresql://user@ep-dark-surf-123.us-west-2.aws.neon.tech/prod',
  writable: true,
  configurable: true
})
const prodResult = getDatabaseEnvironment()
console.log(`   Production test result: ${prodResult}`)

console.log('\n   Testing Test Environment Detection (by URL pattern):')
Object.defineProperty(process.env, 'DATABASE_URL', {
  value: 'postgresql://user@ep-restless-cloud-123.us-west-2.aws.neon.tech/test',
  writable: true,
  configurable: true
})
const testResult = getDatabaseEnvironment()
console.log(`   Test environment result: ${testResult}`)

console.log('\n   Testing Development Detection (by URL pattern):')
Object.defineProperty(process.env, 'DATABASE_URL', {
  value: 'postgresql://user@ep-sparkling-frog-123.us-west-2.aws.neon.tech/dev',
  writable: true,
  configurable: true
})
const devResult = getDatabaseEnvironment()
console.log(`   Development result: ${devResult}`)

// Restore original values
if (originalDbUrl) {
  Object.defineProperty(process.env, 'DATABASE_URL', {
    value: originalDbUrl,
    writable: true,
    configurable: true
  })
} else {
  delete process.env.DATABASE_URL
}

console.log('\n Test Results Summary:')
console.log(`   Production Detection: ${prodResult === 'production' ? 'PASS' : 'FAIL'}`)
console.log(`   Test Detection: ${testResult === 'test' ? 'PASS' : 'FAIL'}`)
console.log(`   Development Detection: ${devResult === 'development' ? 'PASS' : 'FAIL'}`)

// Validate your actual environment
console.log('\n Your Actual Environment Validation:')
console.log('   (This is what the system will use in practice)')
const actualEnv = getDatabaseEnvironment()

if (actualEnv === 'production') {
  console.log('   WARNING: PRODUCTION ENVIRONMENT DETECTED')
  console.log('   Database safety features are ACTIVE')
  console.log('   Destructive operations will require confirmation')
} else {
  console.log(`   Non-production environment (${actualEnv})`)
  console.log('   Make sure this is correct for your setup')
}