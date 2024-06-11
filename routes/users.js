var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model"); // โมเดลที่นำเข้า
const jwt = require("jsonwebtoken");
const verfyToken = require("../middleware/jwt_decode")


/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/:id", async function (req, res, next) {
  let { id } = req.params;
  let { search, limit } = req.query;

  try {
    let users = await User.findById(id);
    return res.send(users);
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

router.post("/register", async function (req, res, next) {
  try {
    // ดึงข้อมูลจาก body
    const { password, username, firstName, lastName, email } = req.body;

    // ตรวจสอบว่าข้อมูลจำเป็นครบหรือไม่
    if (!password || !username || !firstName || !lastName || !email) {
      return res.status(400).send({
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        success: false,
      });
    }

    // ตรวจสอบว่ามีชื่อผู้ใช้หรืออีเมลนี้อยู่ในระบบแล้วหรือไม่
    const existingUser = await User.findOne({ $or: [{ username }] });
    if (existingUser) {
      return res.status(409).send({
        message: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้ไปแล้ว",
        success: false,
      });
    }

   
    const hashPassword = await bcrypt.hash(password, 10); // ใช้ salt รอบที่ 10 เพื่อความปลอดภัย

  
    const newUser = new User({
      username: username,
      password: hashPassword,
      firstName: firstName,
      lastName: lastName,
      email: email,
      status: 0,
    });

    
    const savedUser = await newUser.save();

    // ส่งข้อมูลกลับไปยังไคลเอนต์
    return res.status(201).send({
      data: { _id: savedUser._id, username, firstName, lastName, email },
      message: "สมัครสมาชิกสำเร็จ",
      success: true,
    });
  } catch (error) {
    // จัดการข้อผิดพลาด Duplicate key (ชื่อผู้ใช้หรืออีเมลซ้ำ)
    if (error.code === 11000) {
      return res.status(409).send({
        message: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้ไปแล้ว",
        success: false,
      });
    }
    console.error("Error:", error); // Log ข้อผิดพลาดสำหรับการดีบัก
    return res.status(500).send({
      message: "สมัครสมาชิกไม่สำเร็จ",
      success: false,
    });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    let { password, username } = req.body;
    let user = await User.findOne({
      username: username,
    });
    if (!user) {
      return res.status(500).send({
        message: "ไม่พบบัญชีผู้ใช้",
        success: false,
      });
    }
    if (user.status == 0) {
      return res.status(403).send({
        message: "บัญชีนี้ยังไม่ได้รับการอนุมัติ",
        success: false,
      });
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(500).send({
        message: "รหัสผ่านไม่ถูกต้อง",
        success: false,
      });
    }
    const { _id, firstName, lastName, email } = user;
    const token = jwt.sign({ _id, firstName, lastName, email},process.env.JWT_KEY)
    return res.status(201).send({
      data: { _id, firstName, lastName, email,token},
      message: "เข้าสู่ระบบสำเร็จ",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "เข้าสู่ระบบไม่สำเร็จ",
      success: false,
    });
  }
});

router.put("/approve/:id", async function (req, res, next) {
  try {
    let { id } = req.params;
    let { status } = req.body;

    let Userupdate = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return res.send("อนุมัติบัญชีของ " + Userupdate.username + " เรียบร้อย");
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

module.exports = router;
