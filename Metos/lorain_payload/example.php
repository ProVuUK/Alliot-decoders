<?php

require_once 'DataParser.php';

use Metos\DataParser;

$payloads = file('./payloads', FILE_IGNORE_NEW_LINES);

foreach ($payloads as $payload) {
    $binaryData = base64_decode($payload);

    $header = DataParser::parseHeader(substr($binaryData, 0, 14));
    $data = DataParser::parseData(substr($binaryData, 14));

    echo json_encode($header) . PHP_EOL;
    echo json_encode($data, JSON_PRETTY_PRINT);
}
