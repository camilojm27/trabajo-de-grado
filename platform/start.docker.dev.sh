#!/bin/bash

# Flag file to check if the script has run before
FLAG_FILE=".first_run_done"

# Commands to run only the first time
first_run_commands=(
    "./vendor/bin/sail artisan migrate --seed"
    "./vendor/bin/sail artisan key:generate"
    "./vendor/bin/sail npm install"
)

# Commands to run every time
commands=(
    "./vendor/bin/sail npm run dev"
    "./vendor/bin/sail artisan amqp:metrics"
    "./vendor/bin/sail artisan amqp:consume"
    "./vendor/bin/sail artisan reverb:start"
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

# Check if the script is running for the first time
if [ ! -f "$FLAG_FILE" ]; then
    echo "First run detected. Executing first-run commands..."
    for cmd in "${first_run_commands[@]}"; do
        $cmd
    done
    touch "$FLAG_FILE"
fi

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
