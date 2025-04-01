import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

const validate = (schema: Schema) => {
  return (_: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(res.locals.reqdata, { abortEarly: false });

    if (error) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.details.map((err: any) => err.message),
      });
      return 
    }

    next();
  };
};

export default validate;
