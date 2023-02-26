const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/discount");
const router = Router();

router.post("/create_discount", [validateJWT], ctrl.create_discount);
router.get("/read_discounts", [validateJWT], ctrl.read_discounts);
router.get("/read_discount_by_id/:id", [validateJWT], ctrl.read_discount_by_id);
router.put("/update_discount/:id", [validateJWT], ctrl.update_discount);
router.delete("/delete_discount/:id", [validateJWT], ctrl.delete_discount);
router.post("/delete_discounts", [validateJWT], ctrl.delete_discounts);
router.get("/validate_discount", ctrl.validate_discount);

module.exports = router;
