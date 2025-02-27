<?php declare(strict_types=1);

namespace App\Models;

use App\Enums\CreditStatus;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Credit extends Model
{
    use HasFactory, SoftDeletes;

    const PERMISSION_VIEW_ALL_CREDITS = 'view all credits';
    const PERMISSION_VIEW_AGENCY_CREDITS = 'view agency credits';
    const PERMISSION_EDIT_ALL_CREDITS = 'edit all credits';
    const PERMISSION_CREATE_CREDITS = 'create credits';

    protected $fillable = [
        'name',
        'account',
        'amount',
        'notes',
        'admin_notes',
        'status',
        'retailer_id',
        'region_id',
        'district_id',
        'agency_id',
        'created_by_id',
        'exported_date',
        'exported_by_id',
        'paid_date',
        'paid_by_id',
        'rejected_date',
        'rejected_by_id',
    ];

    protected $casts = [
        'exported_date' => 'datetime',
        'paid_date' => 'datetime',
        'rejected_date' => 'datetime',
        'status' => CreditStatus::class,
    ];

    public function retailer(): BelongsTo
    {
        return $this->belongsTo(Retailer::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function exported_by(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paid_by(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rejected_by(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeStatus(Builder $query, ?string $term): Builder
    {
        return $query->where('status', $term);
    }

    /**
     * @throws Exception
     */
    public function setStatusAndSave(int $newStatus, Carbon $now, int $userId = null, string $adminNotes = null): void
    {
        $this->status = $newStatus;
        if ($newStatus == CreditStatus::Rejected) {
            $this->admin_notes = $adminNotes;
            $this->rejected_by_id = $userId;
            $this->rejected_date = $now;
        } else if ($newStatus == CreditStatus::Exported) {
            $this->exported_by_id = $userId;
            $this->exported_date = $now;
        } else if ($newStatus == CreditStatus::Paid) {
            $this->paid_by_id = $userId;
            $this->paid_date = $now;
        } else {
            throw new Exception("Invalid status $newStatus");
        }
        $this->save();
    }
}
