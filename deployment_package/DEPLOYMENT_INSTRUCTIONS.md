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
