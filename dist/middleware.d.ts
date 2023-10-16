import { NextFunction, Request, Response } from "express";
export declare function authUrl(url: string, authName: string): (req: Request, res: Response, next: NextFunction) => void;
type validationConfig = {
    onFail?: (req: Request, res: Response, next: NextFunction) => any;
    redirectUrl?: string;
};
export declare function validateAuth(config: validationConfig): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export interface ScratchAuthUser {
    redirectUrl: string;
    username: string;
}
export {};
