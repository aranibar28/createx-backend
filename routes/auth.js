const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/auth");
const router = Router();

router.get("/", ctrl.seed_data);
router.post("/login", ctrl.login);
router.post("/register", ctrl.register);
router.post("/login_user", ctrl.login_user);
router.get("/renew_token", [validateJWT], ctrl.renew_token);
router.get("/refresh_token", [validateJWT], ctrl.refresh_token);

module.exports = router;
