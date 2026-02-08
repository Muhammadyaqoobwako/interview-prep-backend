@echo off
echo Changing DNS to Google DNS (8.8.8.8, 8.8.4.4)
echo This requires Administrator privileges
echo.

REM Get the active network adapter name
for /f "tokens=1,2,3*" %%i in ('netsh interface show interface ^| findstr "Connected"') do (
    set adapter=%%l
)

echo Active adapter: %adapter%
echo.

REM Change DNS settings
netsh interface ipv4 set dns name="%adapter%" static 8.8.8.8 primary
netsh interface ipv4 add dns name="%adapter%" 8.8.4.4 index=2

echo.
echo DNS changed to Google DNS!
echo Primary DNS: 8.8.8.8
echo Secondary DNS: 8.8.4.4
echo.
echo Press any key to test connection...
pause > nul

cd /d "%~dp0"
node test-connection.js

pause
