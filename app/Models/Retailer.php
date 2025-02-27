<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class Retailer extends Model
{
    use HasFactory, SoftDeletes;

    const CACHE_ALL_NAME = 'allRetailerIdNames';
    const CACHE_CREDITABLE_NAME = 'creditableRetailerIdNames';
    const CACHE_DONATABLE_NAME = 'donatableRetailerIdNames';

    protected $fillable = [
        'name',
        'account_name',
        'account_number',
        'particulars',
        'code',
        'reference',
        'email',
        'can_allocate_credit',
        'can_donate',
    ];

    protected $casts = [
        'can_allocate_credit' => 'boolean',
        'can_donate' => 'boolean',
    ];

    public function credits(): HasMany
    {
        return $this->hasMany(Credit::class);
    }

    public static function getCreditableCached()
    {
        // The Retailers will not change much but are queried regularly, so cache them
        // TODO when we create UI to change the Retailers, we must also invalidate this cache
        $dayInSeconds = 24 * 60 * 60;
        return Cache::remember(self::CACHE_CREDITABLE_NAME, $dayInSeconds, fn () => self::where('can_allocate_credit', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray()
        );
    }

    public static function getDonatableCached()
    {
        // The Retailers will not change much but are queried regularly, so cache them
        // TODO when we create UI to change the Retailers, we must also invalidate this cache
        $dayInSeconds = 24 * 60 * 60;
        return Cache::remember(self::CACHE_DONATABLE_NAME, $dayInSeconds, fn () => self::where('can_donate', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray()
        );
    }
}
