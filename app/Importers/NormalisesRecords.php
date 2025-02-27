<?php declare(strict_types=1);

namespace App\Importers;

trait NormalisesRecords
{
    public function normaliseRecord(array $record): array
    {
        $normalisedRecord = [];
        foreach ($record as $k => $v) {
            $normalisedRecord[strtolower($k)] = $v;
        }
        return $normalisedRecord;
    }
}
