import { RequestHandler} from 'express';
import { AnySchema, ValidationError } from 'yup';
import { HTTP_STATUS } from "../constants/HttpStatus.js";
import {ErrorResponse} from "../dto/ResponseDTO.js";

export const validate = (schema: AnySchema): RequestHandler => async (req, res, next) => {
    try {
        req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        next();
    } catch (err) {
        if (err instanceof ValidationError) {
            const response = new ErrorResponse('Validation error', { errors: err.errors })
            res.status(HTTP_STATUS.BAD_REQUEST).json(response);
            return
        }

        next(err);
    }
};
