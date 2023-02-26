const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const { tempUpload } = require("../middlewares/cloudinary");
const ctrl = require("../controllers/product");
const router = Router();

router.post("/create_product", [validateJWT], ctrl.create_product);
router.get("/read_products", [validateJWT], ctrl.read_products);
router.get("/get_products", [validateJWT], ctrl.get_products);
router.put("/update_product/:id", [validateJWT], ctrl.update_product);
router.delete("/delete_product/:id", [validateJWT], ctrl.delete_product);
router.post("/delete_products", [validateJWT], ctrl.delete_products);
router.put("/add_items_gallery/:id", [validateJWT, tempUpload], ctrl.add_items_gallery);
router.put("/del_items_gallery/:id", [validateJWT], ctrl.del_items_gallery);

router.get("/read_products_public", ctrl.read_products_public);
router.get("/read_product_by_slug/:slug", ctrl.read_product_by_slug);
router.get("/read_product_by_category/:category", ctrl.read_product_by_category);
router.get("/get_trending_products", ctrl.get_trending_products);
router.get("/get_sales_products", ctrl.get_sales_products);
router.get("/get_news_products", ctrl.get_news_products);

module.exports = router;
