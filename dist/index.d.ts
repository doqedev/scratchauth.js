/// <reference path="../src/customTypes.d.ts" />
export declare function makeAuthUrl(url: string, authName: string): string;
export declare function validateAuthToken(privateCode: string): Promise<AuthResponse>;
interface AuthResponse {
    valid: boolean;
    username: string | null;
    redirect: string | null;
    type?: string;
}
export * as middleware from './middleware';
