import {Node} from "@/types/node";

interface Port {
    IP: string;
    PrivatePort: number;
    PublicPort: number;
    Type: string;
}

interface Network {
    IPAMConfig: any; // Adjust this based on the actual structure
    Links: any[]; // Adjust this based on the actual structure
    Aliases: any[]; // Adjust this based on the actual structure
    MacAddress: string;
    NetworkID: string;
    EndpointID: string;
    Gateway: string;
    IPAddress: string;
    IPPrefixLen: number;
    IPv6Gateway: string;
    GlobalIPv6Address: string;
    GlobalIPv6PrefixLen: number;
    DriverOpts: any; // Adjust this based on the actual structure
    DNSNames: any[]; // Adjust this based on the actual structure
}

interface Mount {
    Type: string;
    Source: string;
    Destination: string;
    Mode: string;
    RW: boolean;
    Propagation: string;
}

interface Labels {
    [key: string]: string;
}

interface HostConfig {
    NetworkMode: string;
}

interface BridgeNetworkSettings {
    IPAMConfig: null;
    Links: null;
    Aliases: null;
    MacAddress: string;
    NetworkID: string;
    EndpointID: string;
    Gateway: string;
    IPAddress: string;
    IPPrefixLen: number;
    IPv6Gateway: string;
    GlobalIPv6Address: string;
    GlobalIPv6PrefixLen: number;
    DriverOpts: null;
    DNSNames: null;
}

interface NetworkSettings {
    Networks: {
        bridge: BridgeNetworkSettings;
        // Add other network types if needed
    };
}

interface Attributes {
    Id: string;
    Names: string[];
    Image: string;
    ImageID: string;
    Command: string;
    Created: number;
    Ports: Port[];
    Labels: Labels;
    State: string;
    Status: string;
    HostConfig: HostConfig;
    NetworkSettings: NetworkSettings;
    Mounts: Mount[];
}

export interface Container {
    id: number;
    container_id: string;
    node_id: string;
    name: string;
    image: string;
    created: string;
    status: string;
    state: string;
    verified: boolean;
    attributes: Attributes;
    created_at: string;
    updated_at: string;
    node: Node
    error: string | null;
    log_file_path: string | null
    log_timestamp: string | null
    log_download_link: string | null

}



// Example usage:
