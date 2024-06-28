from aiogram import F, Dispatcher
from aiogram.types import Message, InlineKeyboardMarkup, ReplyKeyboardMarkup, ContentType, BotCommand, KeyboardButton, WebAppInfo,InlineKeyboardButton
from aiogram.filters import CommandStart

# def register_start(dp: Dispatcher):
#     @dp.message(CommandStart())
#     async def start(message: Message):
#         web_app = WebAppInfo(url='https://d1b1-95-140-155-227.ngrok-free.app')

#         btn1 = KeyboardButton(
#             text='Зарегистрироваться',
#             web_app=web_app
#         )

#         btn2 = InlineKeyboardButton(
#             text='Зарегистрироваться',
#             web_app=web_app
#         )
        
#         kb1 = ReplyKeyboardMarkup(keyboard=[[btn1]], resize_keyboard=True)
#         kb2 = InlineKeyboardMarkup(inline_keyboard=[[btn2]])

#         await message.answer("Выберите действие:", reply_markup=kb1, parse_mode='Markdown')
#         await message.answer("Выберите действие:", reply_markup=kb2)


#     @dp.message(F.content_type == ContentType.WEB_APP_DATA)
#     async def new_user(message: Message):
#         web_app_data = message.web_app_data
#         data = web_app_data.data
#         await message.answer(f"Получены данные: {data}")

