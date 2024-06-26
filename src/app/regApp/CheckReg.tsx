import { useEffect, useState } from 'react';
import axios from 'axios';
import { sendMessage } from '../../shared/api/sendMessageApi';

const apiUrl = process.env.REACT_APP_URL_BACKEND;

// Установка cookie
const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; SameSite=None; Secure`;
};

// Интерфейс для объекта cookies
interface Cookies {
    [key: string]: string;
}

// Функция для получения cookie
const getCookie = (name: string): string | undefined => {
    const cookies: Cookies = document.cookie.split('; ').reduce((acc: Cookies, cookie: string) => {
        const [cookieName, cookieValue] = cookie.split('=');
        acc[cookieName] = cookieValue;
        return acc;
    }, {});

    return cookies[name];
};

const tg_data = window.Telegram.WebApp.initDataUnsafe;
const user_id = tg_data.user?.id;

const CheckReg = ({ navigate }: { navigate: any }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/users/check`, { user_id });
                const { exists } = response.data;
                setCookie('userVerified', 'true', 1); // Устанавливаем cookie
                navigate(exists ? '/' : '/reg');
            } catch (error) {
                navigate('/reg');
            } finally {
                setLoading(false);
            }
        };

        const userVerified = getCookie('userVerified') === 'true';

        if (user_id && !userVerified) {
            checkUserStatus();
        } else {
            setLoading(false);
        }
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Если загрузка завершена, ничего не отображаем, так как редирект произойдет в useEffect
    return null;
};

export default CheckReg;
