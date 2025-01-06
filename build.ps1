$ErrorActionPreference = "Stop"

function Write-ErrorMessage {
    param (
        [string]$Message
    )
    Write-Host $Message -ForegroundColor Red
}

function Write-SuccessMessage {
    param (
        [string]$Message
    )
    Write-Host $Message -ForegroundColor Green
}

if (-not (Get-Command "docker-compose" -ErrorAction SilentlyContinue)) {
    Write-ErrorMessage "Error: docker-compose no está instalado."
    exit 1
}

$containerStatus = docker-compose ps --services --filter "status=running" | Select-String "android-builder"
if (-not $containerStatus) {
    Write-ErrorMessage "Error: El contenedor no está corriendo. Ejecuta primero start-container.ps1."
    exit 1
}

Write-Host "Verificando que el contenedor esté listo..." -ForegroundColor Cyan
for ($i=1; $i -le 30; $i++) {
    try {
        docker-compose exec android-builder bash -c "exit" -ErrorAction Stop
        Write-Host "Contenedor está listo." -ForegroundColor Green
        break
    }
    catch {
        Write-Host "Esperando... ($i/30)" -ForegroundColor Yellow
        Start-Sleep -Seconds 1
    }
}

if (-not (docker-compose ps | Select-String "android-builder" | Select-String "Up")) {
    Write-ErrorMessage "Error: El contenedor no está corriendo."
    docker-compose logs android-builder | Write-Host
    exit 1
}

Write-Host "Ejecutando comandos de compilación dentro del contenedor..." -ForegroundColor Cyan
try {
    docker-compose exec android-builder bash -c "
        set -e
        npm install &&
        ionic build &&
        ionic cap sync android &&
        cd android &&
        ./gradlew assembleRelease
    "
    Write-SuccessMessage "Compilación completada exitosamente."
    Write-Host "El APK se encuentra en android/app/build/outputs/apk/release/" -ForegroundColor Yellow
}
catch {
    Write-ErrorMessage "Error: La compilación falló."
    docker-compose logs android-builder | Write-Host
    exit 1
}
