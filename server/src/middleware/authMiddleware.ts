import { HTTP_STATUS } from "../constants/HttpStatus.js";
import { verifyAccessToken } from "../utils/token.js";
import { Request, Response, NextFunction } from "express";
import {ErrorResponse} from "../dto/ResponseDTO.js";

interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = new ErrorResponse('Unauthorized')
        res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
        return
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (!payload) {
        const response = new ErrorResponse('Invalid token')
        res.status(HTTP_STATUS.FORBIDDEN).json(response);
        return;
    }

    req.userId = payload.id;
    next();
};
