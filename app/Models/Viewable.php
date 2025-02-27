<?php declare(strict_types=1);

namespace App\Models;

interface Viewable
{
    public function getViewLink(): string;
}
