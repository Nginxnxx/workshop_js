var express = require("express");
var router = express.Router();
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const verfyToken = require("../middleware/jwt_decode");
// GET all products
router.get("/",verfyToken, async function (req, res, next) {
  try {
    let products = await Product.find();
    return res.status(201).json({
        data: products,
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

router.get("/:product_id/orders",verfyToken, async function (req, res, next) {
    let { product_id } = req.params;
    let { search, limit } = req.query;
    try {
        let order = await Order.find({ product_id});
        if(!order){
            return res.status(500).json({
                status : 500,
                message: "ไม่พบข้อมูลสินค้า",
                success: false,
              }); 
        }
        return res.status(201).json({
            data: order,
            message: "สำเร็จ",
            success: true,
          });
      } catch (error) {
        return res.status(500).json({
            status : 500,
            message: "ไม่พบข้อมูลสินค้า",
            success: false,
          });
      }
  });


router.post("/",verfyToken, async function (req, res, next) {
  try {
    let { product_id, product_name, description, price,stock } = req.body;
    const newProduct = new Product({
      product_id: product_id,
      product_name: product_name,
      description: description,
      price: price,
      stock: stock
    });
    const savedProduct = await newProduct.save();
    return res.status(201).json({
      data: savedProduct,
      message: "เพิ่มสินค้าสำเร็จ",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "เพิ่มสินค้าไม่สำเร็จ",
      success: false,
    });
  }
});

router.post("/:product_id/orders",verfyToken, async function (req, res, next) {
    try {
      const { product_id } = req.params;
      const { order_id, quantity, order_date } = req.body;
  
      const product = await Product.findOne({ product_id });
      if (!product) {
        return res.status(500).json({
          status: 500,
          message: "ไม่พบสินค้า",
          success: false,
        });
      }
  
      if (quantity > product.stock) {
        return res.status(500).json({
          message: "จำนวนสินค้าในคลังไม่เพียงพอ",
          success: false,
        });
      }
  
      const neworder = new Order({
        order_id: order_id,
        product_id: product_id,
        quantity: quantity,
        order_date: order_date || Date.now(),
      });
  
      await neworder.save();
  
      product.stock -= quantity;
      await product.save();
  
      return res.status(201).json({
        data: neworder,
        message: "สั่งซื้อสำเร็จ",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "สั่งซื้อไม่สำเร็จ",
        success: false,
      });
    }
  });

router.put("/:product_id",verfyToken, async function (req, res, next) {
  try {
    let { product_id } = req.params;
    let { product_name, description, price ,stock } = req.body;

    let Productupdate = await Product.findOneAndUpdate(
     { product_id: product_id },
      { product_name, description, price,stock },
      { new: true }
    );
    return res.status(201).json({
      data: Productupdate,
      message: "อัปเดตข้อมูลสินค้า",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "อัปเดตข้อมูลไม่สำเร็จ",
      success: false,
    });
  }
});

router.delete("/:product_id",verfyToken, async function (req, res, next) {
  try {
    let { product_id } = req.params;
    await Product.findOneAndDelete({ product_id: product_id });
    return res.status(201).json({
      message: "ลบข้อมูลสำเร็จ",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "ลบข้อมูลไม่สำเร็จ",
      success: false,
    });
  }

  res.send({ product_id });
});

router.get("/:product_id",verfyToken, async function (req, res, next) {
  let { product_id } = req.params;
  let { search, limit } = req.query;

  try {
    let product = await Product.findOne({ product_id: product_id });
    if(!product){
        return res.status(500).json({
            status : 500,
            message: "ไม่พบข้อมูลสินค้า",
            success: false,
          }); 
    }
    return res.status(201).json({
        data: product,
        message: "สำเร็จ",
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
        status : 500,
        message: "ไม่พบข้อมูลสินค้า",
        success: false,
      });
  }
});

module.exports = router;
