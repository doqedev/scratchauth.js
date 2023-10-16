/// <reference path="./customTypes.d.ts" />

import { Buffer } from "buffer"
import axios from "axios"

export function makeAuthUrl(url: string, authName: string): string {
    let redirectLocation = Buffer.from(url).toString('base64')
    let convertedAuthName = encodeURIComponent(authName)

    let authUrl = `https://auth.itinerary.eu.org/auth/?redirect=${redirectLocation}&name=${convertedAuthName}`

    return authUrl
}

export async function validateAuthToken(privateCode: string): Promise<AuthResponse> {
    return new Promise((res, rej) => {
        axios.get(`https://auth.itinerary.eu.org/api/auth/verifyToken?privateCode=${privateCode}`).then((resp) => {
            res(resp.data)
        }).catch((err) => {
            if (!axios.isAxiosError(err)) return rej(err);
            if (!err.response) return rej(err);
            if (!err.response.data.valid) return res({
                valid: false,
                username: null,
                redirect: null
            })

            rej(err);
        })
    })
}

interface AuthResponse {
    valid: boolean,
    username: string | null
    redirect: string | null
    type?: string
}

export * as middleware from './middleware'