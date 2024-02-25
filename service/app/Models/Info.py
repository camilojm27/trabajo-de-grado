import psutil
import platform
import subprocess
import json
import psutil


def get_info():

    def get_hardware_info():
        virtual_memory = psutil.virtual_memory()
        swap_memory = psutil.swap_memory()
        disk_usage = psutil.disk_usage('/')
        gpu_info = r"""lspci -mm | awk -F '\"|\" \"|\\(' '/"Display|"3D|"VGA/ { a[$0] = $1 " " $3 " " ($(NF-1) ~ /^$|^Device [[:xdigit:]]+$/ ? $4 : $(NF-1)) } END { for (i in a) { if (!seen[a[i]]++) { sub("^[^ ]+ ", "", a[i]); print a[i] } }}'"""

        return {
            "cpu": subprocess.run("grep -m 1 'model name' /proc/cpuinfo", shell=True, capture_output=True, text=True).stdout.strip().split(":")[1].strip(),
            "cores": psutil.cpu_count(logical=False),
            "threats": psutil.cpu_count(logical=True),
            "mhz": f"{psutil.cpu_freq().max:.2f} MHz",
            "ram": f"{virtual_memory.total / (1024 ** 3):.2f} GB",
            # "Memoria RAM disponible": f"{virtual_memory.available / (1024 ** 3):.2f} GB",
            "swap": f"{swap_memory.total / (1024 ** 3):.2f} GB",
            # "Memoria Swap disponible": f"{swap_memory.free / (1024 ** 3):.2f} GB"
            "disk": f"{disk_usage.total / (1024 ** 3):.2f} GB",
            "disk_available": f"{disk_usage.free / (1024 ** 3):.2f} GB",
            "gpu": subprocess.run(gpu_info, shell=True, capture_output=True, text=True).stdout.strip(),
        }
        # GPU INFO

    def get_os_info():
        release = platform.freedesktop_os_release()
        return {
            "system": platform.system(),
            "kernel": platform.release(),
            "name": release.get("NAME", ""),
            "fullname": release.get("PRETTY_NAME", ""),
            "based_on": release.get("ID_LIKE", ""),
            "arch": platform.architecture(),
        }

    def get_version_info():
        try:
            python_version = subprocess.run(
                ["python3", "--version"], capture_output=True, text=True).stdout.strip()
        except FileNotFoundError:
            python_version = ""

        try:
            docker_version = subprocess.run(
                ["docker", "--version"], capture_output=True, text=True).stdout.strip()
        except FileNotFoundError:
            docker_version = ""

        try:
            php_version = subprocess.run(
                ["php", "--version"], capture_output=True, text=True).stdout.strip()
        except FileNotFoundError:
            php_version = ""

        try:
            composer_version = subprocess.run(
                ["composer", "--version"], capture_output=True, text=True).stdout.strip()
        except FileNotFoundError:
            composer_version = ""

        try:
            nodejs_version = subprocess.run(
                ["node", "--version"], capture_output=True, text=True).stdout.strip()
        except FileNotFoundError:
            nodejs_version = ""

        try:
            npm_version = subprocess.run(
                ["npm", "--version"], capture_output=True, text=True).stdout.strip()
        except FileNotFoundError:
            npm_version = ""

        return {
            "python": python_version,
            "docker": docker_version,
            "php": php_version,
            "composer": composer_version,
            "nodejs": nodejs_version,
            "npm": npm_version,
        }

    system_info = {
        "hardware": get_hardware_info(),
        "os": get_os_info(),
        "software": get_version_info()
    }
    #print(json.dumps(system_info, indent=4))
    return system_info
