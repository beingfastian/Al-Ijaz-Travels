@echo off
REM ===================================================================
REM  Send a test enquiry from the website to WhatsApp.
REM
REM  Double-click this file, or from cmd:   send-test.cmd
REM
REM  First run opens a Chrome window showing a WhatsApp QR code.
REM  Scan it with the phone that owns the sending account. The login
REM  is remembered after that, so later runs go straight through.
REM
REM  Pass any flag straight through, e.g.
REM     send-test.cmd --dry
REM     send-test.cmd --travellers=4 --airport=MAN
REM ===================================================================

cd /d "%~dp0"

if not exist "out\quote\index.html" (
  echo No build found in out\ - building first. This takes a minute.
  echo.
  call npm run build
  if errorlevel 1 (
    echo.
    echo Build failed. Nothing sent.
    pause
    exit /b 1
  )
  echo.
)

node scripts\send-test-enquiry.mjs %*

echo.
echo Done. Press any key to close.
pause >nul
