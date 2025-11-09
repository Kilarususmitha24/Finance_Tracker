import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(40).optional(),

  email: Joi.string()
    .email({ tlds: false })
    .optional(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .allow("", null)
    .optional(),

  address: Joi.string().max(200).allow("", null).optional(),

  bio: Joi.string().max(300).allow("", null).optional(),

  photoURL: Joi.string().uri().allow("", null).optional(),
});
