<?php declare(strict_types=1);

use App\Http\Controllers\AgencyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\Password\NewPasswordController;
use App\Http\Controllers\Password\PasswordResetLinkController;
use App\Http\Controllers\PastDonationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SignUpController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DonationController;
use App\Models\Credit;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/healthcheck', fn () => response()->json())->name('health-check');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->name('login.store');

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->name('password.update');

    Route::get('/sign-up/{token}', [SignUpController::class, 'create'])->name('sign_up.create');
    Route::post('/sign-up', [SignUpController::class, 'store'])->name('sign_up.store');
});

Route::middleware('auth:web')->group(function () {
    Route::get('/', function () {
        // Agency users/admins are the only roles which can create credits
        // and are redirected to the Create Credit form on login
        // everyone else is taken to the Donations Index
        /* @var User $user */
        $user = Auth::user();
        return $user->hasPermissionTo(Credit::PERMISSION_CREATE_CREDITS)
            ? redirect()->route('credits.create')
            : redirect()->route('donations.index');
    })->name('home');

    Route::resource('users', UserController::class);

    Route::prefix('/users')->group(function () {
        Route::post('/import-donors', [UserController::class, 'importDonors'])->name('users.importDonors');
        Route::patch('/{user}/restore', [UserController::class, 'restore'])->name('users.restore');
        Route::get('/{user}/history', [PastDonationController::class, 'userHistory'])->name('users.pastDonations');
    });

    Route::resource('/agencies', AgencyController::class);
    Route::get('/balance', [AgencyController::class, 'showMyBalance'])->name('agencies.showMyBalance');

    Route::post('/donations/{donation}/history', [PastDonationController::class, 'storeFromDonation'])
        ->name('pastDonations.storeFromDonation');
    Route::post('/donations/import-history', [PastDonationController::class, 'importHistory'])->name('importDonationHistory');
    Route::get('/donations/export', [DonationController::class, 'export'])->name('donations.export');
    Route::resource('/donations', DonationController::class);
    Route::resource('/history', PastDonationController::class)->only(['index']);

    Route::prefix('/users')->group(function () {
        Route::put('/invitations/{user}', [UserController::class, 'updateInvitation'])->name('users.updateInvitation');
    });

    Route::resource('/credits', CreditController::class)->only(['index', 'create', 'store']);
    Route::prefix('/credits')->group(function () {
        Route::put('/updateManyStatus', [CreditController::class, 'updateManyStatus'])->name('credits.updateManyStatus');
    });


    Route::prefix('/profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
    });

    Route::post('/logout', [AuthController::class, 'destroy'])->name('login.destroy');
});
