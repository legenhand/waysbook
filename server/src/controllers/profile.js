const {books, users, profile, transactions, transaction_item} = require("../../models");

exports.getAllProfile = async (req,res) => {
    try {
        const id  = req.user.id;
        let data = await users.findAll({
            include: {
              model: profile,
              as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser"],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        let purchasedBooks = await transactions.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idBuyer', 'idSeller', 'idProduct']
            },
            include: [
                {
                    model: books,
                    as: 'books',
                    through: {
                        model : transaction_item,
                        as: "transaction_item",
                        attributes: {
                            exclude: ["createdAt", "updatedAt",]
                        },
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
            ],
            where: {
                idBuyer : id,
                status : "success"
            }
        });

        // data = JSON.parse(JSON.stringify(data));
        // data = data.map((item) => {
        //     return {
        //         ...item,
        //         book_attachment: process.env.PATH_FILE + item.book_attachment,
        //         thumbnail: process.env.PATH_FILE + item.thumbnail
        //     };
        // });
        res.send({
            status: "success...",
            data,
            purchasedBooks
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
}


exports.getProfileDetail = async (req,res) => {
    try {
        const id = req.user.id;
        let data = await users.findOne({
            include : {
              model: profile,
              as: "profile",
              attributes: {
                  exclude: ["createdAt", "updatedAt", "idUser"],
              }
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
            where: {
                id : id
            }
        });

        data = JSON.parse(JSON.stringify(data));
        data = {
            ...data,
            profile : {
                ...data.profile,
                avatar: process.env.PATH_FILE + data.profile.avatar
            }
        };


        let purchasedBooks = await transactions.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idBuyer', 'idSeller', 'idProduct']
            },
            include: [
                {
                    model: books,
                    as: 'books',
                    through: {
                        model : transaction_item,
                        as: "transaction_item",
                        attributes: {
                            exclude: ["createdAt", "updatedAt",]
                        },
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
            ],
            where: {
                idBuyer : id,
                status : "success"
            }
        });

        purchasedBooks = JSON.parse(JSON.stringify(purchasedBooks));
        purchasedBooks = purchasedBooks.map(item => {
            return {
                ...item,
                books : item.books.map(itembooks => {
                    return {
                        ...itembooks,
                        book_attachment: process.env.PATH_FILE + itembooks.book_attachment,
                        thumbnail: process.env.PATH_FILE + itembooks.thumbnail
                    };
                })
            }
        });

        res.send({
            status: "success...",
            data,
            purchasedBooks
        });
    }catch (err){
        console.log(err)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.updateProfile = async (req,res) => {
    try {
        const id = req.user.id;
        let data = await users.findOne({
            include : {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser"],
                }
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
            where: {
                id : id
            }
        });
        if(!data){
            return res.send({
                message: `Profile with ID: ${id} not found!`
            })
        }
        data = JSON.parse(JSON.stringify(data));

        const newDataUser = {
            name: req?.body?.name || data.name,
            email: req?.body?.email || data.email,
        };
        console.log(req.files.image[0].filename)
        const newDataProfile = {
            gender: req?.body?.gender || data.profile.gender,
            phone: req?.body?.phone || data.profile.phone,
            avatar: req?.files?.image[0].filename || data.profile.avatar,
        }

        await users.update(newDataUser, {
            where : {
                id : id
            }
        })

        await profile.update(newDataProfile, {
            where : {
                idUser : id
            }
        })

        res.send({
            status: "success",
            data: {
                newDataUser,
                newDataProfile
            }
        })
    }catch (err){
        console.log(err)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.deleteBook = async (req,res) => {
    try {
        const { id } = req.params;
        await books.destroy({
            where: {
                id
            }
        });
        res.send({
            status: "success",
            data: {
                id: id,
            }
        });
    }catch (err){
        console.log(err)
        res.send({
            status: 'failed',
            message: 'Server Error'
        });
    }
}