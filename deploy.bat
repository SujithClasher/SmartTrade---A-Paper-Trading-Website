@echo off
echo ========================================
echo SmartTrade - Vercel Deployment Helper
echo ========================================
echo.

echo Step 1: Setting up Git...
git branch -M main
echo Done!
echo.

echo Step 2: Committing files...
git commit -m "SmartTrade - Professional Paper Trading Platform"
echo Done!
echo.

echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Create repository on GitHub:
echo    Go to: https://github.com/new
echo    Name: smarttrade
echo    Click: Create repository
echo.
echo 2. Then run these commands (replace YOUR_USERNAME):
echo    git remote add origin https://github.com/YOUR_USERNAME/smarttrade.git
echo    git push -u origin main
echo.
echo 3. Deploy on Vercel:
echo    Go to: https://vercel.com
echo    Click: Add New Project
echo    Import: smarttrade repository
echo    Add Environment Variable:
echo      Name: NEXT_PUBLIC_FINNHUB_API_KEY
echo      Value: d3u7nh1r01qvr0dlrr0gd3u7nh1r01qvr0dlrr10
echo    Click: Deploy
echo.
echo ========================================
pause
