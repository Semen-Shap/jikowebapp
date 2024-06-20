let tg = window.Telegram.WebApp;

tg.expand();

let btn = document.getElementById('btn')

btn.addEventListener('click', function(){
    tg.close();
});

