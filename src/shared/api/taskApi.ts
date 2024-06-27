import { axiosInstance } from './axiosInstance';
import { TaskItem } from '../interface/appInterface';


export const getTasks = async () => {
  try {
    const response = await axiosInstance.post('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

export const addTask = async (task: TaskItem) => {
  try {
    const response = await axiosInstance.post('/tasks/create', task);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (id: number, task: TaskItem) => {
  try {
    const response = await axiosInstance.put(`/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    await axiosInstance.delete(`/tasks/${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
