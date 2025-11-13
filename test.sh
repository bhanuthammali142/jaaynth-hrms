#!/bin/bash

# HRMS Quick Test Script
# This script performs basic validation of the HRMS setup

echo "🧪 HRMS Quick Test Script"
echo "=========================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
  local test_name=$1
  local command=$2
  
  TESTS_RUN=$((TESTS_RUN + 1))
  echo -n "Testing: $test_name... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

echo "1. Checking Prerequisites"
echo "-------------------------"

run_test "Node.js installed" "node --version"
run_test "npm installed" "npm --version"
run_test "PostgreSQL installed" "psql --version"

echo ""
echo "2. Checking Project Structure"
echo "-----------------------------"

run_test "Server directory exists" "[ -d server ]"
run_test "Client directory exists" "[ -d client ]"
run_test "Package.json exists" "[ -f package.json ]"
run_test "Client package.json exists" "[ -f client/package.json ]"
run_test ".env.example exists" "[ -f .env.example ]"

echo ""
echo "3. Checking Server Files"
echo "------------------------"

run_test "Server index.js exists" "[ -f server/index.js ]"
run_test "Database config exists" "[ -f server/config/database.js ]"
run_test "Auth routes exist" "[ -f server/routes/auth.js ]"
run_test "Job routes exist" "[ -f server/routes/jobs.js ]"
run_test "Application routes exist" "[ -f server/routes/applications.js ]"
run_test "Interview routes exist" "[ -f server/routes/interviews.js ]"
run_test "Offer routes exist" "[ -f server/routes/offers.js ]"
run_test "Dashboard routes exist" "[ -f server/routes/dashboard.js ]"
run_test "Email service exists" "[ -f server/services/emailService.js ]"
run_test "Migrations exist" "[ -f server/migrations/createTables.js ]"

echo ""
echo "4. Checking Client Files"
echo "------------------------"

run_test "Client App.jsx exists" "[ -f client/src/App.jsx ]"
run_test "Client main.jsx exists" "[ -f client/src/main.jsx ]"
run_test "Client index.css exists" "[ -f client/src/index.css ]"
run_test "Vite config exists" "[ -f client/vite.config.js ]"
run_test "Tailwind config exists" "[ -f client/tailwind.config.js ]"
run_test "Auth context exists" "[ -f client/src/context/AuthContext.jsx ]"
run_test "Login page exists" "[ -f client/src/pages/Login.jsx ]"
run_test "Dashboard page exists" "[ -f client/src/pages/Dashboard.jsx ]"
run_test "Jobs page exists" "[ -f client/src/pages/Jobs.jsx ]"

echo ""
echo "5. Checking Dependencies"
echo "------------------------"

if [ -d "node_modules" ]; then
  run_test "Root dependencies installed" "[ -d node_modules ]"
else
  echo -e "${YELLOW}⚠ Root dependencies not installed. Run 'npm install'${NC}"
  TESTS_RUN=$((TESTS_RUN + 1))
fi

if [ -d "client/node_modules" ]; then
  run_test "Client dependencies installed" "[ -d client/node_modules ]"
else
  echo -e "${YELLOW}⚠ Client dependencies not installed. Run 'cd client && npm install'${NC}"
  TESTS_RUN=$((TESTS_RUN + 1))
fi

echo ""
echo "6. Checking Configuration Files"
echo "-------------------------------"

run_test "Docker config exists" "[ -f docker-compose.yml ]"
run_test "Dockerfile exists" "[ -f Dockerfile ]"
run_test "PM2 config exists" "[ -f ecosystem.config.js ]"
run_test ".gitignore exists" "[ -f .gitignore ]"
run_test "Setup script exists" "[ -f setup.sh ]"

echo ""
echo "7. Checking Documentation"
echo "-------------------------"

run_test "README.md exists" "[ -f README.md ]"
run_test "QUICKSTART.md exists" "[ -f QUICKSTART.md ]"
run_test "API.md exists" "[ -f API.md ]"
run_test "DEPLOYMENT.md exists" "[ -f DEPLOYMENT.md ]"
run_test "USER_GUIDE.md exists" "[ -f USER_GUIDE.md ]"
run_test "TESTING_REPORT.md exists" "[ -f TESTING_REPORT.md ]"

echo ""
echo "8. Checking Uploads Directory"
echo "-----------------------------"

if [ ! -d "uploads" ]; then
  echo -e "${YELLOW}⚠ Uploads directory doesn't exist. Creating...${NC}"
  mkdir -p uploads
  touch uploads/.gitkeep
  echo -e "${GREEN}✓ Created uploads directory${NC}"
fi

run_test "Uploads directory exists" "[ -d uploads ]"

echo ""
echo "9. Environment Check"
echo "--------------------"

if [ -f ".env" ]; then
  echo -e "${GREEN}✓ .env file exists${NC}"
  
  # Check for required variables
  if grep -q "DB_HOST=" .env && \
     grep -q "DB_NAME=" .env && \
     grep -q "JWT_SECRET=" .env; then
    echo -e "${GREEN}✓ Basic environment variables configured${NC}"
  else
    echo -e "${YELLOW}⚠ Some environment variables may be missing${NC}"
  fi
else
  echo -e "${YELLOW}⚠ .env file not found. Copy .env.example to .env and configure${NC}"
fi

echo ""
echo "=========================="
echo "Test Summary"
echo "=========================="
echo -e "Total Tests: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo ""
  echo -e "${GREEN}🎉 All tests passed! Project structure is valid.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Configure .env file"
  echo "2. Run: npm install"
  echo "3. Run: cd client && npm install"
  echo "4. Run: npm run migrate (after DB is configured)"
  echo "5. Run: npm run dev"
  exit 0
else
  echo ""
  echo -e "${YELLOW}⚠ Some tests failed. Please fix the issues above.${NC}"
  exit 1
fi
