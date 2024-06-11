var express = require("express");
var router = express.Router();
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const verfyToken = require("../middleware/jwt_decode");
/* GET users listing. */


router.get("/",verfyToken, async function (req, res, next) {
  try {
    let product = await Product.find()
    let orders = await Order.find();
    return res.status(201).json({
      data: orders,
      message: "สำเร็จ",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "ไม่พบข้อมูลสินค้า",
      success: false,
    });
  }
});




module.exports = router;
