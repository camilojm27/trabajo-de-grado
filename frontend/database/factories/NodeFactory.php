<?php

namespace Database\Factories;

use App\Models\Node;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Node>
 */
class NodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->name();
        return [
            'name' => $name,
            'hostname' => $name,
            'ip_address' => $this->faker->ipv4,
            'attributes' => json_encode([
                "hardware" => [
                    "cpu" => $this->faker->word,
                    "cores" => $this->faker->numberBetween(2, 16),
                    "threats" => $this->faker->numberBetween(2, 32),
                    "mhz" => $this->faker->randomFloat(2, 1000, 5000) . " MHz",
                    "ram" => $this->faker->randomFloat(2, 1, 64) . " GB",
                    "swap" => $this->faker->randomFloat(2, 1, 64) . " GB",
                    "disk" => $this->faker->randomFloat(2, 100, 1000) . " GB",
                    "disk_available" => $this->faker->randomFloat(2, 1, 500) . " GB",
                    "gpu" => $this->faker->word,
                ],
                "os" => [
                    "system" => $this->faker->word,
                    "kernel" => $this->faker->word,
                    "name" => $this->faker->word,
                    "fullname" => $this->faker->word . " " . $this->faker->word,
                    "based_on" => $this->faker->word,
                    "arch" => [
                        $this->faker->randomElement(["32bit", "64bit"]),
                        "ELF",
                    ],
                ],
                "software" => [
                    "python" => $this->faker->word,
                    "docker" => $this->faker->word,
                    "php" => "PHP " . $this->faker->randomFloat(1, 5, 8) . "." . $this->faker->randomNumber(1) . "." . $this->faker->randomNumber(1) . " (cli) ...",
                    "composer" => "Composer version " . $this->faker->randomFloat(1, 1, 3) . "." . $this->faker->randomNumber(1) . "." . $this->faker->randomNumber(1) . " " . $this->faker->dateTimeThisYear()->format('Y-m-d H:i:s'),
                    "nodejs" => "v" . $this->faker->randomFloat(1, 10, 16) . "." . $this->faker->randomNumber(1) . "." . $this->faker->randomNumber(1),
                    "npm" => $this->faker->randomFloat(1, 5, 15) . "." . $this->faker->randomNumber(1),
                ]
            ]),
        ];
    }
}
