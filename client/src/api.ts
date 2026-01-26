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

const LOCAL_API_URL = 'http://localhost:3000/api';


export interface Review {
    id: number;
    productId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt: string;
    User?: {
        id: number;
        email: string;
    };
}

export const getReviews = async (productId: string) => {
    const response = await axios.get(`${LOCAL_API_URL}/products/${productId}/reviews`);
    return response.data;
};

export const getAllReviews = async (token: string) => {
    const response = await axios.get(`${LOCAL_API_URL}/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addReview = async (token: string, productId: string, rating: number, comment: string) => {
    const response = await axios.post(`${LOCAL_API_URL}/reviews`, { productId, rating, comment }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteReview = async (token: string, reviewId: number) => {
    const response = await axios.delete(`${LOCAL_API_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateReview = async (token: string, reviewId: number, rating: number, comment: string) => {
    const response = await axios.put(`${LOCAL_API_URL}/reviews/${reviewId}`, { rating, comment }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};


export const getAllOrders = async (token: string) => {
    const response = await axios.get(`${LOCAL_API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateOrderStatus = async (token: string, orderId: number, status: string) => {
    const response = await axios.put(`${LOCAL_API_URL}/admin/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
