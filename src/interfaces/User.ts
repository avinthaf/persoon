export interface UserData {
    [key: string]: string | undefined;
    token?: string;
}

export interface FolderStructure {
    name: string;
    children?: FolderStructure[];
    files?: { name: string; content: string }[];
}

export interface JwtPayload extends UserData {
    iat?: string; // Issued at
    exp?: string; // Expiration time
}

export interface VerifiedUser {
    valid: boolean;
    user: JwtPayload | null;
    error?: string;
}