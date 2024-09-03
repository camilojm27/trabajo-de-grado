<?php

namespace App\Enums;

enum NodeActions: string
{
    case METRICS_HOST = 'METRICS:HOST'; // Order to the node to send cpu, ram, swap, and net i/o in realtime
    case DESTROY_HOST = 'DESTROY:HOST'; // Order to the node to stop consuming rabbitmq and close connection
}
