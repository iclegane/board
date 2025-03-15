import { Router } from 'express';

import { HTTP_STATUS } from '../constants/HttpStatus.js'
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ErrorResponse, SuccessResponse } from "../dto/ResponseDTO.js";

const router = Router();

router.get('/workplace', authMiddleware, async (req, res) => {
    try {
        const response = new SuccessResponse('You have access')
        res.json(response);
    } catch (error) {
        const response = new ErrorResponse('Server error')
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
    }
});

export default router;
