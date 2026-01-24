import axios from 'axios';

const API_URL = 'https://fakestoreapi.com';

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};
