import multiprocessing
from dotenv import load_dotenv
load_dotenv()  # nopep8
from app.Utils.env import verify_env
from app.Jobs.Subscriber import receive_data
from app.Jobs.Publisher import send_data


if __name__ == "__main__":
    verify_env()

    producer_process = multiprocessing.Process(target=send_data)
    consumer_process = multiprocessing.Process(target=receive_data)

    producer_process.start()
    consumer_process.start()

    consumer_process.join()
    producer_process.join()
