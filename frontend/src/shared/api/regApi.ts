import { axiosInstance } from './axiosInstance';
import { UserItem } from '../interface/appInterface';
import { setCookie } from '../../utils/cookieUtils';

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