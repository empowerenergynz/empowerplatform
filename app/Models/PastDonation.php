<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PastDonation extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const MORPH_MAP_NAME = 'past_donation';

    const PERMISSION_VIEW_OWN_PAST_DONATIONS = 'view own past donations';
    const PERMISSION_VIEW_PAST_DONATIONS = 'view past donations';
    const PERMISSION_CREATE_PAST_DONATIONS = 'create past donations';
    const PERMISSION_EDIT_PAST_DONATIONS = 'edit past donations';
    const PERMISSION_DELETE_PAST_DONATIONS = 'delete past donations';

    protected $fillable = [
        'icp',
        'date',
        'amount',
        'account_number',
        'donation_id',
        'retailer',
    ];

    public function donation(): BelongsTo
    {
        return $this->belongsTo(Donation::class);
    }

    protected function retailer(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $attributes['retailer'] ?? $this->donation->retailer,
        );
    }
}
