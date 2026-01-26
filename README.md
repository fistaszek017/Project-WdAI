# Projekt-WdAI: Sklep Internetowy "ShopApp"

Projekt zaliczeniowy z przedmiotu WdAI (Wstęp do Aplikacji Internetowych). Prosty sklep internetowy umożliwiający przeglądanie produktów, dodawanie ich do koszyka, składanie zamówień oraz wystawianie opinii.

## 👨‍💻 Autorzy
- **Kacper Drozynski** 
- **Stanisław Ogonowski** 
- **Stanisław Wawrylak** 

## 🛠 Technologie
- **Frontend:** React, React Router, Vite, Axios
- **Backend:** Node.js, Express.js
- **Baza Danych:** SQLite (via Sequelize ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **API Zewnętrzne:** FakeStoreAPI (dane produktów)

## 🚀 Funkcjonalności

### Użytkownik Niezalogowany:
- Przeglądanie listy produktów (pobierane z FakeStoreAPI).
- Wyszukiwanie produktów po nazwie.
- Przeglądanie szczegółów produktu (opis, cena, ocena).
- Rejestracja i logowanie.

### Użytkownik Zalogowany:
- **Koszyk:** Dodawanie produktów (z wyborem rozmiaru i ilości), usuwanie, podgląd sumy.
- **Zamówienia:** Składanie zamówienia (formularz wysyłkowy) i podgląd historii zamówień w profilu.
- **Opinie:** Dodawanie opinii do produktów, edycja i usuwanie własnych opinii.
- **Profil:** Podgląd danych konta.

### Administrator:
- Dostęp do Panelu Admina.
- Przegląd wszystkich opinii w serwisie.
- Możliwość usunięcia dowolnej opinii (moderacja).

## ⚙️ Instrukcja Uruchomienia

### 1. Backend (Serwer)
```bash
cd server
npm install
node seed.js  # (Opcjonalnie) Inicjalizacja bazy danych i kont
node app.js
```
Serwer uruchomi się na porcie `3000`.

### 2. Frontend (Klient)
```bash
cd client
npm install
npm run dev
```
Aplikacja dostępna pod adresem `http://localhost:5173`.

## 🔑 Dane Testowe (z pliku seed.js)
- **Admin:** `admin@example.com` / `adminPassword123`
- **User:** `kacper@example.com` / `kacperPassword123`
