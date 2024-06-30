import { axiosInstance } from './axiosInstance';
import { UserItem } from '../interface/appInterface';
import { setCookie } from '../../utils/cookieUtils';


export const getUsers = async (query?: string, sort?: string, limit?: number) => {
  try {
    const response = await axiosInstance.post(`/users`, { query, sort, limit});
    return response.data;
    
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    return [];
  }
};

export const createUser = async (data: UserItem) => {
    try {
      const response = await axiosInstance.post('/users/create', data);
      return response.data;
    } catch (error) {
      console.error('Error create user:', error);
      return [];
    }
};


export const checkUserReg= async (id: number, navigate: (path: string) => void) => {
    try {
        const response = await axiosInstance.post('/users/check', { id });
        const { exists } = response.data;
        setCookie('userVerified', 'true', 1);
        navigate(exists ? '/' : '/reg');
    } catch (error) {
        navigate('/reg');
    } 
};

export const getUserName = async (id: string) => {
  const response = await axiosInstance.post(`/users/${id}/name`);

  return response.data;
};

