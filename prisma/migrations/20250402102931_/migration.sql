-- Переименовываем ограничение первичного ключа
ALTER TABLE "Message" RENAME CONSTRAINT "Message_new_pkey" TO "Message_pkey";

-- Добавляем колонку isBot
ALTER TABLE "Message" ADD COLUMN "isBot" BOOLEAN NOT NULL DEFAULT false;
