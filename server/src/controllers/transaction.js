const {transactions, users, product, profile, transaction_item, cart, books, cart_item} = require('../../models');
const midtransClient = require("midtrans-client");
const nodemailer = require("nodemailer");
const convertRupiah = require('rupiah-format');

exports.addTransaction = async (req,res) => {
    try {
        let data = req.body;

        const books_list = await cart.findAll({
            include: [
                {
                    model: books,
                    as: "books",
                    through: {
                        model : cart_item,
                        as: "cart_item",
                        attributes: {
                            include: ["id"],
                            exclude: ["createdAt", "updatedAt", "cart_id", "qty"]
                        },
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "publication_date", "pages", "ISBN", "author",
                                    "desc", "book_attachment", "thumbnail", "idUser"],
                    },
                }
            ],
            where: {
                user_id : req.user.id
            }
        });
        console.log(books_list)
        data = {
            id: parseInt(books_list[0].id+ Math.random().toString().slice(3, 8)),
            idBuyer: req.user.id,
            status: "pending",
        };

        const newData = await transactions.create(data);

        let dataBooks = JSON.parse(JSON.stringify(books_list));
        let totalPrice = 0;
        dataBooks[0].books.map(item => {
            transaction_item.create({
                book_id : item.cart_item.book_id,
                transaction_id : newData.id
            });
            totalPrice += item.price;
        });

        const buyerData = await users.findOne({
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser"],
                },
            },
            where: {
                id: newData.idBuyer,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });
        //
        let snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        let parameter = {
            transaction_details: {
                order_id: newData.id,
                gross_amount: totalPrice,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                full_name: buyerData?.name,
                email: buyerData?.email,
                phone: buyerData?.profile?.phone,
            },
        };

        const payment = await snap.createTransaction(parameter);
        res.send({
            status: "pending",
            message: "Pending transaction payment gateway",
            totalPrice : totalPrice,
            books : dataBooks[0].books,
            payment
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
}



exports.getAllTransaction = async (req,res) => {
    try {
        let data = await transactions.findAll({
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
                {
                    model: users,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
            ]
        })
        data = JSON.parse(JSON.stringify(data));
        console.log(data)
        data = data.map(item => {
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
            status: 'success',
            data
        });
    }catch (err){
        console.log(err)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.getTransactionByUserId = async (req,res) => {
    try {
        const id  = req.user.id;
        let data = await transactions.findAll({
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
                {
                    model: users,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
            ],
            where: {
                idBuyer : id
            }
        });
        data = JSON.parse(JSON.stringify(data));
        data = data.map(item => {
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
            status: 'success',
            data
        });
    }catch (err){
        console.log(err)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

exports.getTransaction = async (req,res) => {
    try {
        const { id } = req.params;
        let data = await transactions.findOne({
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
                {
                    model: users,
                    as: 'buyer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password', 'status']
                    }
                },
            ],
            where: {
                id : id
            }
        })
        data = JSON.parse(JSON.stringify(data));
        data = {
                ...data,
                books : data.books.map(itembooks => {
                    return {
                        ...itembooks,
                        book_attachment: process.env.PATH_FILE + itembooks.book_attachment,
                        thumbnail: process.env.PATH_FILE + itembooks.thumbnail
                    };
                })
            }
        res.send({
            status: 'success',
            data
        });
    }catch (err){
        console.log(err)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const apiClient = new midtransClient.Snap({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY,
});

/**
 *  Handle update transaction status after notification
 * from midtrans webhook
 * @param {string} status
 * @param {transactionId} transactionId
 */

// Create function for handle https notification / WebHooks of payment status here ...
exports.notification = async (req,res) => {
    try {
        apiClient.transaction.notification(req.body)
            .then(async (statusResponse) => {
                let orderId = statusResponse.order_id;
                let transactionStatus = statusResponse.transaction_status;
                let fraudStatus = statusResponse.fraud_status;

                console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

                // Sample transactionStatus handling logic

                if (transactionStatus == "capture") {
                    if (fraudStatus == "challenge") {
                        await updateTransaction("pending", orderId);
                        await sendEmail("pending", orderId);
                        res.status(200);
                    } else if (fraudStatus == "accept") {
                        await sendEmail("success", orderId);
                        await updateProduct(orderId);
                        await updateTransaction("success", orderId);
                        res.status(200);
                    }
                } else if (transactionStatus == "settlement") {
                    await sendEmail("success", orderId);
                    await updateTransaction("success", orderId);
                    res.status(200);
                } else if (
                    transactionStatus == "cancel" ||
                    transactionStatus == "deny" ||
                    transactionStatus == "expire"
                ) {
                    await sendEmail("failed", orderId);
                    await updateTransaction("failed", orderId);
                    res.status(200);
                } else if (transactionStatus == "pending") {
                    await sendEmail("pending", orderId);
                    await updateTransaction("pending", orderId);
                    res.status(200);
                }
            });
        res.send({
            message: 'success'
        })
    } catch (error) {
        // console.log(error)
        res.send({
            message: 'Server Error'
        })
    }
}

// Create function for handle transaction update status here ...
const updateTransaction = async (status, transactionId) => {
    await transactions.update(
        {
            status,
        },
        {
            where: {
                id: transactionId,
            },
        }
    );
};


const sendEmail = async (status, transactionId) => {
    // Config service and email account
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SYSTEM_EMAIL,
            pass: process.env.SYSTEM_PASSWORD,
        },
    });

    // Get transaction data
    let data = await transactions.findOne({
        where: {
            id: transactionId,
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
        },
        include: [
            {
                model: users,
                as: "buyer",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password", "status"],
                },
            },
            {
                model: books,
                as: "books",
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "idUser",
                        "qty",
                        "price",
                        "desc",
                    ],
                },
            },
        ],
    });

    data = JSON.parse(JSON.stringify(data));

    // Email options content
    const mailOptions = {
        from: process.env.SYSTEM_EMAIL,
        to: data.buyer.email,
        subject: "Payment status",
        text: "Your payment is <br />" + status,
        html: `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                  h1 {
                    color: brown;
                  }
                </style>
              </head>
              <body>
                <h2>Product payment :</h2>
                <ul style="list-style-type:none;">
                  <li>Name : ${data.product.name}</li>
                  <li>Total payment: ${convertRupiah.convert(data.price)}</li>
                  <li>Status : <b>${status}</b></li>
                </ul>
              </body>
            </html>`,
    };

    // Send an email if there is a change in the transaction status
    if (data.status != status) {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            console.log("Email sent: " + info.response);
            return res.send({
                status: "Success",
                message: info.response,
            });
        });
    }
};