<?php

namespace App\Enums;

enum ContainerState
{
    case CREATED;
    case RUNNING;
    case RESTARTING;
    case EXITED;
    case PAUSED;
    case DEAD;
    case SEND;
}
