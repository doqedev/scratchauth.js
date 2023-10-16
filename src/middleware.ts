import { NextFunction, Request, Response } from "express";
import axios from 'axios'

export function authUrl(url: string, authName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        let redirectLocation = Buffer.from(url).toString('base64')
        let convertedAuthName = encodeURIComponent(authName)

        let authUrl = `https://auth.itinerary.eu.org/auth/?redirect=${redirectLocation}&name=${convertedAuthName}`

        res.redirect(authUrl)
    }
}

type validationConfig = {
    onFail?: (req: Request, res: Response, next: NextFunction) => any,
    redirectUrl?: string
}

export function validateAuth(config: validationConfig) {
    const onFail = config.onFail || function (req: Request, res: Response, next: NextFunction) {
        res.status(401).json({ code: 401, message: "Unauthorized" })
    }

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.query.privateCode) return res.status(400).json({ code: 400, message: "Bad request (missing private code)" });

        axios.get(`https://auth.itinerary.eu.org/api/auth/verifyToken?privateCode=${req.query.privateCode}`).then((resp) => {
            if (resp.data.username === null) return onFail(req, res, next);

            if (config.redirectUrl && resp.data.redirect !== config.redirectUrl) return onFail(req, res, next);

            req.scratch = {
                redirectUrl: resp.data.redirect,
                username: resp.data.username
            }

            next();
        }).catch((err) => {
            if (!axios.isAxiosError(err)) throw err;
            if (!err.response) throw err;
            if (!err.response.data.valid) return onFail(req, res, next);

            throw err;
        })
    }
}

export interface ScratchAuthUser {
    redirectUrl: string,
    username: string
}