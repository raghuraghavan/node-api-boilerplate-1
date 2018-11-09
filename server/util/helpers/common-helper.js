import _ from "lodash";
import { validationResult } from "express-validator/check";

const logger = require(`${__dirUtil}/logger`);

const CommonHelpers = {};

// Handler for any validation error occurs
CommonHelpers.validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);
    const errorArray = [];

    if (!errors.isEmpty()) {
        _.each(errors.mapped(), (error) => {
            errorArray.push(error.msg);
        }).errors;

        return res.status(422).json({ errors: errorArray });
    }

    return next();
};

// Generate random number of specified length
CommonHelpers.randomNumber = length => Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));

module.exports = CommonHelpers;
