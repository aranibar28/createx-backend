const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/role");
const router = Router();

router.post("/create_role", [validateJWT], ctrl.create_role);
router.get("/read_roles", [validateJWT], ctrl.read_roles);
router.get("/read_role_by_id/:id", [validateJWT], ctrl.read_role_by_id);
router.put("/update_role/:id", [validateJWT], ctrl.update_role);
router.delete("/delete_role/:id", [validateJWT], ctrl.delete_role);
router.post("/create_branch", [validateJWT], ctrl.create_branch);
router.get("/read_branch", [validateJWT], ctrl.read_branch);
router.put("/update_branch/:id", [validateJWT], ctrl.update_branch);
router.delete("/delete_branch/:id", [validateJWT], ctrl.delete_branch);

module.exports = router;
