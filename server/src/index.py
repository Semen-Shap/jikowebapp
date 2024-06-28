import logging
import sys
import asyncio
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from os import getenv
from dotenv import load_dotenv
# from RegApp.reg import register_handlers
# from RegApp.keyboard import register_start


# Загрузка переменных окружения из .env файла
load_dotenv()

# Токен вашего бота
TOKEN = getenv("TOKEN")

# Инициализация диспетчера
dp = Dispatcher()

# Регистрация обработчиков
# register_handlers(dp)
# register_start(dp)

async def main() -> None:
    bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
