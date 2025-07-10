#!/bin/bash

# Sports Betting Calculator Pro - Deployment Script
# This script helps prepare files for cPanel deployment

echo "🏗️  Sports Betting Calculator Pro - Deployment Preparation"
echo "======================================================="

# Create deployment directory
DEPLOY_DIR="deployment_package"
mkdir -p "$DEPLOY_DIR"

# Copy frontend build files
echo "📁 Copying frontend build files..."
cp -r frontend/build/* "$DEPLOY_DIR/"

# Create backend directory
echo "📁 Creating backend directory..."
mkdir -p "$DEPLOY_DIR/api"

# Copy backend files
echo "📁 Copying backend files..."
cp backend/server.py "$DEPLOY_DIR/api/"
cp backend/requirements.txt "$DEPLOY_DIR/api/"
cp backend/.env "$DEPLOY_DIR/api/"

# Create deployment instructions
echo "📄 Creating deployment instructions..."
cat > "$DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md" << 'EOF'
# Deployment Instructions for cPanel

## Files Structure
- Frontend files: Root directory (index.html, static/, manifest.json, sw.js)
- Backend files: api/ directory (server.py, requirements.txt, .env)

## Steps:
1. Upload all files in this directory to your cPanel public_html folder
2. Set up Python App in cPanel:
   - App Root: /public_html/api/
   - App URL: yourdomain.com/api
   - Startup File: server.py
   - Application Entrypoint: app
3. Install dependencies: pip install -r requirements.txt
4. Update .env with production MongoDB URL
5. Test the application

## Demo Credentials:
- Username: admin
- Password: password123
EOF

# Create a simple version info file
echo "📄 Creating version info..."
cat > "$DEPLOY_DIR/version.txt" << EOF
Sports Betting Calculator Pro
Version: 1.0.0
Build Date: $(date)
Features: Authentication, Calculators, Analytics, PWA, Data Export
EOF

echo "✅ Deployment package created in: $DEPLOY_DIR"
echo "📝 Upload the contents of '$DEPLOY_DIR' to your cPanel public_html directory"
echo "🎯 Follow the instructions in DEPLOYMENT_INSTRUCTIONS.md"