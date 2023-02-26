const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/supplier");
const router = Router();

router.post("/create_supplier", [validateJWT], ctrl.create_supplier);
router.get("/read_suppliers", [validateJWT], ctrl.read_suppliers);
router.get("/read_all_suppliers", [validateJWT], ctrl.read_all_suppliers);
router.get("/read_supplier_by_id/:id", [validateJWT], ctrl.read_supplier_by_id);
router.put("/update_supplier/:id", [validateJWT], ctrl.update_supplier);
router.delete("/delete_supplier/:id", [validateJWT], ctrl.delete_supplier);

module.exports = router;
