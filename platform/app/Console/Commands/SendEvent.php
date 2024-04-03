<?php

namespace App\Console\Commands;

use App\Events\ContainerProcessed;
use App\Models\Container;
use Illuminate\Console\Command;

class SendEvent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-event';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {

        ContainerProcessed::dispatch();
        $this->info('Event sent');
    }
}
