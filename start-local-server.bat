@echo off
setlocal

cd /d "%~dp0"

echo Starting Mplus Banana HTML Quick Version local server...
echo.
echo Open this URL in your browser:
echo http://127.0.0.1:8765/index.html
echo.
echo Press Ctrl+C in this window to stop the server.
echo.

python -m http.server 8765 --bind 127.0.0.1

endlocal
