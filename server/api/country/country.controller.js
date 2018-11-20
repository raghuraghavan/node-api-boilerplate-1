import CountryRepository from "./country.repository";
import GeneralError from "../../util/generalError";

const logger = require("../../util/logger");

const BaseController = require(`@api/BaseController`);

class CountryController extends BaseController {
    constructor() {
        super();
        this.repository = CountryRepository;
    }

    params(req, res, next, id) {
        if (isNaN(id)) {
            return super.respondWithError(new GeneralError("Id should be numeric", 422), null, 422);
        }

        this.repository
            .find({
                where: { id },
                include: ["State"],
            })
            .then((country) => {
                req.country = country;
                next();
            })
            .catch((err) => {
                logger.log(err);
                next(err);
            });
    }

    index(req, res, next) {
        const queryString = req.query;
        const queryConfig = {};

        if (queryString.hasOwnProperty("dropdown") && queryString.dropdown == "true") {
            queryConfig.attributes = ["id", "name"];
        }

        this.repository
            .all(queryConfig)
            .then((countries) => {
                res.send(super.respond(countries, null));
            }).catch((error) => {
                logger.log(error);
                res.send(super.respondWithError(error, null, 500));
            });
    }

    getById(req, res, next) {
        const country = req.country;

        if (country === null) {
            res.send(super.respondWithError(["Country not found"], "Country not found", 404));
        } else {
            res.send(super.respond(country, null));
        }
    }
}

module.exports = new CountryController();
