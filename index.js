require("dotenv").config();
const mongoose = require("mongoose");
const compression = require("compression");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_DB || 3000).then(() => console.log("DB Online"));

// Rutas API
app.get("/", (req, res) => res.json({ welcome: "Server Ecommerce Angular v15 online" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/business", require("./routes/business"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/discounts", require("./routes/discounts"));
app.use("/api/coupons", require("./routes/coupons"));
app.use("/api/inventories", require("./routes/inventories"));
app.use("/api/uploads", require("./routes/uploads"));

app.use("/api/address", require("./routes/address"));
app.use("/api/sales", require("./routes/sales"));
app.use("/api/public", require("./routes/public"));

app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo Puerto: " + process.env.PORT);
});
