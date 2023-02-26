const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/coupon");
const router = Router();

router.post("/create_coupon", [validateJWT], ctrl.create_coupon);
router.get("/read_coupons", [validateJWT], ctrl.read_coupons);
router.get("/read_coupon_by_id/:id", [validateJWT], ctrl.read_coupon_by_id);
router.put("/update_coupon/:id", [validateJWT], ctrl.update_coupon);
router.delete("/delete_coupon/:id", [validateJWT], ctrl.delete_coupon);
router.post("/delete_coupons", [validateJWT], ctrl.delete_coupons);
router.get("/validate_coupon/:coupon", [validateJWT], ctrl.validate_coupon);

module.exports = router;
