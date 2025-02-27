<?php declare(strict_types=1);

namespace App\Models;

use App\Auth\Notifications\InviteUser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    public const MORPH_MAP_NAME = 'user';

    public const ROLE_DONOR = 'donor';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_SUPER_ADMIN = 'super admin';
    public const ROLE_AGENCY_USER = 'agency user';
    public const ROLE_AGENCY_ADMIN = 'agency admin';

    const PERMISSION_VIEW_USERS = 'view users';
    const PERMISSION_CREATE_USERS = 'create users';
    const PERMISSION_EDIT_USERS = 'edit users';
    const PERMISSION_DELETE_USERS = 'delete users';

    const PERMISSION_VIEW_AGENCY_USERS = 'view agency users';
    const PERMISSION_CREATE_AGENCY_USERS = 'create agency users';
    const PERMISSION_EDIT_AGENCY_USERS = 'edit agency users';
    const PERMISSION_DELETE_AGENCY_USERS = 'delete agency users';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone_number',
        'last_login_at',
        // For speed and simplicity we are linking users directly with an Agency,
        // but this is nullable so Super Admins and Empower Admins are not linked to an Agency.
        // This is much simpler than the polymorhpic type User -> Role_In_Organisation type relationships
        // we have in other projects.  But in this project, it has been confirmed that users will never need to
        // be in multiple "Organisations", so this direct relationship will work and be much easier.
        'agency_id',
        // TODO, when we have Retailers and Retailer Users, we'll add a 'retailer_id' here as well.
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
    ];

    protected $appends = [
        'name', 'invited_at'
    ];

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    /**
     * Determine if the use has the Donor role.
     * @return bool
     */
    public function isDonor(): bool
    {
        return $this->hasRole(self::ROLE_DONOR);
    }

    /**
     * Determine if the use has the Admin role.
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN);
    }

    /**
     * Determine if the use has the SuperAdmin role.
     * @return bool
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole(self::ROLE_SUPER_ADMIN);
    }

    /**
     * Determine if the use has the AgencyAdmin role.
     * @return bool
     */
    public function isAgencyAdmin(): bool
    {
        return $this->hasRole(self::ROLE_AGENCY_ADMIN);
    }

    public function getNameAttribute()
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function getInvitedAtAttribute()
    {
        return $this->invitation?->created_at->diffForHumans();
    }

    public function sendInvitationNotification(string $token)
    {
        $this->notify(new InviteUser($token));
    }

    public function invitation(): HasOne
    {
        return $this->hasOne(UserInvitation::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (is_null($term)) {
            return $query;
        }

        return $query->where('first_name', 'ILIKE', "%$term%")
            ->orWhere('last_name', 'ILIKE', "%$term%")
            ->orWhere('email', 'ILIKE', "%$term%")
            ->orWhere('phone_number', 'ILIKE', "%$term%")
            ->orWhereHas('agency', fn($q) => $q->where('name', 'ILIKE', "%$term%"));
    }

    public function scopeStatus(Builder $query, ?string $term): Builder
    {
        if ($term === 'archived') {
            return $query->onlyTrashed();
        } elseif ($term === 'invited') {
            return $query->whereHas('invitation');
        } elseif ($term === 'active') {
            return $query->whereDoesntHave('invitation')->withoutTrashed();
        }

        return $query;
    }

    public function toSearchableArray() {
        return [
            '_type' => 'user',
            '_id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->roles->pluck('name')->join(','),
            'phone_number' => $this->phone_number,
        ];
    }

    /**
     * this method is called in SearchConfigBuilder.php to get a list of which models the logged-in user can search
     * @return array [role => boolean]
     */
    public function getSearchableTypes(): array
    {
        $canSearch = [
            'user' => $this->can(User::PERMISSION_VIEW_USERS),
            'donation' => $this->can(Donation::PERMISSION_VIEW_DONATIONS),
        ];

        return array_keys(array_filter($canSearch));
    }

    public function getHighestRole(): int
    {
        $roleOrders = $this->roles()->pluck('role_order')->toArray();
        $roleOrders[] = 100;
        return min($roleOrders);
    }
}
