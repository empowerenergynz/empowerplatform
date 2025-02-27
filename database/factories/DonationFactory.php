<?php declare(strict_types=1);

namespace Database\Factories;

use App\Models\Donation;
use Illuminate\Database\Eloquent\Factories\Factory;

class DonationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Donation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        $isDollar = $this->faker->boolean();
        $buybackRate = $isDollar ? 0.0 : $this->faker->randomFloat(2, 5, 100);
        $retailer = $this->faker->randomElement(['Meridian Energy', 'Flick Electric', 'Genesis Energy']);

        return [
            'address' => $this->faker->address(),
            'gps_coordinates' => "{$this->faker->latitude()},{$this->faker->longitude()}",
            'icp' => strtoupper($this->faker->bothify('##########??###')),
            'amount' => $this->faker->randomFloat($isDollar ? 2 : 0, 5, 100),
            'is_dollar' => $isDollar,
            'buyback_rate' => $buybackRate,
            'is_active' => $retailer == 'Meridian',
            'retailer' => $retailer,
            'account_number' => $this->faker->regexify('[0-9]{8}'),
        ];
    }
}
