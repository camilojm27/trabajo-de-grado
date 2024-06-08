package system

import (
	"encoding/json"
	"os/exec"
	"strings"

	"github.com/camilojm27/trabajo-de-grado/service/types"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/host"
	"github.com/shirou/gopsutil/v3/mem"
)

var info = types.SystemInfo{
	OS:       getOS(),
	Hardware: getHardware(),
	Software: getSoftware(),
}

func runCommand(command string) (string, error) {
	cmd := exec.Command("sh", "-c", command)
	output, err := cmd.Output()
	return strings.TrimSpace(string(output)), err
}

func getSoftware() types.Software {
	docker, _ := runCommand("docker --version")
	python, _ := runCommand("python -V")
	php, _ := runCommand("php -v")
	composer, _ := runCommand("composer -V")
	node, _ := runCommand("node -v")
	npm, _ := runCommand("npm -v")

	return types.Software{
		Python:   python,
		Docker:   docker,
		Php:      php,
		Composer: composer,
		Node:     node,
		Npm:      npm,
	}
}
func getOS() types.OS {
	hostInfo, _ := host.Info()

	return types.OS{
		Hostname:             hostInfo.Hostname,
		HostId:               hostInfo.HostID,
		System:               hostInfo.OS,
		Kernel:               hostInfo.KernelVersion,
		Name:                 hostInfo.Platform,
		Version:              hostInfo.PlatformVersion,
		BasedOn:              hostInfo.PlatformFamily,
		Arch:                 hostInfo.KernelArch,
		Uptime:               hostInfo.Uptime,
		BootTime:             hostInfo.BootTime,
		Procs:                hostInfo.Procs,
		VirtualizationSystem: hostInfo.VirtualizationSystem,
		VirtualizationRole:   hostInfo.VirtualizationRole,
	}

}
func getHardware() types.Hardware {
	v, _ := mem.VirtualMemory()

	cores, _ := cpu.Counts(false)
	threads, _ := cpu.Counts(false)
	cpuName, _ := cpu.Info()
	gpu, _ := runCommand(`lspci -mm | awk -F '\"|\" \"|\\(' '/"Display|"3D|"VGA/ { a[$0] = $1 " " $3 " " ($(NF-1) ~ /^$|^Device [[:xdigit:]]+$/ ? $4 : $(NF-1)) } END { for (i in a) { if (!seen[a[i]]++) { sub("^[^ ]+ ", "", a[i]); print a[i] } }}'`)
	usage, _ := disk.Usage("/")
	return types.Hardware{
		CPU:              cpuName[0].ModelName,
		Cores:            cores,
		Threads:          threads,
		Ram:              v.Total,
		Swap:             v.SwapTotal,
		Disk:             usage.Total,
		DiskAvail:        usage.Free,
		DistkUsedPercent: usage.UsedPercent,
		GPU:              gpu,
	}

}

var infoj, _ = json.Marshal(info)
var Data = string(infoj)
