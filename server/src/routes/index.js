const express = require("express");
const {login, register, checkAuth} = require("../controllers/auth");
const {auth} = require("../middlewares/auth");
const {uploadFile} = require("../middlewares/uploadFile");
const {addBook, getAllBooks, getPromoBooks, getBookDetail, updateBook, deleteBook} = require("../controllers/book");
const {addItemToCart, getAllItemCarts, deleteCart} = require("../controllers/cart");
const {addTransaction, getAllTransaction, getTransactionByUserId, getTransaction, notification} = require("../controllers/transaction");
const {getAllProfile, getProfileDetail, updateProfile} = require("../controllers/profile");

const router = express.Router();

// Routes books
router.post("/book", auth,uploadFile(), addBook);
router.get("/books", getAllBooks);
router.get("/promo-books", getPromoBooks);
router.get("/book/:id",auth, getBookDetail);
router.patch("/book/:id", auth, uploadFile(), updateBook);
router.delete("/book/:id", auth, deleteBook);

// Routes Cart
router.post("/cart/:id", auth, addItemToCart);
router.get("/carts", auth, getAllItemCarts);
router.delete("/cart/:id", auth, deleteCart);

// Route transaction

router.post("/transaction", auth, addTransaction);
router.get("/transaction", auth, getTransactionByUserId);
router.get("/transactions", auth, getAllTransaction);
router.get("/transaction/:id", auth, getTransaction);
router.post("/notification", notification);
// Route Register
router.post("/register", register);

// Route Login
router.post("/login", login);

// Route Check Auth
router.get("/check-auth", auth, checkAuth);

// Routes profile
router.get("/profiles",auth, getAllProfile);
router.get("/profile/",auth, getProfileDetail);
router.patch("/profile", auth, uploadFile(), updateProfile);

module.exports = router;