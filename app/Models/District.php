<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class District extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    // some Districts cross Region boundaries, so needs to be Many:Many
    public function region(): BelongsToMany
    {
        return $this->belongsToMany(Region::class);
    }

    public function agencies(): HasMany
    {
        return $this->hasMany(Agency::class);
    }
}
