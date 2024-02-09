<?php

namespace Database\Factories;

use App\Models\Node;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Container>
 */
class ContainerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $containerId = $this->faker->sha256;

        return [
            'container_id' => $containerId,
            'node_id' => Node::first()->id,
            'name' => $this->faker->name,
            'image' => 'ubuntu:20.04',
            'created' => $this->faker->dateTimeThisYear(),
            'status' => 'Up 2 minutes',
            'verified' => false,
            'attributes' => json_encode([
                'Id' => $this->faker->sha256,
                'Names' => ["/my_container"],
                'Image' => $this->faker->randomElement(['ubuntu:20.04', 'alpine:latest', 'nginx:1.21']),
                'ImageID' => $this->faker->sha256,
                'Command' => $this->faker->randomElement(['/bin/bash', '/bin/sh', '/usr/sbin/nginx']),
                'Created' => $this->faker->unixTime,
                'Ports' => [
                    [
                        'IP' => '0.0.0.0',
                        'PrivatePort' => 80,
                        'PublicPort' => $this->faker->numberBetween(8000, 9000),
                        'Type' => 'tcp',
                    ],
                    [
                        'IP' => '::',
                        'PrivatePort' => 80,
                        'PublicPort' => $this->faker->numberBetween(8000, 9000),
                        'Type' => 'tcp',
                    ],
                ],
                'Labels' => [
                    'org.opencontainers.image.ref.name' => $this->faker->word,
                    'org.opencontainers.image.version' => $this->faker->randomElement(['1.0', '2.0', '3.0']),
                ],
                'State' => $this->faker->randomElement(['running', 'exited']),
                'Status' => $this->faker->randomElement(['Up 2 minutes', 'Exited (0) 5 minutes ago', 'Up 1 hour']),
                'HostConfig' => [
                    'NetworkMode' => 'default',
                ],
                'NetworkSettings' => [
                    'Networks' => [
                        'bridge' => [
                            'IPAMConfig' => null,
                            'Links' => null,
                            'Aliases' => null,
                            'MacAddress' => $this->faker->macAddress,
                            'NetworkID' => $this->faker->uuid,
                            'EndpointID' => $this->faker->uuid,
                            'Gateway' => '172.17.0.1',
                            'IPAddress' => $this->faker->ipv4,
                            'IPPrefixLen' => 16,
                            'IPv6Gateway' => '',
                            'GlobalIPv6Address' => '',
                            'GlobalIPv6PrefixLen' => 0,
                            'DriverOpts' => null,
                            'DNSNames' => null,
                        ],
                    ],
                ],
                'Mounts' => [
                    [
                        'Type' => 'bind',
                        'Source' => '/host/path',
                        'Destination' => '/container/path',
                        'Mode' => '',
                        'RW' => true,
                        'Propagation' => 'rprivate',
                    ],
                ],
            ])
        ];
    }
}
