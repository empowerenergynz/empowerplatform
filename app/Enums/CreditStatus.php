<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class CreditStatus extends Enum
{
    const Requested = 0;
    const Exported  = 1;
    const Paid      = 2;
    const Rejected  = 3;
}
