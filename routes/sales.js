
const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/sale");

const router = Router();

// Sales
router.post("/register_order", [validateJWT], ctrl.register_order);
router.get("/get_order_customer/:id", [validateJWT], ctrl.get_order_customer);
router.get("/get_order_detail/:id", [validateJWT], ctrl.get_order_detail);

module.exports = router;
