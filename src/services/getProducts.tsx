import axios from "axios";
import type { Product } from "../interfaces/products";

const API_URL = "https://fakestoreapi.com/products";

export const getProducts = async (): Promise<Product[]> => {
 
  const response = await axios.get("https://fakestoreapi.com/products");
  return response.data;
};

export default getProducts;
