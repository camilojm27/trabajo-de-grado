interface HardwareAttributes {
    cpu: string;
    cores: number;
    threats: number;
    mhz: string;
    ram: string;
    swap: string;
    disk: string;
    disk_available: string;
    gpu: string;
}

interface OSAttributes {
    system: string;
    kernel: string;
    name: string;
    fullname: string;
    based_on: string;
    arch: string[];
}

interface SoftwareAttributes {
    python: string;
    docker: string;
    php: string;
    composer: string;
    nodejs: string;
    npm: string;
}

interface Attributes {
    hardware: HardwareAttributes;
    os: OSAttributes;
    software: SoftwareAttributes;
}

export interface Node {
    id: string;
    name: string;
    hostname: string;
    ip_address: string;
    created_at: string;
    updated_at: string;
    attributes: Attributes; // Assuming this is a JSON string, you may need to parse it when using the data
}

