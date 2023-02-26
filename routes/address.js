const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/address");
const router = Router();

router.post("/create_address", [validateJWT], ctrl.create_address);
router.get("/read_address_by_id/:id", [validateJWT], ctrl.read_address_by_id);
router.get("/read_principal_address/:id", [validateJWT], ctrl.read_principal_address);
router.put("/update_address/:id", [validateJWT], ctrl.update_address);
router.delete("/delete_address/:id", [validateJWT], ctrl.delete_address);

module.exports = router;
