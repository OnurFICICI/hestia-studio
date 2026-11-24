[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._@-]+$')]
    [string]$SshTarget
)

# Uses the user's existing SSH configuration. No credentials are read or stored.
# Installs the theme assets only; the user selects studio in Hestia afterwards.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$themeArchive = Join-Path $projectRoot 'release/Hestia-Studio-Theme.tar.gz'
if (-not (Test-Path -LiteralPath $themeArchive -PathType Leaf)) {
    throw 'Theme archive is missing. Run python scripts/package.py first.'
}
Get-Command ssh, scp -ErrorAction Stop | Out-Null
$sshOptions = @('-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=15')
Write-Host "Checking Hestia version on $SshTarget..."
$remoteVersion = & ssh @sshOptions $SshTarget 'sudo -n sed -n "/^VERSION=/p" /usr/local/hestia/conf/hestia.conf'
if ($LASTEXITCODE -ne 0) { throw 'SSH or passwordless sudo failed. No theme files were installed.' }
if (($remoteVersion -join "`n").Trim() -ne "VERSION='1.10.9'") {
    throw "This package supports HestiaCP 1.10.9 only. Server reported: $remoteVersion"
}

$remoteDirectory = & ssh @sshOptions $SshTarget 'umask 077; mktemp -d /tmp/hestia-studio.XXXXXXXX'
if ($LASTEXITCODE -ne 0) { throw 'Could not create a private installation directory.' }
$remoteDirectory = ($remoteDirectory -join "`n").Trim()
if ($remoteDirectory -notmatch '^/tmp/hestia-studio\.[A-Za-z0-9]{8}$') {
    throw 'Unexpected remote directory; stopped before uploading.'
}
Write-Host 'Uploading theme package...'
& scp @sshOptions $themeArchive "${SshTarget}:${remoteDirectory}/theme.tar.gz"
if ($LASTEXITCODE -ne 0) { throw 'Theme upload failed. No theme files were installed.' }

$expectedHash = (Get-FileHash -LiteralPath $themeArchive -Algorithm SHA256).Hash.ToLowerInvariant()
$remoteChecksum = & ssh @sshOptions $SshTarget "sha256sum '$remoteDirectory/theme.tar.gz'"
if ($LASTEXITCODE -ne 0 -or ($remoteChecksum -join '').Split(' ')[0] -ne $expectedHash) {
    throw 'Uploaded package checksum did not match. Installation was not started.'
}

# Directory is validated above and archive entries come from an explicit allowlist.
& ssh @sshOptions $SshTarget "tar -xzf '$remoteDirectory/theme.tar.gz' -C '$remoteDirectory' && sudo -n bash '$remoteDirectory/hestia-studio/scripts/install.sh'"
if ($LASTEXITCODE -ne 0) { throw "Installation did not complete. Package is available at $remoteDirectory for inspection." }

$assetPaths = [ordered]@{
    'theme/studio.css' = '/usr/local/hestia/web/css/themes/custom/studio.css'
    'theme/studio.js' = '/usr/local/hestia/web/js/custom_scripts/studio.js'
    'theme/studio.php' = '/usr/local/hestia/web/js/custom_scripts/studio.php'
}
$languages = 'ar az bg bn bs ca cs da de el en es et fa fi fr hr hu id it ja ka ko ku lo nl no pl pt pt-br ro ru sk sq sr sv th tr uk ur vi zh-cn zh-tw'.Split(' ')
foreach ($language in $languages) {
    $assetPaths["theme/locales/$language.json"] = "/usr/local/hestia/web/js/custom_scripts/studio-locales/$language.json"
}
$verification = & ssh @sshOptions $SshTarget ('sha256sum ' + ($assetPaths.Values -join ' '))
if ($LASTEXITCODE -ne 0) { throw 'Could not verify installed files.' }
$installedHashes = @($verification | ForEach-Object { ($_ -split '\s+')[0] })
$localHashes = @($assetPaths.Keys | ForEach-Object {
    (Get-FileHash -LiteralPath (Join-Path $projectRoot $_) -Algorithm SHA256).Hash.ToLowerInvariant()
})
if ($installedHashes.Count -ne $localHashes.Count -or (Compare-Object $installedHashes $localHashes -SyncWindow 0)) {
    throw 'Installed files do not match the local theme. Check the server before selecting studio.'
}
Write-Host 'Verified: Studio theme is installed.' -ForegroundColor Green
Write-Host 'In your Hestia account, select Theme > studio, save, then refresh.'
Write-Host 'To return to the previous appearance, select default or dark.'
Write-Host "Installation package retained at $remoteDirectory."
