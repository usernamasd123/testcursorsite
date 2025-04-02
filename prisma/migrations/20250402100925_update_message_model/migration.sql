-- Создаем новую таблицу Message
CREATE TABLE "Message_new" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "userId" TEXT,
    "cardId" TEXT,
    "hour" INTEGER NOT NULL DEFAULT 0,
    "isError" BOOLEAN NOT NULL DEFAULT false,
    "isLead" BOOLEAN NOT NULL DEFAULT false,
    "leadType" TEXT,
    "rating" TEXT,
    "sessionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_new_pkey" PRIMARY KEY ("id")
);

-- Создаем временную сессию
INSERT INTO "UserSession" ("id", "userId", "messageCount", "isReturning", "lastMessageTime", "createdAt", "updatedAt", "messageTimes")
VALUES ('default-session', 'default-user', 0, false, NOW(), NOW(), NOW(), ARRAY[]::timestamp[]);

-- Копируем данные в новую таблицу
INSERT INTO "Message_new" (
    "id", "content", "role", "userId", "cardId", "hour", 
    "isError", "isLead", "leadType", "rating", 
    "sessionId", "timestamp"
)
SELECT 
    "id", "content", "role", "userId", "cardId", "hour",
    "isError", "isLead", "leadType", "rating",
    'default-session', "timestamp"
FROM "Message";

-- Удаляем старую таблицу
DROP TABLE "Message";

-- Переименовываем новую таблицу
ALTER TABLE "Message_new" RENAME TO "Message";

-- Создаем индексы
CREATE INDEX "Message_userId_idx" ON "Message"("userId");
CREATE INDEX "Message_cardId_idx" ON "Message"("cardId");
CREATE INDEX "Message_hour_idx" ON "Message"("hour");

-- Создаем таблицу MessageReaction
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- Добавляем индексы
CREATE UNIQUE INDEX "MessageReaction_messageId_sessionId_key" ON "MessageReaction"("messageId", "sessionId");

-- Добавляем внешние ключи
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "UserSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "UserSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE; 