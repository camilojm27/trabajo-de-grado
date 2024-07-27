#!/bin/bash

# Array of commands to run concurrently
commands=(
    "php artisan serve"
    "php artisan reverb:start"
    "php artisan amqp:metrics"
    "php artisan amqp:consume"
    "npm run dev"
)

# Function to handle script termination
cleanup() {
    echo "Terminating all commands..."
    for pid in ${pids[@]}; do
        kill $pid 2>/dev/null
    done
    exit 0
}

# Trap signals to ensure cleanup is called
trap cleanup SIGINT SIGTERM

# Array to store process IDs
pids=()

# Start each command in the background and store its PID
for cmd in "${commands[@]}"; do
    $cmd &
    pids+=($!)
done

# Wait for all background processes to finish
wait

# Cleanup in case all processes finish naturally
cleanup
