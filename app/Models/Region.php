<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Region extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    // some Districts cross Region boundaries, so needs to be Many:Many
    public function districts(): BelongsToMany
    {
        return $this->belongsToMany(District::class);
    }

    public function agencies(): HasMany
    {
        return $this->hasMany(Agency::class);
    }

    public static function getAllCached()
    {
        // The Regions will not change much (at all?) but are queried regularly, so cache them
        // TODO if we ever create UI to change the Districts, we must also invalidate this cache
        $dayInSeconds = 24 * 60 * 60;
        return Cache::remember('regions', $dayInSeconds, fn () => self::get(['id', 'name'])
            ->load('districts:id,name')
            ->toArray()
        );
    }
}
