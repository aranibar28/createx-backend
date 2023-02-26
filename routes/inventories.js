const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/inventory");
const router = Router();

router.post("/create_inventory", [validateJWT], ctrl.create_inventory);
router.get("/read_inventory_input", [validateJWT], ctrl.read_inventory_input);
router.get("/read_inventory_output", [validateJWT], ctrl.read_inventory_output);
router.delete("/delete_inventory/:id", [validateJWT], ctrl.delete_inventory);

module.exports = router;
