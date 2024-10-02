#!/bin/bash


# Commands to run only the first time
first_run_commands=(
    "php artisan migrate --seed"
    "php artisan key:generate"
    "npm install"
    "npm run build"
)

# Commands to run every time (excluding npm run dev if -p is specified)
commands=(
    "php artisan amqp:metrics"
    "php artisan amqp:consume"
    "php artisan reverb:start"
)

# Default command to run
npm_dev_command="npm run dev"

# Function to handle script termination
cleanup() {
    echo "Terminating all child processes..."
    pkill -P $$ # Kill all child processes of this script
    exit 0
}

# Trap signals to ensure cleanup is called
trap cleanup SIGINT SIGTERM

# Parse flags
first_run_flag=false
skip_npm_dev_flag=false

while getopts "fp" opt; do
    case "$opt" in
        f) first_run_flag=true ;;
        p) skip_npm_dev_flag=true ;;
    esac
done

# Check if the script is running for the first time or if the -f flag is used
if  [ "$first_run_flag" = true ]; then
    echo "First run detected. Executing first-run commands..."
    for cmd in "${first_run_commands[@]}"; do
        $cmd
    done
fi

# Array to store process IDs
pids=()

# Conditionally add the npm run dev command if -p is not specified
if [ "$skip_npm_dev_flag" = false ]; then
    $npm_dev_command &
    pids+=($!)
fi

# Start each command in the background and store its PID
for cmd in "${commands[@]}"; do
    $cmd &
    pids+=($!)
done

# Wait for all background processes to finish
wait

# Cleanup in case all processes finish naturally
cleanup
