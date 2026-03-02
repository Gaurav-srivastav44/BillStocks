import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};