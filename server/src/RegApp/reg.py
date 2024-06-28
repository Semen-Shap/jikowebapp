from aiogram import Dispatcher
from aiogram.types import Message
from aiogram.filters import Command
from Database.index import SessionLocal, User

def register_handlers(dp: Dispatcher):
    # Регистрация обработчика команды '/register'
    @dp.message(Command("register"))
    async def command_register(message: Message):
        user_id = message.from_user.id
        user_name = message.from_user.full_name

        # Подключение к базе данных
        db = SessionLocal()

        # Проверка, зарегистрирован ли пользователь
        db_user = db.query(User).filter(User.user_id == user_id).first()
        if db_user:
            await message.answer(f"{user_name}, вы уже зарегистрированы!")
        else:
            # Добавление нового пользователя в базу данных
            new_user = User(user_id=user_id, user_name=user_name)
            db.add(new_user)
            db.commit()
            await message.answer(f"Спасибо за регистрацию, {user_name}!")

        # Закрытие сессии базы данных
        db.close()