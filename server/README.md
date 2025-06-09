# 📌 Проект с MongoDB и Docker

## 📜 Описание
Этот проект использует MongoDB и Docker для локального развертывания базы данных.

## 🚀 Установка и запуск
### 1. 📥 Клонирование репозитория
```sh
git clone https://github.com/iclegane/board.git
cd ./board/server
```

### 2. ⚙ Настройка переменных окружения
Создай файл `.env` и добавь в него:
```ini
MONGO_URI=mongodb://admin:password@localhost:27017/
JWT_ACCESS_SECRET_KEY - 32 byte
JWT_REFRESH_SECRET_KEY - 32 byte
CLIENT_ORIGIN=http://localhost:3001
WS_PORT=8080
APP_PORT=5001
```

### 3. 🐳 Запуск MongoDB через Docker
Запусти команду:
```sh
docker-compose up -d
```
Это развернёт MongoDB в контейнере в фоновом режиме.

### 4. 🛠 Подключение к MongoDB
Можно использовать [MongoDB Compass](https://www.mongodb.com/try/download/compass) или командную строку:
```sh
mongosh mongodb://admin:password@localhost:27017/
```

## 🛑 Остановка контейнера
```sh
docker-compose down
```

## 📌 Полезные команды
### Проверить запущенные контейнеры
```sh
docker ps
```
### Просмотреть логи контейнера MongoDB
```sh
docker logs <container-id>
```
### Перезапустить контейнер
```sh
docker restart <container-id>
```