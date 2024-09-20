#!/bin/bash

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
    for pid in "${pids[@]}"; do
        kill $pid 2>/dev/null
    done
    exit 0
}

# Trap signals to ensure cleanup is called
trap cleanup SIGINT SIGTERM

# Function to prompt user if no args are provided
prompt_user() {
    echo "No arguments provided. What would you like to do?"
    echo "1) Seed the database"
    echo "2) Generate app key"
    echo "3) Install npm dependencies"
    echo "4) Run all previus commands"
    echo "5) Skip and continue with main commands"

    read -p "Enter choice [1-5]: " choice

    case "$choice" in
        1) ./vendor/bin/sail artisan migrate --seed ;;
        2) ./vendor/bin/sail artisan key:generate ;;
        3) ./vendor/bin/sail npm install ;;
        4) 
            ./vendor/bin/sail artisan migrate --seed
            ./vendor/bin/sail artisan key:generate
            ./vendor/bin/sail npm install
        ;;
        5) echo "Skipping first-run commands." ;;
        *) echo "Invalid option. Exiting."; exit 1 ;;
    esac
}

# Check command-line arguments
if [ "$#" -eq 0 ]; then
    prompt_user
else
    while getopts "sikn" opt; do
        case $opt in
            s) ./vendor/bin/sail artisan migrate --seed ;;
            i) ./vendor/bin/sail artisan key:generate ;;
            k) ./vendor/bin/sail npm install ;;
            n)
                ./vendor/bin/sail artisan migrate --seed
                ./vendor/bin/sail artisan key:generate
                ./vendor/bin/sail npm install
            ;;
            *) echo "Invalid option"; exit 1 ;;
        esac
    done
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
