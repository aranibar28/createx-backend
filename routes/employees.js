const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/employee");
const router = Router();

router.post("/create_employee", [validateJWT], ctrl.create_employee);
router.get("/read_employees", [validateJWT], ctrl.read_employees);
router.get("/read_employee_by_id/:id", [validateJWT], ctrl.read_employee_by_id);
router.put("/update_employee/:id", [validateJWT], ctrl.update_employee);
router.delete("/delete_employee/:id", [validateJWT], ctrl.delete_employee);
router.post("/delete_employees", [validateJWT], ctrl.delete_employees);

module.exports = router;
