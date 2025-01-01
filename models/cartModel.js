const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const drinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const coffeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  food: { type: [foodSchema], required: true }, // Array of food objects
  drink: { type: [drinkSchema], required: true },
  coffee: { type: [coffeeSchema], required: true },
  address: { type: String, required: true },
  message: { type: String, required: true },
  telephone: { type: Number, required: true },
  total: { type: Number, required: true },
});

// Middleware to calculate the total before saving the document
cartSchema.pre("save", function (next) {
  let total = 0;

  this.food.forEach((item) => {
    total += item.price * item.quantity;
  });

  this.drink.forEach((item) => {
    total += item.price * item.quantity;
  });

  this.coffee.forEach((item) => {
    total += item.price * item.quantity;
  });

  this.total = total;
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
