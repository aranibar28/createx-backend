const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/customer");
const router = Router();

router.post("/create_customer", [validateJWT], ctrl.create_customer);
router.get("/read_customers", [validateJWT], ctrl.read_customers);
router.get("/read_customer_by_id/:id", [validateJWT], ctrl.read_customer_by_id);
router.put("/update_customer/:id", [validateJWT], ctrl.update_customer);
router.delete("/delete_customer/:id", [validateJWT], ctrl.delete_customer);

module.exports = router;
