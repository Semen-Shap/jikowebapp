import { axiosInstance } from './axiosInstance';
import { MeetItem } from '../interface/appInterface';


export const getMeet = async () => {
  try {
    const response = await axiosInstance.post('/meets');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

export const addMeet = async (meet: MeetItem) => {
  try {
    const response = await axiosInstance.post('/meets/create', meet);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateMeet = async (id: number, meet: MeetItem) => {
  try {
    const response = await axiosInstance.put(`/meets/${id}`, meet);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteMeet = async (id: number) => {
  try {
    await axiosInstance.delete(`/meets/${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
