@echo off
echo 🚀 Setting up HRMS Application...
echo.

:: Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration!
    echo    Then run this script again.
    pause
    exit
)

:: Install dependencies
echo 📦 Installing dependencies...
call npm install

echo 📦 Installing client dependencies...
cd client
call npm install
cd ..

:: Create uploads directory
echo 📁 Creating uploads directory...
if not exist uploads mkdir uploads

:: Run migrations
echo 🔄 Running database migrations...
call npm run migrate

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo    1. Review your .env configuration
echo    2. Create PostgreSQL database if not exists
echo    3. Start the application: npm run dev
echo    4. Access the app at: http://localhost:5173
echo.
pause
