<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Donation extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const MORPH_MAP_NAME = 'donation';

    const PERMISSION_VIEW_DONATIONS = 'view donations';
    const PERMISSION_CREATE_DONATIONS = 'create donations';
    const PERMISSION_EDIT_DONATIONS = 'edit donations';
    const PERMISSION_DELETE_DONATIONS = 'delete donations';
    const PERMISSION_EXPORT_DONATIONS = 'export donations';

    protected $fillable = [
        'address',
        'gps_coordinates',
        'icp',
        'retailer',
        'account_number',
        'amount',
        'is_dollar',
        'buyback_rate',
        'is_active',
        'user_id',
    ];

    protected $casts = [
        'is_dollar' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function pastDonations(): HasMany
    {
        return $this->hasMany(PastDonation::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (is_null($term)) {
            return $query;
        }

        return $query->where('name', 'ILIKE', "%$term%")
            ->orWhere('address', 'ILIKE', "%$term%");
    }

    public function toSearchableArray() {
        return [
            '_type' => 'donation',
            '_id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->BelongsTo(User::class);
    }
}
