import Joi from "joi";

export const overallAnalyticsQuerySchema = Joi.object({
  N: Joi.number().integer().min(1).required().messages({
    "number.base": `"N" must be a number`,
    "number.integer": `"N" must be an integer`,
    "number.min": `"N" must be at least 1`,
    "any.required": `"N" is required`,
  }),
  startDate: Joi.date().iso().optional().messages({
    "date.base": `"startDate" must be a valid date`,
    "date.format": `"startDate" must be in ISO 8601 format (YYYY-MM-DD)`,
  }),
  endDate: Joi.date().iso().optional().greater(Joi.ref("startDate")).messages({
    "date.base": `"endDate" must be a valid date`,
    "date.format": `"endDate" must be in ISO 8601 format (YYYY-MM-DD)`,
    "date.greater": `"endDate" must be greater than startDate`,
  }),
});

export const regionAnalyticsQuerySchema = overallAnalyticsQuerySchema.keys({
  region: Joi.string().required().messages({
    "string.base": `"region" must be a string`,
    "any.required": `"region" is required`,
  }),
});

export const categoryAnalyticsQuerySchema = overallAnalyticsQuerySchema.keys({
  category: Joi.string().required().messages({
    "string.base": `"category" must be a string`,
    "any.required": `"category" is required`,
  }),
});
