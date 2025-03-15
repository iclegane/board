import { RequestHandler} from 'express';
import { AnySchema, ValidationError } from 'yup';
import { HTTP_STATUS } from "../constants/HttpStatus.js";

export const validate = (schema: AnySchema): RequestHandler => async (req, res, next) => {
    try {
        req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        next();
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: err.errors });
            return
        }

        next(err);
    }
};
