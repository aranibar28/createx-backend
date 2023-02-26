const { response } = require("express");
const Category = require("../models/category");
const Product = require("../models/product");

const create_category = async (req, res = response) => {
   let data = req.body;
   try {
      let reg = await Category.create(data);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_categories = async (req, res = response) => {
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
      };

      let reg = await Category.paginate(query, options);

      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const get_categories = async (req, res = response) => {
   try {
      let reg = await Category.aggregate([
         {
            $match: { status: true }
         },
         {
            $sort: { title: 1 }
         },
         {
            $lookup: {
               from: "products",
               localField: "_id",
               foreignField: "category",
               as: "products"
            }
         },
         {
            $project: {
               title: 1,
               icon: 1,
               image: 1,
               products: { $size: "$products" },
            }
         },
         {
            $group: {
               _id: null,
               total: { $sum: "$products" },
               categories: { $push: "$$ROOT" }
            }
         }
      ]);

      return res.json({ data: reg[0].categories, total: reg[0].total });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};



const read_category_by_id = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Category.findById(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const update_category = async (req, res = response) => {
   let id = req.params["id"];
   let data = req.body;

   try {
      let reg = await Category.findByIdAndUpdate(id, data, { new: true });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_category = async (req, res = response) => {
   let id = req.params["id"];
   try {
      const item = await Category.findById(id);
      if (item.status === true) {
         return res.json({ msg: "No se puede eliminar una categoría con status verdadero." });
      }

      const hasChildrens = await Product.findOne({ category: id }).exec();
      if (hasChildrens) {
         return res.json({ msg: "No se puede eliminar una categoría con productos relacionados." });
      }

      let reg = await Category.findByIdAndDelete(id, { new: true });
      if (reg.image.public_id) {
         await deleteImage(reg.image.public_id);
      }
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_categories = async (req, res = response) => {
   let data = req.body;
   try {
      const filteredData = data.filter(item => item.status !== true);
      const idsToDelete = [];

      for (let item of filteredData) {
         const hasChildrens = await Product.findOne({ category: item._id }).exec();
         if (!hasChildrens) {
            idsToDelete.push(item._id);
            if (item.image.public_id) {
               await deleteImage(item.image.public_id);
            }
         }
      }

      const deleted = await Category.deleteMany({ _id: { $in: idsToDelete } });

      return res.json(deleted);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


module.exports = {
   create_category,
   read_categories,
   get_categories,
   read_category_by_id,
   update_category,
   delete_category,
   delete_categories
};
