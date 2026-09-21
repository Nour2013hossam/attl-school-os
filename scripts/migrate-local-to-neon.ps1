[CmdletBinding()]
param(
  [string]$LocalUrl = "",
  [string]$NeonUrl = "",
  [switch]$ReplaceExisting
)

$ErrorActionPreference = "Stop"

function Require-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found. Install PostgreSQL client tools (pg_dump, pg_restore, psql) first."
  }
}

Require-Command "pg_dump"
Require-Command "pg_restore"
Require-Command "psql"

if ([string]::IsNullOrWhiteSpace($LocalUrl)) {
  $LocalUrl = Read-Host "Enter the LOCAL PostgreSQL connection URL"
}

if ([string]::IsNullOrWhiteSpace($NeonUrl)) {
  $NeonUrl = Read-Host "Enter the NEON direct/unpooled PostgreSQL connection URL"
}

if ([string]::IsNullOrWhiteSpace($LocalUrl) -or [string]::IsNullOrWhiteSpace($NeonUrl)) {
  throw "Both database URLs are required."
}

Write-Host "Checking source database..." -ForegroundColor Cyan
& psql $LocalUrl -v ON_ERROR_STOP=1 -c "select current_database(), current_user;" | Out-Host

Write-Host "Checking Neon database..." -ForegroundColor Cyan
& psql $NeonUrl -v ON_ERROR_STOP=1 -c "select current_database(), current_user;" | Out-Host

$backupDir = Join-Path (Get-Location) "backups"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = Join-Path $backupDir "attl-local-$stamp.dump"

Write-Host "Creating local backup: $backupFile" -ForegroundColor Cyan
& pg_dump --format=custom --no-owner --no-acl --file="$backupFile" "$LocalUrl"

if (-not (Test-Path $backupFile)) {
  throw "Backup file was not created."
}

Write-Host "Local backup created successfully." -ForegroundColor Green

$restoreArgs = @(
  "--no-owner",
  "--no-acl"
)

if ($ReplaceExisting) {
  Write-Host "ReplaceExisting enabled: existing objects on Neon will be cleaned before restore." -ForegroundColor Yellow
  $restoreArgs += "--clean"
  $restoreArgs += "--if-exists"
} else {
  Write-Host "Restoring without destructive cleanup. Use -ReplaceExisting only when the Neon database may already contain the old schema/data." -ForegroundColor Yellow
}

$restoreArgs += "--dbname=$NeonUrl"
$restoreArgs += $backupFile

Write-Host "Restoring local database into Neon..." -ForegroundColor Cyan
& pg_restore @restoreArgs

if ($LASTEXITCODE -ne 0) {
  throw "pg_restore failed with exit code $LASTEXITCODE. Your backup is still available at $backupFile."
}

Write-Host "Migration completed successfully." -ForegroundColor Green
Write-Host "Backup kept at: $backupFile" -ForegroundColor DarkGray
Write-Host "Next: set Vercel DATABASE_URL to the Neon pooled URL and DATABASE_URL_UNPOOLED to the Neon direct URL." -ForegroundColor Cyan
