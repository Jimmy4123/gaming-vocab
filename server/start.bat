@echo off
REM Gaming Vocab - Proxy Server Starter para Windows
REM Este script inicia el servidor proxy para la aplicación Gaming Vocab

setlocal enabledelayedexpansion

REM Obtener el directorio del script
set PROJECT_DIR=%~dp0
set SERVER_DIR=%PROJECT_DIR%
set PORT=3000

if not "%1"=="" (
    set PORT=%1
)

echo.
echo ╔═══════════════════════════════════════════╗
echo ║   Gaming Vocab - Proxy Server             ║
echo ║   Iniciando servidor en puerto !PORT!...       ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Verificar que Node.js está instalado
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo Por favor, instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js encontrado: %NODE_VERSION%
echo.

REM Cambiar a directorio del servidor
cd /d "%SERVER_DIR%" || (
    echo ❌ Error: No se puede acceder a %SERVER_DIR%
    pause
    exit /b 1
)

REM Iniciar el servidor
echo 🚀 Iniciando servidor proxy...
echo.

set PORT=%PORT%
node proxy.js

pause
