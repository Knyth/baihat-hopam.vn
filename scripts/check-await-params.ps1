# scripts/check-await-params.ps1
# Quét src/app/**/*.js,ts tìm mẫu có nguy cơ quên "await params"
# Nếu có, in ra danh sách và trả về exit code 1 để chặn commit.

$ErrorActionPreference = "Stop"

# Mẫu regex: tìm '}= params' không ngay sau dấu chấm (tránh match params.something)
# Ví dụ code xấu: "const { slug } = params" (thiếu await)
$pattern = '\}\s*=\s*params(?!\s*\.)'

Write-Host "Scanning for bare '= params' in src/app ..." -ForegroundColor Cyan

$results = Get-ChildItem -Recurse -Path .\src\app -Include *.js,*.ts |
  Select-String -Pattern $pattern

if ($results) {
  Write-Host "`n⚠️  Found suspicious lines (possible missing 'await params'):" -ForegroundColor Red
  $results | ForEach-Object {
    Write-Host ("{0}:{1}  {2}" -f $_.Path, $_.LineNumber, ($_.Line.Trim())) -ForegroundColor Yellow
  }
  Write-Host "`n❌ Commit blocked. Please fix by using:  const { ... } = await params" -ForegroundColor Red
  exit 1
} else {
  Write-Host "✅ OK: No bare '= params' found in src/app." -ForegroundColor Green
  exit 0
}
