import { axiosInstance } from './axiosInstance';
import { UserItem } from '../interface/appInterface';


export const getUsers = async (query?: string, sort?: string) => {
    try {
      const response = await axiosInstance.post<UserItem[]>(`/users`, { query, sort });
      return response.data;
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
      return [];
    }
};