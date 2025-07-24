export type NodeType = "source" | "target";

export interface Connection {
    id: string; // Unique identifier for the connection
    source: string; // ID of the source node
    target: string; // ID of the target node
}