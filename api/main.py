import os
import telebot
from supabase import create_client, Client

TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

bot = telebot.TeleBot(TOKEN)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@bot.message_handler(func=lambda message: True)
def handle_all_messages(message):
    try:
        # ناردنی تەنها ناونیشان و ناوەڕۆک بۆ دڵنیابوون لە دروستی خشتە
        news_data = {
            "title": message.text[:30] if message.text else "پەیام",
            "content": message.text or "هیچ دەقێک نییە"
        }
        
        response = supabase.table('news').insert(news_data).execute()
        bot.reply_to(message, "✅ پەیامەکەت بە سەرکەوتوویی چووە ناو سۆپەبەیس!")
        
    except Exception as e:
        print(f"هەڵە: {e}")
        bot.reply_to(message, f"❌ هەڵەی داتابەیز: {e}")

if __name__ == "__main__":
    bot.infinity_polling()
