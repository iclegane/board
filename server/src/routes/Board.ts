import {Request, Router} from 'express';

import { HTTP_STATUS } from '../constants/HttpStatus.js'
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ErrorResponse, SuccessResponse } from "../dto/ResponseDTO.js";
import { Card } from "../models/Cards.js";
import { CardDTO } from "../dto/CardDTO.js";
import { validate } from "../middleware/validateMiddleware.js";
import { addCardSchema, deleteCardSchema } from "../validations/cardValidation.js";

interface AuthRequest extends Request {
    userId?: string;
}

const router = Router();

router.post('/card', authMiddleware, validate(addCardSchema), async (req: AuthRequest, res) => {
    try {
        const cardSchema = new Card({ name: req.body.name, userId: req.userId  });
        const card = await cardSchema.save();

        const response = new SuccessResponse('Card added', { id: card.id })
        res.json(response);
    } catch (error) {
        console.log(error)
        const response = new ErrorResponse('Server error')
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
    }
});

router.get('/card', authMiddleware, async (_req: AuthRequest, res) => {
    try {
        const cardsSchema  = await Card.find();

        const formattedCards = cardsSchema.map((card) => new CardDTO(card));

        const response = new SuccessResponse(undefined, formattedCards)
        res.json(response);
    } catch (error) {
        const response = new ErrorResponse('Server error')
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
    }
});

router.delete('/card', authMiddleware, validate(deleteCardSchema), async (req: AuthRequest, res) => {
    try {
        const userId = req.userId;
        const cardId = req.body.id;

        const result = await Card.deleteOne({ id: cardId, userId  });
        if (result.deletedCount === 0) {
            const response = new ErrorResponse('The card was not found or you do not have the rights to delete it')
            res.status(HTTP_STATUS.BAD_REQUEST).json(response);
        }
        const response = new SuccessResponse(`Card is deleted`, cardId)
        res.json(response);
    } catch (error) {
        const response = new ErrorResponse('Server error')
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
    }
});

export default router;
