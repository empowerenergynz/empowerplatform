<?php declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Region;
use App\Models\District;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            "Northland" => ["Far North District", "Kaipara District", "Whangarei District"],
            "Auckland" => ["Auckland Council"],
            "Waikato" => ["Hamilton City", "Hauraki District", "Matamata-Piako District", "Ōtorohanga District", "Rotorua District", "South Waikato District", "Taupō District", "Thames-Coromandel District", "Waikato District", "Waipa District", "Waitomo District"],
            "Bay of Plenty" => ["Kawerau District", "Ōpōtiki District", "Rotorua District", "Tauranga City", "Western Bay of Plenty District", "Whakatāne District"],
            "Gisborne" => ["Gisborne District"],
            "Hawke's Bay" => ["Central Hawke's Bay District", "Hastings District", "Napier City", "Wairoa District", "Rangitikei District"],
            "Taranaki" => ["New Plymouth District", "South Taranaki District", "Stratford District"],
            "Manawatū-Wanganui (Horizons)" => ["Horowhenua District", "Manawatū District", "Palmerston North City", "Rangitikei District", "Ruapehu District", "Stratford District", "Tararua District", "Taupō District", "Waitomo District", "Wanganui District"],
            "Wellington" => ["Carterton District", "Kapiti Coast District", "Lower Hutt City", "Masterton District", "Porirua City", "South Wairarapa District", "Tararua District", "Upper Hutt City", "Wellington City"],
            "Tasman" => ["Tasman District"],
            "Nelson" => ["Nelson City"],
            "Marlborough" => ["Marlborough District"],
            "West Coast" => ["Buller District", "Grey District", "Westland District"],
            "Canterbury" => ["Ashburton District", "Christchurch City", "Hurunui District", "Kaikoura District", "Mackenzie District", "Selwyn District", "Timaru District", "Waimakariri District", "Waitaki District", "Waimate District"],
            "Chatham Islands" => ["Chatham Islands"],
            "Otago" => ["Central Otago District", "Clutha District", "Dunedin City", "Queenstown-Lakes District", "Waitaki District"],
            "Southland" => ["Gore District", "Invercargill City", "Southland District"],
        ];

        // some Districts overlap multiple regions, so store them here for quick re-use
        $districtsByName = [];

        foreach ($regions as $regionName => $districtNames) {
            $region = new Region(['name' => $regionName]);
            $region->save();
            foreach ($districtNames as $districtName) {
                if (array_key_exists($districtName, $districtsByName)) {
                    $district = $districtsByName[$districtName];
                } else {
                    $district = new District(['name' => $districtName]);
                    $district->save();
                    $districtsByName[$districtName] = $district;
                }
                $region->districts()->attach($district);
            }
        }
    }
}
