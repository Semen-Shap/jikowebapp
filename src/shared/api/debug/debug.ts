import axios from 'axios';
import { sendMessage } from './sendMessageApi';

const apiUrl = process.env.REACT_APP_URL_BACKEND;

const get_users = () => {
    const url = apiUrl + '/api/users';
    // sendMessage(`Request URL: ${url}`);

    axios.post(url)
    .then((res) => {
        sendMessage(res.data)
    })
    .catch((err) => {
        sendMessage(err.message)
    })
    .finally(() => {
    });
};

const create_user = async () => {
    // Loop to create 10 users
    for (let i = 1; i <= 10; i++) {
        // Generate random data (for demonstration purposes)
        const user_id = i;
        const name = `User ${i}`;
        const email = `user${i}@example.com`;
        const skills = ['Skill A', 'Skill B'];  // Example array of skills
        const softwares = ['Software X', 'Software Y'];  // Example array of softwares
        const renders = 0;  // Example renders count, adjust as necessary

        // URL for creating a new user
        const url = `${apiUrl}/api/users/create`;

        try {
            // POST request to create a new user
            const response = await axios.post(url, {
                user_id: user_id,
                name: name,
                email: email,
                skills: skills,
                softwares: softwares,
                renders: renders
            });

            // Log success message (optional)
            console.log(`User ${i} created successfully:`, response.data);
        } catch (error) {
            // Log error message if request fails
            console.error(`Error creating User ${i}:`, error);
        }
    }
};

const check_user = () => {
    const url = `${apiUrl}/api/users/check`;

    const user_id = window.Telegram.WebApp.initDataUnsafe.user?.id;

    axios.post(url, {user_id})
    .then(response => {
        sendMessage(response.data);
    })
    .catch(err => {
        sendMessage(err);
    })
};

const debug = () => {
    if (!apiUrl) {
        sendMessage('apiUrl is not defined')
        return;
    }

    // check_user();
    // get_users();
    // create_user();
};

export default debug;
