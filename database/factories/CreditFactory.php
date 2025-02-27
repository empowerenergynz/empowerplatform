<?php declare(strict_types=1);

namespace Database\Factories;

use App\Enums\CreditStatus;
use App\Http\Requests\StoreCreditRequest;
use App\Models\Agency;
use App\Models\Credit;
use App\Models\Region;
use App\Models\Retailer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CreditFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Credit::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        $faker = \Faker\Factory::create('en_NZ');
        $regions = Region::getAllCached();
        $region = count($regions) > 0 ? $faker->randomElement($regions) : null;
        $district = $region && count($region['districts']) > 0 ? $faker->randomElement($region['districts']) : null;
        $retailers = Retailer::getCreditableCached();
        $retailer = count($retailers) > 0 ? $faker->randomElement($retailers) : null;
        $agency = Agency::all()->random();
        $hasMiddleName = rand(1, 4) == 1;
        $isRandomAmount = rand(1, 4) == 1;

        return [
            'name' => $faker->firstName() . ($hasMiddleName ? " {$faker->firstName()}" : '') . ' ' . $faker->lastName(),
            'amount' => $isRandomAmount
                ? rand(100, 500)
                : StoreCreditRequest::APPROVED_AMOUNTS[array_rand(StoreCreditRequest::APPROVED_AMOUNTS)],
            'notes' => $isRandomAmount ? $faker->words(asText: true) : '',
            'account' => rand(123456, 99999999),
            'region_id' => $region['id'] ?? null,
            'district_id' => $district['id'] ?? null,
            'retailer_id' => $retailer['id'] ?? null,
            'agency_id' => $agency->id ?? null,
            'status' => CreditStatus::Requested,
        ];
    }
}
