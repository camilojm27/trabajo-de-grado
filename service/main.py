import multiprocessing
from dotenv import load_dotenv
load_dotenv()  # nopep8
from app.Utils.env import verify_env
from app.Jobs.Subscriber import receive_data


if __name__ == "__main__":
    verify_env()

    # Create two processes for producer and consumer
    # producer_process = multiprocessing.Process(target=send_data)
    consumer_process = multiprocessing.Process(target=receive_data)

    # Start both processes
    # producer_process.start()
    consumer_process.start()

    # Wait for both processes to finish
    consumer_process.join()

    # producer_process.join()
