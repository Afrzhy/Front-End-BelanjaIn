# 🔐 Setup Google OAuth - Step by Step (SIMPEL)

## Langkah 1: Buka Google Cloud Console

1. Go to: https://console.cloud.google.com
2. Login dengan Google account Anda (pakai Gmail)
3. Klik **"Select a project"** (atas kiri)

## Langkah 2: Buat Project Baru

1. Klik **"NEW PROJECT"** (pojok kanan atas)
2. **Project name:** `Belanjainn`
3. Klik **"CREATE"**
4. Tunggu beberapa detik...

## Langkah 3: Enable Google+ API

1. Di search bar atas, cari: `Google+ API`
2. Klik "Google+ API" dari hasil pencarian
3. Klik **"ENABLE"** (tombol biru besar)

## Langkah 4: Create OAuth Credential

1. Di sidebar kiri, cari **"Credentials"**
2. Klik **"+ CREATE CREDENTIALS"** (atas)
3. Pilih **"OAuth client ID"**

### Jika muncul "OAuth consent screen"

1. Klik **"CONFIGURE CONSENT SCREEN"**
2. Pilih **"External"** → Klik **"CREATE"**
3. Isi form:
   - **App name:** `Belanjainn`
   - **User support email:** (Email Anda)
   - **Developer contact info:** (Email Anda)
4. Klik **"SAVE AND CONTINUE"** (lewati bagian lainnya)
5. Kembali ke Credentials

## Langkah 5: Buat Client ID

1. Klik **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
2. **Application type:** Pilih **"Web application"**
3. **Name:** `Belanjainn Web`
4. Di bagian **"Authorized redirect URIs"**, klik **"+ ADD URI"**
5. Masukkan:
   ```
   http://localhost:5173
   ```
6. Klik **"CREATE"**

## Langkah 6: Copy Client ID

1. Sebuah modal akan muncul dengan:
   - **Client ID** (string panjang, misal: `123456789-abc123def456.apps.googleusercontent.com`)
   - **Client secret** (jangan diperlukan untuk sekarang)

2. **COPY** Client ID (klik icon copy)

## Langkah 7: Paste ke .env.local

1. Buka file: `c:\Users\MSI Thin\belanjainn\.env.local`
2. Lihat isi sekarang:

   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

3. Ganti `your_google_client_id_here` dengan Client ID yang sudah di-copy
4. Contoh hasil akhir:

   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=123456789-xxxxxxxxx.apps.googleusercontent.com
   ```

5. **SAVE** file (Ctrl + S)

## Langkah 8: Restart Dev Server

1. Buka Terminal
2. Ketik:
   ```bash
   npm run dev
   ```
3. Dev server akan restart

## ✅ Selesai!

Google button sekarang sudah bisa digunakan untuk login!

---

## 🐛 Jika masih error?

**Error: "The OAuth client was not found"**

- Client ID belum di-copy dengan benar
- Atau ada space/karakter tambahan saat paste
- Cek ulang `.env.local` tidak ada typo

**Tombol Google tidak muncul**

- Refresh browser (Ctrl + Shift + R)
- Cek apakah `.env.local` sudah di-save
- Lihat browser console (F12) ada error apa?

**Masih bingung?**

- Screenshot step mana yang stuck?
- Paste error message dari browser console (F12)?
