const Model = require("./countryModel");
const logger = require("../../util/logger");
const BaseController = require(`${__dirApi}BaseController`);

class CountryController extends BaseController
{
    params(req, res, next, id) {
        if(isNaN(id)) {
            next(new Error("Id should be numeric"));
        }

        Model.findOne({
            where: { id: id, },
            include: ["states"],
        })
            .then(country => {
                req.country = country;
                next();
            })
            .catch(err => {
                logger.log(err);
                next(err);
            });
    }

    index(req, res, next) {
        let queryString = req.query;
        let queryConfig = {};

        if(queryString.hasOwnProperty("dropdown") && queryString.dropdown == "true") {
            queryConfig.attributes = ["id", "name", ];
        }

        Model.findAll(queryConfig).then(countries => {
            res.send(super.respond(countries, null));
        }).catch(error => {
            logger.log(error);
            res.send(super.respondWithError(error, null, 500));
        });
    }

    getById(req, res, next) {
        let country = req.country;

        if(country === null) {
            res.send(super.respondWithError(["Country not found"], "Country not found", 404));
        } else {
            res.send(super.respond(country, null));
        }
    }
}

module.exports = new CountryController();
