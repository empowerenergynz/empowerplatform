<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class UserInvitation extends Model
{
    use HasFactory;

    const EXPIRED_AFTER = 86400 * 2; // 2 days

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'token',
        'created_at'
    ];

    protected $dates = ['created_at'];

    public function isExpired(): bool
    {
        return Carbon::parse($this->created_at)->addSeconds(self::EXPIRED_AFTER)->isPast();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
