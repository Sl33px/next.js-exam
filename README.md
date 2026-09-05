# The Movies App (Next.js 15+ App Router)

Навчальний проєкт "The Movies App", виконаний на **Next.js 15+ (App Router)**, **TypeScript** та **Tailwind CSS** із використанням **The Movie Database (TMDB) API**.

Проєкт побудований за принципами **Server-First архітектури** (Server Components + Client Islands) із використанням серверного кешування, скейлингу метаданих (SEO) та збереженням стану в URL.
---

## 🛠 Технологічний стек

* **Framework:** Next.js 15+ (App Router, Server Components, Streaming)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Data Fetching & Caching:** Native `fetch` API, Next.js Data Cache (ISR / `revalidate`)
* **State Management & Routing:** URL-based state (`searchParams`), Next.js Navigation
* **API:** The Movie Database (TMDB API v3)

---

## Покроковий запуск проєкту

### 1. Клонування репозиторію
Відкрийте термінал та виконайте команду для клонування проєкту, після чого перейдіть у папку проєкту:
```bash
git clone https://github.com/Sl33px/next.js-exam.git
cd next.js-exam
```

### 2. Налаштування середовища та API Key
Для роботи додатка потрібен Bearer Token з акаунта TMDB.

У корені проєкту створіть файл `.env.local`:
   ```env
    NEXT_PUBLIC_TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzY1Y2EzZjk5YzU1MTgyZDJmMTQ5YTQwNWIxMjMxNCIsIm5iZiI6MTc4ODA0NzE1NS45NjEsInN1YiI6IjZhOTM2ZjMzMjUwMDUxYjM5ZDRmNmNhOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xJUY-XKzTqmeacJgl2v0CRFjUyAPOC57Ak8XMaDYvkI
   ```

### 3. Встановлення залежностей та запуск
Встановіть необхідні пакети та запустіть сервер розробки:

#### Встановлення пакетів:
```
npm install
```

#### Запуск проєкту в режимі розробки
```
npm run dev
```

### 4. Перевірка збірки (Production Build)
Щоб перевірити проєкт на відсутність помилок TypeScript та зібрати продакшен-версію:
```
npm run build
```

---

### Архітектура та Особливості (App Router Standards)
* Server-First (SSR): Усі основні сторінки (`app/page.tsx`, `app/movie/[id]/page.tsx`) є Server Components. Дані фетчаться безпосередньо на Node.js сервері без використання клієнтських useEffect або сторонніх бібліотек на кшталт `axios`.
* Client Islands: Директива `use client` використовується виключно в дрібних інтерактивних вузлах (`SearchInputComponent`, `MoviesListComponent`, `UpcomingMoviesComponent`), де потрібні події користувача або локальний стан.
* Server Caching (ISR): Усі запити до TMDB обгорнуті в універсальний хелпер fetchHelperForCaching з параметром next: { revalidate: 3600 }. Це забезпечує серверне кешування (Incremental Static Regeneration), скорочує кількість мережевих запитів і прискорює завантаження до `~0ms`.
* URL-based State: Пошук, пагінація, фільтри та сортування синхронізовані з URL query-параметрами (`searchParams`). Це забезпечує SSR-сумісність, збереження стану при оновленні та можливість ділитися посиланнями.
* Streaming & Suspense: Використання системного файла loading.tsx обгортає сторінки в React.Suspense і показує анімований стан завантаження під час виконання серверних запитів.
* Dynamic Metadata & SEO: На сторінках фільмів реалізовано функцію generateMetadata для динамічного створення `<title>`, `<meta>` та `OpenGraph` тегів під кожен фільм.

---

### Функціонал сторінок та Навігація
### 1. Головна сторінка — HomePage (/)
* Навігаційна шапка: Пошуковий рядок для швидкого введення запиту (`SearchInputComponent`) з миттєвою синхронізацією параметра `query` в URL.
* Очікувані прем'єри (`UpcomingMoviesComponent`): Карусель незабаром вихідних фільмів на базі `Swiper`.
* Основний каталог та Фільтрація (`MoviesListComponent`):

* #### Каталог фільмів: Адаптивна сітка картка з постерами, рейтингом та назвами.
* Фільтрація за жанрами: Швидкий вибір жанрів з інтерактивними кнопками (`with_genres`).
* Гнучке сортування: Перемикання за популярністю (`popularity.desc`), високим рейтингом (`vote_average.desc`), датою релізу та алфавітом.
* Пагінація: Навігація сторінками (`page`) із повним збереженням усіх активних параметрів URL.

### 2. Детальна сторінка фільму — MovieDetailsPage (/movie/[id])
* Візуальне оформлення: Динамічний розмитий задній фон (`backdrop_path`) із затіненням для занурення в атмосферу фільму.
* #### Основна інформація:
* Назва, оригінальна назва, слоган (`tagline`), віковий рейтинг (18+) та опис (`overview`).
* Постер високої якості з оптимізацією через `<Image /> (next/image)` та інтерактивний рейтинг зірочками (`StarsRating`).
* Тривалість фільму, дата релізу, мова оригіналу, бюджет та касові збори.

* Категорії та Жанри: Інтерактивні бейджі жанрів, клік на які повертає на головну сторінку з фільтрацією за обраним жанром (`/?with_genres=ID`).
* Франшиза / Колекція: Відображення блоку серії фільмів (`MovieCollectionBlock`), якщо стрічка належить до кіновсесвіту.
* #### Медіа та Виробництво:
* Вбудований компонент перегляду офіційних трейлерів (`MovieTrailerComponent`).
* Галерея логотипів компаній-виробників із використанням remotePatterns для безпечного завантаження зовнішніх зображень.