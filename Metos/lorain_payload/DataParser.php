<?php

namespace Metos;

class DataParser
{
    public static $sensors = [
        'battery' =>    [ 'size' => 'v', 'name' => 'Battery', 'divider' => 1 ],
        'solar' =>      [ 'size' => 'v', 'name' => 'Solar panel', 'divider' => 1 ],
        'rain' =>       [ 'size' => 'v', 'name' => 'Precipitation', 'divider' => 10 ],
        'air_avg' =>    [ 'size' => 'v', 'name' => 'Air temperature, average', 'divider' => 100 ],
        'air_mn' =>     [ 'size' => 'v', 'name' => 'Air temperature, minimum', 'divider' => 100 ],
        'air_mx' =>     [ 'size' => 'v', 'name' => 'Air temperature, maximum', 'divider' => 100 ],
        'rh_avg' =>     [ 'size' => 'v', 'name' => 'Relative humidity, average', 'divider' => 10 ],
        'rh_mn' =>      [ 'size' => 'v', 'name' => 'Relative humidity, minimum', 'divider' => 10 ],
        'rh_mx' =>      [ 'size' => 'v', 'name' => 'Relative humidity, maximum', 'divider' => 10 ],
        'dt_avg' =>     [ 'size' => 'v', 'name' => 'DeltaT, average', 'divider' => 100 ],
        'dt_mn' =>      [ 'size' => 'v', 'name' => 'DeltaT, average', 'divider' => 100 ],
        'dt_mx' =>      [ 'size' => 'v', 'name' => 'DeltaT, average', 'divider' => 100 ],
        'dew_avg' =>    [ 'size' => 'v', 'name' => 'Dew Point, average', 'divider' => 100 ],
        'dew_mn' =>     [ 'size' => 'v', 'name' => 'Dew Point, minimum', 'divider' => 100 ],
        'vpd_avg' =>    [ 'size' => 'v', 'name' => 'VPD, average', 'divider' => 100 ],
        'vpd_mn' =>     [ 'size' => 'v', 'name' => 'VPD, minimum', 'divider' => 100 ],
        'leaf' =>       [ 'size' => 'C', 'name' => 'Leaf wetness', 'divider' => 1 ]
    ];

    public static function parseHeader($binaryData)
    {
        $unpackString = 'vCRC/CmessageID/CmessageVersion/CdeviceType/vHW/vFW/Cstatus/Vserial';
        $header = unpack($unpackString, $binaryData);
        $header["serial"] = sprintf("%08X", $header["serial"]);

        return $header;
    }

    public static function parseData($binaryData)
    {
        $unpackString = '';
        foreach (self::$sensors as $key => $sensor) {
            $unpackString .= $sensor["size"] . $key . '/';
        }
        $data = unpack($unpackString, $binaryData);

        foreach ($data as $key => &$value) {
            $divider = self::$sensors[$key]['divider'];
            $value = round($value / $divider, 3);
        }
        return $data;
    }
}
