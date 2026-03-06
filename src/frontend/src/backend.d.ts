import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AITool {
    id: bigint;
    url: string;
    name: string;
    description: string;
    isFeatured: boolean;
    category: string;
}
export interface backendInterface {
    addTool(name: string, description: string, category: string, url: string, isFeatured: boolean): Promise<{
        id: bigint;
    }>;
    deleteTool(id: bigint): Promise<void>;
    getAllTools(): Promise<Array<AITool>>;
    getFeaturedTools(): Promise<Array<AITool>>;
    getToolById(id: bigint): Promise<AITool | null>;
    getToolsByCategory(category: string): Promise<Array<AITool>>;
    searchTools(searchText: string): Promise<Array<AITool>>;
    updateTool(id: bigint, name: string, description: string, category: string, url: string, isFeatured: boolean): Promise<void>;
}
