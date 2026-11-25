# Bot profil GitHub

Bot ini berada di repository **[demonfirx/demonfirx](https://github.com/demonfirx/demonfirx)** dan berjalan melalui GitHub Actions.

- **Kode utama:** [bot.mjs](bot.mjs), yang menjalankan [tools/update-profile.mjs](tools/update-profile.mjs).
- **Jadwal dan konfigurasi:** [.github/workflows/profile-update.yml](.github/workflows/profile-update.yml).
- **Status dan riwayat:** [halaman Actions](https://github.com/demonfirx/demonfirx/actions/workflows/profile-update.yml).

Jadwalnya enam kali sehari: **00:17, 04:17, 08:17, 12:17, 16:17, dan 20:17 WIB**. Setiap eksekusi mengambil statistik publik GitHub, memperbarui grafik bahasa, ringkasan kontribusi, serta animasi snake. Perubahan hasilnya disimpan melalui commit otomatis ke `main`.

Untuk menjalankan manual, buka halaman Actions di atas, pilih **Run workflow**, lalu jalankan branch `main`. Log setiap tahap tersedia di halaman eksekusinya.

Untuk menjalankan pengambilan statistik secara lokal, gunakan Node.js 24:

```sh
node bot.mjs
```

Perintah lokal memperbarui statistik dan kalender statis. Animasi snake dibuat oleh tahap **Animate the public contribution calendar** di workflow. Bot memakai `GITHUB_TOKEN` bawaan GitHub Actions; sumber data profil dibatasi ke endpoint publik.
