# Bot profil GitHub

Bot ini berada di repository **[demonfirx/demonfirx](https://github.com/demonfirx/demonfirx)** dan berjalan melalui GitHub Actions.

- **Kode utama:** [bot.mjs](bot.mjs), yang menjalankan [tools/update-profile.mjs](tools/update-profile.mjs).
- **Jadwal dan konfigurasi:** [.github/workflows/profile-update.yml](.github/workflows/profile-update.yml).
- **Status dan riwayat:** [halaman Actions](https://github.com/demonfirx/demonfirx/actions/workflows/profile-update.yml).

Jadwalnya **16 kali sehari**, dengan jarak **90 menit**: **00:17, 01:47, 03:17, 04:47, 06:17, 07:47, 09:17, 10:47, 12:17, 13:47, 15:17, 16:47, 18:17, 19:47, 21:17, dan 22:47 WIB**.

Setiap eksekusi mengambil statistik publik GitHub, memperbarui grafik bahasa, ringkasan kontribusi, serta animasi snake. Perubahan hasilnya disimpan melalui satu commit otomatis ke `main` per eksekusi, dengan target 16 commit bot per hari. Jumlah kontribusi yang ditampilkan tetap mengikuti perhitungan GitHub dan aktivitas lain pada akun.

Untuk menjalankan manual, buka halaman Actions di atas, pilih **Run workflow**, lalu jalankan branch `main`. Log setiap tahap tersedia di halaman eksekusinya.

Untuk menjalankan pengambilan statistik secara lokal, gunakan Node.js 24:

```sh
node bot.mjs
```

Perintah lokal memperbarui statistik dan kalender statis. Animasi snake dibuat oleh tahap **Animate the public contribution calendar** di workflow. Bot memakai `GITHUB_TOKEN` bawaan GitHub Actions; sumber data profil dibatasi ke endpoint publik.
