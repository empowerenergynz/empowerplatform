<?php declare(strict_types=1);

namespace App\Models;

use App\Enums\CreditStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agency extends Model
{
    use HasFactory, SoftDeletes;

    const PERMISSION_VIEW_AGENCIES = 'view agencies';
    const PERMISSION_CREATE_AGENCIES = 'create agencies';
    const PERMISSION_EDIT_AGENCIES = 'edit agencies';
    const PERMISSION_DELETE_AGENCIES = 'delete agencies';
    const PERMISSION_VIEW_OWN_AGENCY_BALANCE = 'view own agency balance';

    protected $fillable = [
        'name',
        'region_id',
        'district_id',
        'balance',
        'balance_date',
    ];

    protected $casts = [
        'balance_date' => 'datetime',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function credits(): HasMany
    {
        return $this->hasMany(Credit::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (is_null($term)) {
            return $query;
        }

        return $query->where('name', 'ILIKE', "%$term%")
            ->orWhereHas('region', fn($q) => $q->where('name', 'ILIKE', "%$term%"))
            ->orWhereHas('district', fn($q) => $q->where('name', 'ILIKE', "%$term%"));
    }

    public function calculateCurrentBalance(): int
    {
        // see the test test_calculates_balance_correctly() for unit tests of this method
        $balance = $this->balance;

        // from the balance we need to subtract any Credits which are PENDING, EXPORTED or PAID
        // which were created AFTER the balance_date
        $pendingCreditsSinceBalanceDate = $this->credits()
            ->where('status', '<>', CreditStatus::Rejected)
            ->where('created_at', '>', $this->balance_date);

        // but we also need to add back in any credits which were created earlier but have
        // SINCE been rejected
        $olderCreditsRejectedSinceBalanceDate = $this->credits()
            ->where('status', CreditStatus::Rejected)
            ->where('created_at', '<', $this->balance_date)
            ->where('rejected_date', '>', $this->balance_date);

        $pendingCreditAmount = $pendingCreditsSinceBalanceDate->pluck('amount')->sum();
        $rejectedCreditAmount = $olderCreditsRejectedSinceBalanceDate->pluck('amount')->sum();

        return $balance - $pendingCreditAmount + $rejectedCreditAmount;
    }
}
