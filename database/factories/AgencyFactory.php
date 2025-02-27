<?php declare(strict_types=1);

namespace Database\Factories;

use App\Models\Agency;
use App\Models\Region;
use Illuminate\Database\Eloquent\Factories\Factory;

class AgencyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Agency::class;

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

        return [
            'name' => $faker->company(),
            'region_id' => $region['id'] ?? null,
            'district_id' => $district['id'] ?? null,
            'balance' => $faker->numberBetween(1, 10000),
            'balance_date' => $faker->dateTime(),
        ];
    }
}
