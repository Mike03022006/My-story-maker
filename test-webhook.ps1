# Script para probar el webhook de n8n

$webhookUrl = "https://desarrollolmal.app.n8n.cloud/webhook/generate-story"

$body = @{
    characters = @("dragón", "princesa")
    setting = "castillo"
    storyType = "aventura"
    childName = "María"
    childAge = 8
    timestamp = (Get-Date).ToString("o")
} | ConvertTo-Json

Write-Host "Enviando petición a n8n..." -ForegroundColor Yellow
Write-Host "URL: $webhookUrl" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 60
    
    Write-Host "✅ ¡ÉXITO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Título: $($response.title)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Historia:" -ForegroundColor Cyan
    Write-Host $response.content -ForegroundColor White
    Write-Host ""
    
    if ($response.imageUrl) {
        Write-Host "Imagen: $($response.imageUrl)" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ ERROR" -ForegroundColor Red
    Write-Host ""
    Write-Host "Mensaje: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Detalles:" -ForegroundColor Yellow
    Write-Host $_.Exception -ForegroundColor White
    Write-Host ""
    Write-Host "Posibles causas:" -ForegroundColor Cyan
    Write-Host "1. El workflow no está activo en n8n" -ForegroundColor White
    Write-Host "2. La URL del webhook es incorrecta" -ForegroundColor White
    Write-Host "3. Hay un error en la configuración de OpenAI" -ForegroundColor White
    Write-Host "4. No tienes créditos en OpenAI" -ForegroundColor White
    Write-Host ""
    Write-Host "Solución:" -ForegroundColor Cyan
    Write-Host "1. Ve a n8n y verifica que el workflow esté 'Active' (verde)" -ForegroundColor White
    Write-Host "2. Verifica que la URL sea exactamente: $webhookUrl" -ForegroundColor White
    Write-Host "3. Revisa los logs en n8n (Executions)" -ForegroundColor White
}

Write-Host ""
Read-Host "Presiona Enter para cerrar"
