# Script para hacer commit y push automático a GitHub
# Uso: .\scripts\git-push.ps1 "Mensaje del commit"

param(
    [string]$commitMessage = "Actualización automática"
)

# Verificar si hay cambios
$status = git status --porcelain
if (-not $status) {
    Write-Host "No hay cambios para commitear." -ForegroundColor Yellow
    exit 0
}

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m $commitMessage

# Verificar si hay un remote configurado
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "No hay remote configurado. Configura el remote con:" -ForegroundColor Red
    Write-Host "git remote add origin https://github.com/ezealfie/TU_REPOSITORIO.git" -ForegroundColor Yellow
    exit 1
}

# Hacer push
$branch = git branch --show-current
git push -u origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "Cambios subidos exitosamente a GitHub!" -ForegroundColor Green
} else {
    Write-Host "Error al hacer push. Verifica tu conexión y permisos." -ForegroundColor Red
}

