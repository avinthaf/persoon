export interface UserData {
    [key: string]: string | undefined;
    token?: string;
}

export interface FolderStructure {
    name: string;
    children?: FolderStructure[];
    files?: { name: string; content: string }[];
}