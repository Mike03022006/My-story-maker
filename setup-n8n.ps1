# Script de Configuración Automática para n8n
# Este script te guiará paso a paso

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN DE N8N PARA CUENTOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Verificar si n8n está instalado
Write-Host "Paso 1: Verificando instalación de n8n..." -ForegroundColor Yellow
$n8nInstalled = Get-Command n8n -ErrorAction SilentlyContinue

if ($n8nInstalled) {
    Write-Host "✓ n8n está instalado" -ForegroundColor Green
    $useLocal = Read-Host "¿Quieres usar n8n local? (s/n)"
} else {
    Write-Host "✗ n8n no está instalado localmente" -ForegroundColor Red
    Write-Host "Puedes usar n8n Cloud (gratis) o instalarlo localmente" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Cyan
    Write-Host "1. Usar n8n Cloud (Recomendado - No requiere instalación)" -ForegroundColor White
    Write-Host "2. Instalar n8n localmente con npm" -ForegroundColor White
    Write-Host "3. Instalar n8n localmente con Docker" -ForegroundColor White
    Write-Host ""
    $option = Read-Host "Selecciona una opción (1/2/3)"
    
    switch ($option) {
        "1" {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host "  CONFIGURACIÓN CON N8N CLOUD" -ForegroundColor Cyan
            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "1. Abriendo n8n Cloud en tu navegador..." -ForegroundColor Yellow
            Start-Process "https://n8n.io/cloud"
            Write-Host "2. Crea una cuenta gratuita" -ForegroundColor Yellow
            Write-Host "3. Verifica tu email" -ForegroundColor Yellow
            Write-Host ""
            Read-Host "Presiona Enter cuando hayas creado tu cuenta"
            
            Write-Host ""
            Write-Host "Ahora vamos a obtener tu API Key de OpenAI..." -ForegroundColor Yellow
            Start-Process "https://platform.openai.com/api-keys"
            Write-Host ""
            $openaiKey = Read-Host "Pega aquí tu API Key de OpenAI"
            
            Write-Host ""
            Write-Host "Perfecto! Ahora:" -ForegroundColor Green
            Write-Host "1. Ve a tu dashboard de n8n Cloud" -ForegroundColor White
            Write-Host "2. Crea un nuevo workflow" -ForegroundColor White
            Write-Host "3. Importa el archivo: n8n-workflow-example.json" -ForegroundColor White
            Write-Host ""
            Read-Host "Presiona Enter cuando hayas importado el workflow"
            
            Write-Host ""
            Write-Host "Configurando credenciales de OpenAI en n8n..." -ForegroundColor Yellow
            Write-Host "1. En n8n, ve a Settings > Credentials" -ForegroundColor White
            Write-Host "2. Haz clic en 'Add Credential'" -ForegroundColor White
            Write-Host "3. Busca 'OpenAI'" -ForegroundColor White
            Write-Host "4. Pega tu API Key: $openaiKey" -ForegroundColor White
            Write-Host "5. Guarda" -ForegroundColor White
            Write-Host ""
            Read-Host "Presiona Enter cuando hayas configurado las credenciales"
            
            Write-Host ""
            Write-Host "Activando el workflow..." -ForegroundColor Yellow
            Write-Host "1. En tu workflow, haz clic en el botón 'Active' (arriba a la derecha)" -ForegroundColor White
            Write-Host "2. Copia la URL del webhook (aparece en el nodo Webhook)" -ForegroundColor White
            Write-Host ""
            $webhookUrl = Read-Host "Pega aquí la URL del webhook"
            
            # Actualizar el archivo n8n.service.ts
            Write-Host ""
            Write-Host "Actualizando la app con tu webhook..." -ForegroundColor Yellow
            $serviceFile = "src/app/services/n8n.service.ts"
            if (Test-Path $serviceFile) {
                $content = Get-Content $serviceFile -Raw
                $content = $content -replace "private n8nWebhookUrl = '.*';", "private n8nWebhookUrl = '$webhookUrl';"
                Set-Content $serviceFile $content
                Write-Host "✓ Archivo actualizado: $serviceFile" -ForegroundColor Green
            } else {
                Write-Host "✗ No se encontró el archivo $serviceFile" -ForegroundColor Red
                Write-Host "Actualiza manualmente la línea 23 en src/app/services/n8n.service.ts" -ForegroundColor Yellow
                Write-Host "Reemplaza con: private n8nWebhookUrl = '$webhookUrl';" -ForegroundColor Yellow
            }
            
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "  ¡CONFIGURACIÓN COMPLETADA!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Ahora vamos a probar la conexión..." -ForegroundColor Yellow
            Write-Host ""
            Read-Host "Presiona Enter para abrir la herramienta de prueba"
            
            Start-Process "test-n8n-connection.html"
            
            Write-Host ""
            Write-Host "En la herramienta de prueba:" -ForegroundColor Cyan
            Write-Host "1. La URL del webhook ya debería estar configurada" -ForegroundColor White
            Write-Host "2. Haz clic en 'Probar Conexión'" -ForegroundColor White
            Write-Host "3. Verifica que funcione correctamente" -ForegroundColor White
            Write-Host ""
            Read-Host "Presiona Enter cuando hayas probado la conexión"
            
            Write-Host ""
            Write-Host "¡Listo! Ahora puedes ejecutar tu app:" -ForegroundColor Green
            Write-Host "  ionic serve" -ForegroundColor Cyan
            Write-Host ""
        }
        "2" {
            Write-Host ""
            Write-Host "Instalando n8n con npm..." -ForegroundColor Yellow
            Write-Host "Ejecuta: npm install -g n8n" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Después ejecuta este script nuevamente" -ForegroundColor Yellow
        }
        "3" {
            Write-Host ""
            Write-Host "Para instalar con Docker:" -ForegroundColor Yellow
            Write-Host "docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Después abre: http://localhost:5678" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RECURSOS ÚTILES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentación:" -ForegroundColor Yellow
Write-Host "  - GUIA_RAPIDA.md" -ForegroundColor White
Write-Host "  - N8N_SETUP.md" -ForegroundColor White
Write-Host "  - test-n8n-connection.html" -ForegroundColor White
Write-Host ""
Write-Host "Enlaces:" -ForegroundColor Yellow
Write-Host "  - n8n Cloud: https://n8n.io/cloud" -ForegroundColor White
Write-Host "  - OpenAI API Keys: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "  - Documentación n8n: https://docs.n8n.io/" -ForegroundColor White
Write-Host ""
