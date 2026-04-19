import axios from "axios";
import { Product } from "@/interfaces/products";

const API_URL = "https://fakestoreapi.com/products";

export const getProductos = async (): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>(API_URL);
  return data;
};

export const getProductoById = async (id: number): Promise<Product> => {
  const { data } = await axios.get<Product>(`${API_URL}/${id}`);
  return data;
};
