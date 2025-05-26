export interface FolderStructure {
    name: string;
    children?: FolderStructure[];
    files?: { name: string; content: string }[];
}