<?php

namespace App\Enums;

enum ContainerState: string
{
    case CREATED = "created";
    case RUNNING = "running";
    case RESTARTING = "restarting";
    case EXITED = "exited";
    case PAUSED = "paused";
    case DEAD = "dead";
    case SEND = "send";
    case ERROR = "error";
    case SUCCESS = "success";
}
