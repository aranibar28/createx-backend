const { response } = require("express");
const { generateSlug } = require("../utils/functions");
const { deleteImage, uploadImage } = require("../middlewares/cloudinary");
const Product = require("../models/product");
const Category = require("../models/category");
const fs = require("fs");

const create_product = async (req, res = response) => {
   let data = req.body;
   try {
      let exist_title = await Product.findOne({ title: data.title });

      if (exist_title) {
         return res.json({ msg: "Este título ya se encuentra registrado.", exist: true });
      } else {
         data.slug = generateSlug(data.title);
         let reg = await Product.create(data);
         return res.json({ data: reg });
      }
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_products = async (req, res = response) => {
   const { page = 1, limit = 10, search = "", status, } = req.query;

   try {
      const query = {
         title: { $regex: search, $options: "i" },
      };

      if (status) {
         query.status = status;
      }

      const options = {
         page,
         limit,
         populate: "category",
      };

      let reg = await Product.paginate(query, options);

      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_products_public = async (req, res = response) => {
   const { page = 1, limit = 12, category = "", search = "", order = "", min, max } = req.query;

   try {
      let query = {
         title: { $regex: search, $options: "i" },
         status: true,
      };

      if (category) {
         let id = await Category.findOne({ title: { $regex: new RegExp(category, "i") } }).select("_id")
         query.category = id;
      }

      if (min && max) {
         query.price = { $gte: min, $lte: max };
      }

      const options = {
         page,
         limit,
         populate: "category",
         sort: getOrder(order)
      }
      let reg = await Product.paginate(query, options);

      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const getOrder = (order) => {
   switch (order) {
      case "popularity":
         return { "num_sales": -1 };
      case "ratings":
         return { "num_points": -1 };
      case "max":
         return { "price": -1 };
      case "min":
         return { "price": 1 };
      case "az":
         return { "title": 1 };
      case "za":
         return { "title": -1 };
      default:
         return null;
   }
}



const get_products = async (req, res = response) => {
   try {
      let reg = await Product.find({ status: true });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const read_product_by_slug = async (req, res = response) => {
   let slug = req.params["slug"];
   try {
      let reg = await Product.findOne({ slug }).populate("category")
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_product_by_category = async (req, res = response) => {
   let category = req.params["category"];
   try {
      let reg = await Product.find({ category }).sort({ created_at: -1 }).limit(9).populate("category")
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const get_news_products = async (req, res = response) => {
   try {
      let reg = await Product.find().sort({ created_at: -1 }).limit(9).populate("category")
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const get_sales_products = async (req, res = response) => {
   try {
      let reg = await Product.find().sort({ num_sales: -1 }).limit(9).populate("category")
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const get_trending_products = async (req, res = response) => {
   try {
      let reg = await Product.find().sort({ num_points: -1 }).limit(9).populate("category")
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const update_product = async (req, res = response) => {
   let id = req.params["id"];
   const { title, ...data } = req.body;

   try {
      const product = await Product.findById(id);
      if (title && title != product.title) {
         const exist_title = await Product.findOne({ title });
         if (exist_title) {
            return res.json({ msg: "Este título ya se encuentra registrado.", exist: true });
         }
         data.title = title;
         data.slug = generateSlug(title);
      }
      let reg = await Product.findByIdAndUpdate(id, data, { new: true });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const delete_product = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let product = await Product.findById(id);
      if (product.stock != 0) {
         return res.json({ msg: "El stock debe estar en 0 para eliminarlo." });
      }

      let reg = await Product.findByIdAndDelete(id);
      if (reg.image.public_id) {
         await deleteImage(reg.image.public_id);
      }
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_products = async (req, res = response) => {
   let data = req.body;;

   try {
      const filteredData = data.filter(item => item.stock === 0);
      const ids = filteredData.map(item => item._id);

      const deleted = await Product.deleteMany({ _id: { $in: ids } });
      for (let item of filteredData) {
         if (item.image.public_id) {
            await deleteImage(item.image.public_id);
         }
      }
      return res.json(deleted);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const add_items_gallery = async (req, res = response) => {
   let id = req.params["id"];

   try {
      if (req.files) {
         let product = await Product.findById(id);
         if (product.gallery.length >= 4) {
            return res.json({ msg: "No se puede agregar más de 4 imágenes" });
         }
         const tempFilePath = req.files.image.tempFilePath;
         const { public_id, secure_url } = await uploadImage(tempFilePath, "gallery");
         fs.unlinkSync(tempFilePath);
         let reg = await Product.findByIdAndUpdate(id, {
            $push: {
               gallery: {
                  public_id,
                  secure_url
               },
            },
         }, { new: true }).populate("category");
         return res.json({ data: reg });
      }
   } catch (error) {
      return res.json({ msg: error.message });
   }

};

const del_items_gallery = async (req, res = response) => {
   let id = req.params["id"];
   let data = req.body;

   let reg = await Product.findByIdAndUpdate(id, {
      $pull: {
         gallery: {
            public_id: data.public_id,
         },
      },
   }, { new: true }).populate("category");

   if (data.public_id) {
      await deleteImage(data.public_id);
   }

   return res.json({ data: reg });
};

module.exports = {
   create_product,
   read_products,
   get_products,
   read_products_public,
   read_product_by_slug,
   read_product_by_category,
   get_trending_products,
   get_sales_products,
   get_news_products,
   update_product,
   delete_product,
   delete_products,
   add_items_gallery,
   del_items_gallery
};
