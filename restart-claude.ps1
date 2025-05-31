# Kill any existing Claude processes
Get-Process | Where-Object { $_.ProcessName -like "*claude*" } | Stop-Process -Force

# Wait a moment to ensure processes are fully terminated
Start-Sleep -Seconds 2

# Launch Claude
Start-Process "C:\Users\$env:USERNAME\AppData\Local\AnthropicClaude\Claude.exe"

Write-Host "Claude has been restarted!" 