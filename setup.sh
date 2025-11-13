#!/bin/bash

# HRMS Setup Script
echo "🚀 Setting up HRMS Application..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing!"
    echo "   Run: nano .env"
    echo ""
    read -p "Press Enter after editing .env file..."
fi

# Load environment variables
source .env

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if ! psql -h $DB_HOST -U $DB_USER -d postgres -c '\q' 2>/dev/null; then
    echo "❌ Cannot connect to PostgreSQL. Please ensure:"
    echo "   1. PostgreSQL is installed and running"
    echo "   2. Credentials in .env are correct"
    exit 1
fi

# Create database if it doesn't exist
echo "🗄️  Creating database..."
psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists, skipping..."

# Run migrations
echo "🔄 Running database migrations..."
npm run migrate

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Ask if user wants to create admin account
echo ""
read -p "👤 Do you want to create an admin account now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating admin account..."
    read -p "Admin Name: " admin_name
    read -p "Admin Email: " admin_email
    read -sp "Admin Password: " admin_password
    echo ""
    
    # Start server in background
    npm run server &
    SERVER_PID=$!
    
    # Wait for server to start
    echo "⏳ Waiting for server to start..."
    sleep 5
    
    # Create admin user
    curl -X POST http://localhost:$PORT/api/auth/register \
      -H "Content-Type: application/json" \
      -d "{\"name\":\"$admin_name\",\"email\":\"$admin_email\",\"password\":\"$admin_password\",\"role\":\"admin\"}"
    
    echo ""
    echo "✅ Admin account created!"
    
    # Stop background server
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Review your .env configuration"
echo "   2. Start the application: npm run dev"
echo "   3. Access the app at: http://localhost:5173"
echo "   4. API available at: http://localhost:$PORT"
echo ""
echo "📚 For deployment instructions, see DEPLOYMENT.md"
echo ""
