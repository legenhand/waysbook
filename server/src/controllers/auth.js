const Joi = require("joi");
const {users, profile} = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
    // our validation schema here
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
    });
    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);

    // if error exist send validation error message
    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });

    try {
        const isEmailExists = await users.findOne({
            where: {
                email: req.body.email
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        })

        if(isEmailExists){
            res.status(500).send({
                status: "failed",
                message: "email already registered!"
            });
            return
        }
        // we generate salt (random value) with 10 rounds
        const salt = await bcrypt.genSalt(10);
        // we hash password from request with salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await users.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            status: "customer",
        });
        const newProfile = await profile.create({
            gender: "",
            phone: "",
            avatar: "",
            location: "",
            idUser: newUser.id
        });


        // generate token
        const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_KEY);
        let dataProfile = JSON.parse(JSON.stringify(newProfile));
        dataProfile = {
            ...dataProfile,
            avatar : process.env.PATH_FILE + dataProfile.avatar
        }

        res.status(200).send({
            status: "success...",
            data: {
                name: newUser.name,
                email: newUser.email,
                profile : dataProfile,
                token,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.login = async (req, res) => {
    try {
    // our validation schema here
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
    });

    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);

    // if error exist send validation error message
    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });


        const userExist = await users.findOne({
            where: {
                email: req.body.email,
            },
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if(!userExist){
            return res.status(404).send({
                status: "failed",
                message: `Email: ${req.body.email} not found`,
            });
        }

        // compare password between entered from client and from database
        const isValid = await bcrypt.compare(req.body.password, userExist.password);

        // check if not valid then return response with status 400 (bad request)
        if (!isValid) {
            return res.status(400).send({
                status: "failed",
                message: "credential is invalid",
            });
        }

        // generate token
        const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);
        let dataProfile = JSON.parse(JSON.stringify(userExist.profile));
        dataProfile = {
            ...dataProfile,
            avatar : process.env.PATH_FILE + dataProfile.avatar
        }
        res.status(200).send({
            status: "success...",
            data: {
                id: userExist.id,
                name: userExist.name,
                email: userExist.email,
                status: userExist.status,
                profile : dataProfile,
                token,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.checkAuth = async (req, res) => {
    try {
        const id = req.user.id;

        const dataUser = await users.findOne({
            where: {
                id,
            },include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        if (!dataUser) {
            return res.status(404).send({
                status: "failed",
            });
        }
        let dataProfile = JSON.parse(JSON.stringify(dataUser.profile));
        dataProfile = {
            ...dataProfile,
            avatar : process.env.PATH_FILE + dataProfile.avatar
        }
        res.send({
            status: "success...",
            data: {
                user: {
                    id: dataUser.id,
                    name: dataUser.name,
                    email: dataUser.email,
                    status: dataUser.status,
                    profile: dataProfile
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.status({
            status: "failed",
            message: "Server Error",
        });
    }
};