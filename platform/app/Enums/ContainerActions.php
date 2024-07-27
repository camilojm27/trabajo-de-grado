<?php

namespace App\Enums;

enum ContainerActions: string
{
    case CREATE = 'CREATE:CONTAINER';
    case START = 'START:CONTAINER';
    case DELETE = 'DELETE:CONTAINER';
    case STOP = 'STOP:CONTAINER';
    case RESTART = 'RESTART:CONTAINER';
    case PAUSE = 'PAUSE:CONTAINER';
    case UNPAUSE = 'UNPAUSE:CONTAINER';
    case KILL = 'KILL:CONTAINER';
    case METRICS = 'METRICS:CONTAINER';
    case LOGS = 'LOGS:CONTAINER';
}
