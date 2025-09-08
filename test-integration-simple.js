#!/usr/bin/env node

/**
 * Simple Integration Test for Customer Feedback System
 * Tests both frontend and backend connectivity
 */

const http = require('http');

// Test configuration
const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';

// Simple HTTP GET request function
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data.substring(0, 100) + '...',
          });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test functions
async function testBackendHealth() {
  console.log('🔍 Testing Backend Health...');
  try {
    const result = await makeRequest(`${BACKEND_URL}/health`);
    if (result.status === 200) {
      console.log('✅ Backend is healthy');
      console.log(`   Status: ${result.data.status}`);
      console.log(`   Uptime: ${result.data.uptime}s`);
      return true;
    } else {
      console.log(`❌ Backend health check failed: ${result.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend not accessible: ${error.message}`);
    return false;
  }
}

async function testFrontendHealth() {
  console.log('🔍 Testing Frontend Health...');
  try {
    const result = await makeRequest(FRONTEND_URL);
    if (result.status === 200) {
      console.log('✅ Frontend is running');
      console.log('   Next.js application loaded successfully');
      return true;
    } else {
      console.log(`❌ Frontend not accessible: ${result.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Frontend not accessible: ${error.message}`);
    return false;
  }
}

async function testBackendAPI() {
  console.log('🔍 Testing Backend API Endpoints...');
  const endpoints = ['/api/health', '/api/departments', '/api/team', '/api/statistics'];

  let passedTests = 0;

  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(`${BACKEND_URL}${endpoint}`);
      if (result.status === 200) {
        console.log(`   ✅ ${endpoint} - Working`);
        passedTests++;
      } else {
        console.log(`   ❌ ${endpoint} - Failed (${result.status})`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
    }
  }

  console.log(`✅ API Tests: ${passedTests}/${endpoints.length} passed`);
  return passedTests === endpoints.length;
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Integration Tests...\n');

  const results = await Promise.all([testBackendHealth(), testFrontendHealth(), testBackendAPI()]);

  const allPassed = results.every((result) => result === true);

  console.log('\n📊 Test Results Summary:');
  console.log(`   Backend Health: ${results[0] ? '✅' : '❌'}`);
  console.log(`   Frontend Health: ${results[1] ? '✅' : '❌'}`);
  console.log(`   API Endpoints: ${results[2] ? '✅' : '❌'}`);

  if (allPassed) {
    console.log('\n🎉 All tests passed! Your application is ready for use.');
    console.log('\n📱 Access your application:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   Backend API: ${BACKEND_URL}/api`);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the services.');
  }

  process.exit(allPassed ? 0 : 1);
}

// Run the tests
runTests().catch(console.error);
