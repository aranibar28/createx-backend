const Employee = require("../models/employee");
const Category = require("../models/category");
const Product = require("../models/product");
const Config = require("../models/config");

const { uploadImage, deleteImage } = require("../middlewares/cloudinary");
const fs = require("fs");

const upload_image = async (req, res = response) => {
   const id = req.params["id"];
   const entityType = req.params.type;
   const validEntityTypes = ["business", "user", "category", "product"];

   if (!validEntityTypes.includes(entityType)) {
      return res.json({ msg: "No es un tipo válido" });
   }

   if (req.files) {
      const tempFilePath = req.files.image.tempFilePath;
      const { public_id, secure_url } = await uploadImage(tempFilePath, entityType);
      const image = { public_id, secure_url };

      switch (entityType) {
         case "business":
            await updateCompanyImage(id, Config, image, tempFilePath);
            break;
         case "product":
            await updateEntityImage(id, Product, image, tempFilePath);
            break;
         case "category":
            await updateEntityImage(id, Category, image, tempFilePath);
            break;
         case "user":
            await updateEntityImage(id, Employee, image, tempFilePath);
            break;
      }
   }

   return res.json({ data: true });
};

const updateEntityImage = async (id, Model, image, tempFilePath) => {
   let entity = await Model.findById(id);
   if (!entity) {
      throw new Error(`No se encontró una entidad ${Model.modelName} con ID ${id}`);
   }
   await Model.findByIdAndUpdate(id, { image });
   fs.unlinkSync(tempFilePath);
   if (entity.image.public_id) {
      await deleteImage(entity.image.public_id);
   }
};

const updateCompanyImage = async (id, Model, image, tempFilePath) => {
   let entity = await Model.findOne({ business: id });
   if (!entity) {
      throw new Error(`No se encontró una entidad ${Model.modelName} con ID ${id}`);
   }
   await Model.findOneAndUpdate({ business: id }, { image });
   fs.unlinkSync(tempFilePath);
   if (entity.image.public_id) {
      await deleteImage(entity.image.public_id);
   }
};

module.exports = {
   upload_image,
};
