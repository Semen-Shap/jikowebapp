// Интерфейс для объекта cookies
interface Cookies {
    [key: string]: string;
}

// Функция для получения cookie
export const getCookie = (name: string): string | undefined => {
    const cookies: Cookies = document.cookie.split('; ').reduce((acc: Cookies, cookie: string) => {
        const [cookieName, cookieValue] = cookie.split('=');
        acc[cookieName] = cookieValue;
        return acc;
    }, {});

    return cookies[name];
};

// Установка cookie
export const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; SameSite=None; Secure`;
};