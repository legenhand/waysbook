const { cart, cart_item, books} = require("../../models");
exports.addItemToCart = async (req, res) => {
    try {
        const {id} = req.params;
        let isCart = await cart.findOne({
            where: {
                user_id : req.user.id
            }
        });
        if(!isCart){
            isCart = await cart.create({
                ...req.body,
                user_id: req.user.id
            });
        }

        const addItem = await cart_item.create({
            book_id : id,
            qty: req.body.qty,
            cart_id: isCart.id
        })


        res.send({
            status: "success...",
            data: addItem,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getAllItemCarts = async (req,res) => {
    try {
        const data = await cart.findAll({
            include: [
                {
                    model: books,
                    as: "books",
                    through: {
                        model : cart_item,
                        as: "cart_item",
                        attributes: {
                            include: ["id"],
                            exclude: ["createdAt", "updatedAt", "cart_id", "qty"    ]
                        },
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                }
            ],
            where: {
                user_id : req.user.id
            }
        })
        res.send({
            status: "success...",
            data: data,
        });
    }catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
}

exports.deleteCart = async (req,res) => {
    try {
        const { id } = req.params;
        await cart_item.destroy({
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