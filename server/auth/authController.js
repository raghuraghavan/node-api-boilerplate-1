const _ = require("lodash");
const moment = require("moment");

const { sequelizeErrorHandler } = require(`${__dirUtil}/helpers`);
const { User } = require(`${__dirDatabase}/db-connect`);
const authenticate = require("./authenticate");

const BaseController = require(`${__dirApi}BaseController`);

class AuthController extends BaseController {
    /**
     * @api {post} auth/register Registration
     * @apiGroup Authentication
     *
     * @apiParam {String} first_name First name
     * @apiParam {String} last_name Last name
     * @apiParam {String} email Email Address
     * @apiParam {String} password Password
     * @apiParam {String} dob Date of birth (DD-MM-YYYY)
     *
     * @apiSuccess {String} message Message to display when user is created.
     * @apiSuccess {Json} data  JSON object of newly created user.
     *
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
     *       "message": "User created successfully",
     *       "data": <json object of newly created user>
     *     }
     *
     * @apiError EmptyInputValidation If all fields are blank
     *
     * @apiErrorExample EmptyInputValidation
     *     HTTP/1.1 422 Unprocessable Entity
     *     {
     *        "errors": [
                "First name field is required",
                "Last name field is required",
                "Email field is requied"
              ]
     *     }
     * @apiError DuplicateEmail If given email address is already exist
     *
     * @apiErrorExample DuplicateEmail
     *     HTTP/1.1 500 Internal server error
     *     {
     *        "errors": [
                "email must be unique"
              ]
     *     }
     */
    register(req, res, next) {
        // Converting dob format
        req.body.dob = moment(req.body.dob, "DD-MM-YYYY").format("YYYY-MM-DD");

        // adding default active status in input object
        const input = _.extend(req.body, {
            status: 1,
        });

        User.create(input)
            .then((user) => {
                res.send(super.respond({ user: user.toJson() }, "User created successfully"));
            })
            .catch((error) => {
                res.send(super.respondWithError(sequelizeErrorHandler(error), null, 500));
            });
    }


    /**
     * @api {post} auth/login Login
     * @apiGroup Authentication
     *
     * @apiParam {String} email Users Email Address
     * @apiParam {String} password Users password
     *
     * @apiSuccess {String} token JWT token of authenticated user
     *
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
     *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
     *     }
     *
     * @apiError EmptyEmailPassword If email or password is empty
     *
     * @apiErrorExample EmptyEmailPassword
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "errors": ["You need a email and password"]
     *     }
     *
     * @apiError UserNotFound The email of the User was not found
     *
     * @apiErrorExample UserNotFound
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "error": ["No user with the given email"]
     *     }
     *
     * @apiError IncorrectPassword If password is not correct
     *
     * @apiErrorExample IncorrectPassword
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "error": ["Wrong password"]
     *     }
     */
    login(req, res, next) {
        // This route will called after it passes
        // from verifyUser middleware and inside
        // that middleware we attach user object
        // to req object so we are using that user
        // object to sign the jwt token and responed
        // it back to client
        const token = authenticate.signToken(req.user);
        res.send(super.respond({ token }, "You have successfully login"));
    }
}

module.exports = new AuthController();
