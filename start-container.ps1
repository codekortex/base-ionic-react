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

Write-Host "Iniciando el contenedor Docker..." -ForegroundColor Cyan
try {
    docker-compose up -d
    Write-SuccessMessage "Contenedor Docker iniciado exitosamente."
}
catch {
    Write-ErrorMessage "Error al iniciar Docker Compose: $_"
    exit 1
}

$containerStatus = docker-compose ps --services --filter "status=running" | Select-String "android-builder"
if (-not $containerStatus) {
    Write-ErrorMessage "Error: El contenedor no está corriendo."
    docker-compose logs android-builder | Write-Host
    exit 1
}

Write-SuccessMessage "Contenedor Docker iniciado y corriendo correctamente."
