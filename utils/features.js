const Product = require("../models/product");

const increase_stock = async (id, qty) => {
   let product = await Product.findById(id);
   let new_stock = product.stock + qty;
   await Product.findByIdAndUpdate(id, { stock: new_stock });
};

const decrease_stock = async (id, qty) => {
   let product = await Product.findById(id);
   let new_stock = product.stock - qty;
   await Product.findByIdAndUpdate(id, { stock: new_stock });
};

const setup_stock = async (id, qty) => {
   let product = await Product.findById(id);
   let new_stock = product.stock - qty;
   let num_sales = product.num_sales + qty;
   await Product.findByIdAndUpdate(id, { num_sales, stock: new_stock });
};

module.exports = {
   increase_stock,
   decrease_stock,
   setup_stock
};
