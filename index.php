<?php
// Local preview entry point. The mock preview has no API or server connection.
declare(strict_types=1);
$html = file_get_contents(__DIR__ . '/dist/index.html');
if ($html === false) {
    http_response_code(500);
    exit('Preview files are missing.');
}
header('Content-Type: text/html; charset=utf-8');
echo str_replace('<head>', '<head><base href="/dist/">', $html);
