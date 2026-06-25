@echo off
setlocal EnableExtensions DisableDelayedExpansion

chcp 65001 >nul
cd /d "%~dp0"

set "PORT=8765"
set "URL=http://127.0.0.1:%PORT%/index.html"
set "CHECK_FILE=%TEMP%\mplus-python-check.txt"
set "PYTHON_EXE="
set "PYTHON_ARGS="
set "PYTHON_LABEL="
set "PYTHON_VERSION="

echo Starting Mplus Banana HTML Quick Version local server...
echo(
echo Checking for a usable Python interpreter...
echo(

call :try_exe "py" "-3" "Python launcher py -3"
if defined PYTHON_EXE goto :start_server

call :try_exe "python3" "" "python3"
if defined PYTHON_EXE goto :start_server

call :try_path "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" "Codex bundled Python"
if defined PYTHON_EXE goto :start_server

call :try_path "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" "Python 3.12"
if defined PYTHON_EXE goto :start_server

call :try_path "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" "Python 3.11"
if defined PYTHON_EXE goto :start_server

call :try_exe "python" "" "python"
if defined PYTHON_EXE goto :start_server

echo(ERROR: Python was not found, or only the Windows App Execution Alias was found.
echo(ไม่พบ Python ที่ใช้งานได้ หรือพบเฉพาะ Windows App Execution Alias
echo(
echo(Install Python from python.org, or open this folder with another static server.
echo(ติดตั้ง Python จาก python.org หรือเปิดโฟลเดอร์นี้ด้วย static server ตัวอื่น
echo(
echo(Do not double-click index.html because ES modules need a local server.
echo(ห้ามเปิด index.html ด้วยการดับเบิลคลิก เพราะ ES modules ต้องใช้ local server
echo(
pause
exit /b 1

:start_server
echo Using: %PYTHON_LABEL%
echo Python: %PYTHON_VERSION%
echo(
echo Open this URL in your browser:
echo %URL%
echo(
echo Press Ctrl+C in this window to stop the server.
echo(
echo Opening browser automatically...
start "" "%URL%"
echo(
"%PYTHON_EXE%" %PYTHON_ARGS% -m http.server %PORT% --bind 127.0.0.1
exit /b %ERRORLEVEL%

:try_exe
set "CANDIDATE_EXE=%~1"
set "CANDIDATE_ARGS=%~2"
set "CANDIDATE_LABEL=%~3"
set "FIRST_MATCH="

for /f "delims=" %%P in ('where "%CANDIDATE_EXE%" 2^>nul') do if not defined FIRST_MATCH set "FIRST_MATCH=%%P"

if defined FIRST_MATCH (
  echo %FIRST_MATCH% | findstr /i "\\WindowsApps\\python.exe" >nul
  if not errorlevel 1 (
    echo Skipping %CANDIDATE_LABEL% because it points to Windows App Execution Alias:
    echo %FIRST_MATCH%
    echo(
    exit /b 0
  )
)

"%CANDIDATE_EXE%" %CANDIDATE_ARGS% -c "import sys; print(sys.version)" > "%CHECK_FILE%" 2>nul
if errorlevel 1 exit /b 0

set /p PYTHON_VERSION=<"%CHECK_FILE%"
set "PYTHON_EXE=%CANDIDATE_EXE%"
set "PYTHON_ARGS=%CANDIDATE_ARGS%"
set "PYTHON_LABEL=%CANDIDATE_LABEL%"
exit /b 0

:try_path
set "CANDIDATE_EXE=%~1"
set "CANDIDATE_LABEL=%~2"

if not exist "%CANDIDATE_EXE%" exit /b 0

echo %CANDIDATE_EXE% | findstr /i "\\WindowsApps\\python.exe" >nul
if not errorlevel 1 exit /b 0

"%CANDIDATE_EXE%" -c "import sys; print(sys.version)" > "%CHECK_FILE%" 2>nul
if errorlevel 1 exit /b 0

set /p PYTHON_VERSION=<"%CHECK_FILE%"
set "PYTHON_EXE=%CANDIDATE_EXE%"
set "PYTHON_ARGS="
set "PYTHON_LABEL=%CANDIDATE_LABEL% (%CANDIDATE_EXE%)"
exit /b 0
