<?php declare(strict_types=1);

namespace Database\Factories;

use App\Models\Retailer;
use Illuminate\Database\Eloquent\Factories\Factory;

class RetailerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Retailer::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        $faker = \Faker\Factory::create('en_NZ');

        return [
            'name' => $faker->company(),
            'account_name' => $faker->company(),
            'account_number' => $faker->numberBetween(123456, 987654321),
            'particulars' => $faker->word,
            'code' => $faker->word,
            'reference' => $faker->word,
            'email' => $faker->email,
        ];
    }
}
