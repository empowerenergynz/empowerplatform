<?php declare(strict_types=1);

namespace Database\Factories;

use App\Models\PastDonation;
use Illuminate\Database\Eloquent\Factories\Factory;

class PastDonationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PastDonation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'icp' => strtoupper($this->faker->bothify('##########??###')),
            'date' => $this->faker->dateTimeBetween('-3 months'),
            'amount' => $this->faker->randomFloat(2, 5, 100),
            'account_number' => $this->faker->regexify('[0-9]{8}'),
        ];
    }
}
