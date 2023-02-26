/* // Resources for mail
var fs = require("fs");
var handlebars = require("handlebars");
var ejs = require("ejs");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const send_email_sale = async (req, res = response) => {
   var id = req.params["id"];

   var readHTMLFile = function (path, callback) {
      fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
         if (err) {
            throw err;
            callback(err);
         } else {
            callback(null, html);
         }
      });
   };

   var transporter = nodemailer.createTransport(
      smtpTransport({
         service: "gmail",
         host: "smtp.gmail.com",
         auth: {
            user: "aranibargerson28@gmail.com",
            pass: "rkzxjmwoqaeupyuq",
         },
      })
   );

   var sale = await Sale.findById({ _id: id }).populate("customer");
   var details = await Sale_Detail.find({ sale: id }).populate("product");

   var cliente = sale.customer.first_name + " " + sale.customer.last_name;
   var _id = sale._id;
   var fecha = new Date(sale.created_at);
   var data = details;
   var subtotal = sale.subtotal;
   var precio_envio = sale.price_delivery;

   readHTMLFile(process.cwd() + "/mail.html", (err, html) => {
      let rest_html = ejs.render(html, { data, cliente, _id, fecha, subtotal, precio_envio });
      var template = handlebars.compile(rest_html);
      var htmlToSend = template({ op: true });
      var mailOptions = {
         from: "aranibargerson28@gmail.com",
         to: sale.customer.email,
         subject: "Gracias por tu compra, Mi Tienda",
         html: htmlToSend,
      };
      return res.json({ data: true });
      transporter.sendMail(mailOptions, function (error, info) {
         if (!error) {
            console.log("Email sent: " + info.response);
         }
      });
   });
};
 */
