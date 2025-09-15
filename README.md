# 🎬 Movie Search App

A modern React-based movie search application powered by [TMDB API](https://developer.themoviedb.org/docs) for movie data and [Supabase](https://supabase.com) for tracking search analytics.
The app allows users to **search for movies**, **discover trending films**, and **track search popularity** efficiently.

---

## 🚀 Features

* **Movie Search** – Find movies by title using TMDB's movie database.
* **Trending Movies** – View the most popular movies searched by users.
* **Search Analytics** – Track how often each movie is searched.
* **Debounced Search** – Optimized API calls with a debounce mechanism to prevent unnecessary requests.
* **Supabase Integration** – Store search analytics in a Postgres database.
* **Responsive UI** – Works on mobile and desktop devices.

---

## 🖥️ Demo

> https://gyazo.com/eb563ced47a2fe2f446b152b297828a1

---

## 🏗️ Tech Stack

| **Category**       | **Technology**                        |
| ------------------ | ------------------------------------- |
| Frontend Framework | React (Vite)                          |
| Backend / Database | Supabase (PostgreSQL)                 |
| Movie Data API     | TMDB (The Movie Database)             |
| Styling            | Tailwind CSS              |
| State Management   | React Hooks (`useState`, `useEffect`) |
| Optimizations      | `react-use` for debouncing            |

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### **1. Clone the repository**

```bash
git clone https://github.com/GMuchoki/react-movie-app
cd movie-search-app
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Configure environment variables**

Create a `.env` file in the root directory and add the following:

```env
# TMDB API Key (Bearer Token)
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 🔹 **Notes:**
>
> * Get a **TMDB API key** from [TMDB Developer Portal](https://developer.themoviedb.org/).
> * Create a project on [Supabase](https://supabase.com).
> * Copy your **Project URL** and **Anon Key** from the Supabase dashboard.

---

## 🗄️ Supabase Database Setup

You'll need to create a table in Supabase to store search analytics.

### **1. Create a Table**

Go to **Supabase → Table Editor → New Table** and set up like this:

| Column Name  | Type       | Default / Notes                     |
| ------------ | ---------- | ----------------------------------- |
| `id`         | UUID       | `gen_random_uuid()` *(Primary Key)* |
| `searchTerm` | Text       | *Required*                          |
| `count`      | Integer    | Default `1`                         |
| `movie_id`   | Integer    | *Required*                          |
| `poster_url` | Text (URL) | *Required*                          |
| `created_at` | Timestamp  | `now()` *(Default)*                 |

---

### **2. Example SQL Command**

You can also create the table via SQL:

```sql
create table search_metrics (
  id uuid primary key default gen_random_uuid(),
  searchTerm text not null,
  count integer default 1,
  movie_id integer not null,
  poster_url text not null,
  created_at timestamp with time zone default now()
);
```

---

### **3. Enable Row Level Security (RLS)**

Run this SQL in the Supabase SQL Editor to enable RLS:

```sql
alter table search_metrics enable row level security;
```

Then add a policy to allow public inserts and updates (for demo purposes):

```sql
create policy "Allow anonymous inserts and updates"
on search_metrics
for all
using (true)
with check (true);
```

> ⚠️ **Security Note:**
> In production, you should restrict permissions to authenticated users only.

---

## 📂 Project Structure

```
movie-search-app/
├── public/
│   └── hero.png
├── src/
│   ├── components/
│   │   ├── MovieCard.jsx
│   │   ├── Search.jsx
│   │   └── Spinner.jsx
│   ├── App.jsx
│   ├── supabaseClient.js
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

---

## 🔑 API Details

### **TMDB API**

* **Base URL:** `https://api.themoviedb.org/3`
* Search endpoint:

  ```
  GET /search/movie?query=<movie_name>
  ```
* Trending endpoint:

  ```
  GET /discover/movie?sort_by=popularity.desc
  ```

---

## 🧩 Supabase Integration

### **Initialize Supabase Client (`supabaseClient.js`)**

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;
```

---

### **Update Search Count**

This function checks if a search term exists, updates it if found, or inserts a new record.

```js
import supabase from './supabaseClient';

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // 1. Check if search term exists
    const { data, error } = await supabase
      .from('search_metrics')
      .select('*')
      .eq('searchTerm', searchTerm)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (data) {
      // 2. Update count if it exists
      await supabase
        .from('search_metrics')
        .update({ count: data.count + 1 })
        .eq('id', data.id);
    } else {
      // 3. Create a new record if it doesn't exist
      await supabase.from('search_metrics').insert([{
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }]);
    }
  } catch (err) {
    console.error('Error updating search count:', err.message);
  }
};
```

---

## 🚀 Running the App

Start the development server:

```bash
npm run dev
```

The app will be running at:
[http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

You can deploy the app to:

* **Vercel** – Easiest and free for frontend projects.
* **Netlify** – Great for static apps.
* **Supabase Edge Functions** – If you add backend logic later.

### **Environment Variables for Deployment**

Make sure to add:

* `VITE_TMDB_API_KEY`
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`

---

## 🌟 Future Improvements

* [ ] User authentication with Supabase Auth.
* [ ] Infinite scroll for movie listings.
* [ ] Dark mode support.
* [ ] Graphs and dashboards for search analytics.

---

## 🛡️ Security Notes

* Restrict database policies in production.
* Never commit `.env` files.
* Use Supabase JWT authentication for secure data access.

---

## 📜 License

This project is licensed under the MIT License.
