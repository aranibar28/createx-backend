const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/review");

const router = Router();

router.post("/send_review_product", [validateJWT], ctrl.send_review_product);
router.put("/edit_review_product/:id", [validateJWT], ctrl.edit_review_product);
router.get("/read_review_customer/:id", [validateJWT], ctrl.read_review_customer);
router.get("/read_review_product/:id", ctrl.read_review_product);
router.delete("/del_review_product/:id", ctrl.del_review_product);

module.exports = router;
