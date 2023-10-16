import express from 'express'
import { middleware } from '.'

declare global {
    namespace Express {
        interface Request {
            scratch?: middleware.ScratchAuthUser
        }
    }
}