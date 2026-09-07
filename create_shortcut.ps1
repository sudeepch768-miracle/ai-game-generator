# PowerShell script to create desktop & start menu shortcuts
param(
    [string]$TargetDir = $PSScriptRoot
)

$WScriptShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$StartMenuPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Programs)

$TargetFile = Join-Path $TargetDir "play.bat"
$IconFile = Join-Path $TargetDir "app.ico"

# 1. Desktop Shortcut
$DesktopShortcutPath = Join-Path $DesktopPath "Reality to Play.lnk"
$Shortcut = $WScriptShell.CreateShortcut($DesktopShortcutPath)
$Shortcut.TargetPath = $TargetFile
$Shortcut.WorkingDirectory = $TargetDir
$Shortcut.Description = "Reality to Play - AI Game Generator"
if (Test-Path $IconFile) {
    $Shortcut.IconLocation = "$IconFile, 0"
}
$Shortcut.Save()
Write-Host " [OK] Created Desktop shortcut: $DesktopShortcutPath" -ForegroundColor Green

# 2. Start Menu Shortcut
$StartMenuShortcutPath = Join-Path $StartMenuPath "Reality to Play.lnk"
$StartShortcut = $WScriptShell.CreateShortcut($StartMenuShortcutPath)
$StartShortcut.TargetPath = $TargetFile
$StartShortcut.WorkingDirectory = $TargetDir
$StartShortcut.Description = "Reality to Play - AI Game Generator"
if (Test-Path $IconFile) {
    $StartShortcut.IconLocation = "$IconFile, 0"
}
$StartShortcut.Save()
Write-Host " [OK] Created Start Menu shortcut: $StartMenuShortcutPath" -ForegroundColor Green

