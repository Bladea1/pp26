$dir = Join-Path $PSScriptRoot "..\public\assets"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$files = @{
  "hero-statue.jpg"      = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=85"
  "card-noise.jpg"       = "https://images.unsplash.com/photo-1478737273679-3030edebab80?auto=format&fit=crop&w=1200&q=85"
  "card-moss.jpg"        = "https://images.unsplash.com/photo-1441974231531-c6227db76b62?auto=format&fit=crop&w=1200&q=85"
  "card-memory.jpg"      = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85"
  "card-dream.jpg"       = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85"
  "card-ghost.jpg"       = "https://images.unsplash.com/photo-1518709268805-4e9042af2174?auto=format&fit=crop&w=1200&q=85"
  "project-mirror.jpg"   = "https://images.unsplash.com/photo-1449824913935-59a10b8d2001?auto=format&fit=crop&w=1400&q=85"
  "card-glitch.jpg"      = "https://images.unsplash.com/photo-1550745165-9bc0b4a4d208?auto=format&fit=crop&w=1200&q=85"
  "card-neural.jpg"      = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85"
  "card-collage.jpg"     = "https://images.unsplash.com/photo-1541700994133-8715cef917c0?auto=format&fit=crop&w=1200&q=85"
  "mutation-face.jpg"    = "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85"
  "mutation-panel.jpg"   = "https://images.unsplash.com/photo-1550684841-fac89443f922?auto=format&fit=crop&w=1200&q=85"
  "journal-flower.jpg"   = "https://images.unsplash.com/photo-1490750967868-88ea4486e709?auto=format&fit=crop&w=1200&q=85"
  "reagent-scan.jpg"     = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85"
  "reagent-map.jpg"      = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=85"
  "reagent-pink.jpg"     = "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=85"
  "sample-bag.jpg"       = "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=85"
  "statue-home.jpg"      = "https://images.unsplash.com/photo-1579783902610-e28fb327bd47?auto=format&fit=crop&w=1200&q=85"
  "about-statue.jpg"     = "https://images.unsplash.com/photo-1549888394-29453bd421ab?auto=format&fit=crop&w=1200&q=85"
  "form-preview.jpg"     = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85"
}

foreach ($name in $files.Keys) {
  $out = Join-Path $dir $name
  Write-Host "Downloading $name ..."
  try {
    Invoke-WebRequest -Uri $files[$name] -OutFile $out -UseBasicParsing -TimeoutSec 90
    $len = (Get-Item $out).Length
    if ($len -lt 8000) { Write-Warning "Small file ($len bytes): $name" }
  } catch {
    Write-Warning "Failed: $name - $_"
  }
}
Write-Host "Done."
