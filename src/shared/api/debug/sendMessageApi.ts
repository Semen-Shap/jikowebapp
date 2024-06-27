import axios from "axios"

const token = process.env.REACT_APP_TOKEN;

export function sendMessage(message: any){
  
    message = JSON.stringify(message);

    const user_id = window.Telegram.WebApp.initDataUnsafe.user?.id;
    if (!user_id) return;

    const URI_API = `https://api.telegram.org/bot${token}/sendMessage`

    axios.post(URI_API, {
        chat_id: user_id,
        text: message,
        parse_mode: 'html',
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() =>{
        console.log('Done')
      })
};