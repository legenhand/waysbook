const {books} = require("../../models");
exports.addBook = async (req, res) => {
    try {
        const newBook = await books.create({
            ...req.body,
            thumbnail: req.files.image[0].filename,
            book_attachment: req.files.ebook[0].filename,
            idUser: req.user.id
        });

        res.send({
            status: "success...",
            data: newBook,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};


exports.getAllBooks = async (req,res) => {
    try {
        let data = await books.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data));
        data = data.map((item) => {
            return {
                ...item,
                book_attachment: process.env.PATH_FILE + item.book_attachment,
                thumbnail: process.env.PATH_FILE + item.thumbnail
            };
        });
        res.send({
            status: "success...",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
}

exports.getPromoBooks = async (req,res) => {
    try {
        let data = await books.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
            limit: 2
        });

        data = JSON.parse(JSON.stringify(data));
        data = data.map((item) => {
            return {
                ...item,
                book_attachment: process.env.PATH_FILE + item.book_attachment,
                thumbnail: process.env.PATH_FILE + item.thumbnail
            };
        });
        res.send({
            status: "success...",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
}


exports.getBookDetail = async (req,res) => {
    try {
        const { id } = req.params;
        let data = await books.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
            where: {
                id : id
            }
        });
        data = JSON.parse(JSON.stringify(data));

        data = {
            ...data,
            book_attachment: process.env.PATH_FILE + data.book_attachment,
            thumbnail: process.env.PATH_FILE + data.thumbnail
        };
        res.send({
            status: "success...",
            data,
        });
    }catch (err){
        console.log(err)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.updateBook = async (req,res) => {
    try {
        const { id } = req.params;

        let data = await books.findOne({
            where: {
                id
            }
        });
        if(!data){
            return res.send({
                message: `Product with ID: ${id} not found!`
            })
        }
        data = JSON.parse(JSON.stringify(data));

        const newData = {
            title: req?.body?.title || data.title,
            publication_date: req?.body?.publication_date || data.publication_date,
            pages: req?.body?.pages || data.pages,
            ISBN: req?.body?.ISBN || data.ISBN,
            author: req?.body?.author || data.author,
            price: req?.body?.price || data.price,
            thumbnail: req?.files?.image[0]?.filename || data.thumbnail,
            book_attachment: req?.files?.ebook[0]?.filename || data.book_attachment,
            desc: req?.body.desc || data.desc,
            idUser: req?.user?.id || data.user_id,
        };

        await books.update(newData, {
            where : {
                id : id
            }
        })

        res.send({
            status: "success",
            data: {
                product: newData
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