<div align="center">
  <img src="public/logo.svg" alt="WorkDei Logo" width="120">
  
  # WorkDei
  
  ### *Build the future, together.*

  [![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  **WorkDei** adalah aplikasi manajemen proyek modern yang dirancang untuk membantu tim berkolaborasi secara efisien melalui manajemen tugas yang intuitif dan komunikasi real-time.
</div>

---

## ✨ Fitur Utama

### 📊 Manajemen Proyek
- **Multi-Project Hub:** Kelola berbagai proyek dalam satu dasbor terpusat.
- **Role-Based Access:** Sistem peran fleksibel (Admin, Project Manager, Member).
- **Statistik Real-time:** Pantau progres melalui grafik dan analitik yang diperbarui secara instan.
- **Tracking Status:** Alur kerja terorganisir (Pending, In Progress, Completed).

### ✅ Manajemen Tugas (Kanban & List)
- **Drag & Drop Kanban:** Pindahkan tugas antar kolom status dengan mulus.
- **Prioritas & Label:** Kategorikan tugas berdasarkan urgensi dan label kustom.
- **Threaded Comments:** Diskusi terpadu langsung di dalam setiap kartu tugas.
- **Smart Filtering:** Cari dan urutkan tugas berdasarkan PIC, tenggat, atau label.

### 🎨 User Experience
- **Glassmorphism UI:** Tampilan modern, bersih, dan premium.
- **Dark/Light Mode:** Dukungan penuh untuk kenyamanan mata pengguna.
- **Responsive Design:** Optimal di desktop maupun perangkat mobile.
- **Instant Notifications:** Pemberitahuan real-time melalui WebSockets.



## 🛠️ Tech Stack

| Backend | Frontend |
| :--- | :--- |
| **Framework:** Laravel 11.x | **Library:** React with TypeScript |
| **Database:** MySQL | **State/SPA:** Inertia.js |
| **Real-time:** Laravel Reverb | **Styling:** TailwindCSS & Shadcn UI |
| **Auth:** Laravel Sanctum & Socialite | **Icons:** Lucide Icons |

---

## 📥 Installation

1. Clone the repository

```bash
git clone https://github.com/baday4121/project-management-app.git
cd project-management-app
```

2. Install PHP dependencies

```bash
composer install
```

3. Install JavaScript dependencies

```bash
pnpm install # or npm install if you don't have pnpm installed
```

4. Configure environment variables

```bash
cp .env.example .env
```

Update the following in your .env file:

- Database credentials
- App URL
- Mail configuration
- Reverb/WebSocket settings
- OAuth Socialite settings (optional)

### Social Login Configuration

Add these to your .env file for social authentication:

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI="${OAUTH_BASE_URL}/auth/github/callback"

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI="${OAUTH_BASE_URL}/auth/google/callback"
```

5. Generate application key

```bash
php artisan key:generate
```

6. Run migrations and seeders

```bash
php artisan migrate --seed
```

## 👤 Default Credentials

After seeding the database, you can login with:

- Email: admin@example.com
- Password: password1

## 💻 Development

For local development:

1. Start the Laravel development server

```bash
php artisan serve
```

2. Run Vite development server

```bash
pnpm dev # or npm run dev if you don't have pnpm installed
```

3. Run WebSocket server (for real-time features)

```bash
php artisan reverb:start
```

4. Run the Laravel queue worker

```bash
php artisan queue:listen
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
