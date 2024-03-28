package services

import (
	"encoding/json"
	"github.com/camilojm27/trabajo-de-grado/pgc/types"
	"runtime"
	"strconv"
)

var info = types.SystemInfo{
	OS: types.OS{
		System:   runtime.GOOS,
		Kernel:   "6.6.13-200.fc39.x86_64",
		Name:     "Fedora Linux",
		Fullname: "Fedora Linux 39 (Workstation Edition)",
		BasedOn:  "",
		Arch:     []string{"64bit", "ELF"},
	},
	Hardware: types.Hardware{
		CPU:       strconv.Itoa(runtime.NumCPU()),
		Cores:     4,
		Threads:   8,
		Mhz:       "2800.00 MHz",
		Ram:       "7.08 GB",
		Swap:      "7.08 GB",
		Disk:      "311.50 GB",
		DiskAvail: "279.92 GB",
		GPU:       "Advanced Micro Devices, Inc. [AMD/ATI] Mendocino",
	},
	Software: types.Software{
		Python:   "Python 3.12.1",
		Docker:   "Docker version 25.0.1, build 29cf629",
		Php:      "PHP 8.2.15 (cli) (built: Jan 16 2024 12:19:32) (NTS gcc x86_64)\nCopyright (c) The PHP Group\nZend Engine v4.2.15, Copyright (c) Zend Technologies\n   with Zend OPcache v8.2.15, Copyright (c), by Zend Technologies",
		Composer: "Composer version 2.6.6 2023-12-08 18:32:26",
		Node:     "v20.10.0",
		Npm:      "10.2.3",
	},
}

var infoj, _ = json.Marshal(info)
var Data = string(infoj)
