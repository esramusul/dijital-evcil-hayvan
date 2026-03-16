<h1 align="center">
  🐾 Dijital Evcil Hayvan
</h1>

<p align="center">
  <img src="assets/images/icon.png" width="120" alt="App Icon" />
</p>

<p align="center">
  <strong>React Native & Expo ile geliştirilmiş, evcil hayvan simülasyonu ve oyunlaştırma tabanlı mobil uygulama.</strong>
</p>

<p align="center">
  <a href="#-nasıl-çalıştırılır">Kurulum</a> •
  <a href="#-apk-indirme">APK İndir</a> •
  <a href="#-tanıtım-videosu">Video</a> •
  <a href="#-özellikler">Özellikler</a>
</p>

---

## 📖 Proje Hakkında

**Dijital Evcil Hayvan**, kullanıcıların sanal bir hayvanı benimseyip büyüttüğü, eğittiği ve onunla etkileşime geçtiği bir mobil oyun uygulamasıdır. Tamagotchi konseptinden ilham alınarak tasarlanan bu uygulama, modern oyunlaştırma mekanikleriyle zenginleştirilmiştir.

Kullanıcı; evcil hayvanının adını belirler, türünü seçer ve hayvanın açlık, temizlik, enerji, tuvalet ve mutluluk gibi temel ihtiyaçlarını karşılayarak onu sağlıklı tutmaya çalışır.

---

## 🎮 Oyunlaştırma Özellikleri

| Mekanik | Açıklama |
|---|---|
| **XP & Seviye Sistemi** | Besleme, banyo, uyutma gibi her aksiyon XP kazandırır. 10 seviye bulunur. |
| **Coin Sistemi** | Mini oyunları tamamladıkça coin kazanılır (oyun başına 10 coin). |
| **İhtiyaç Bozunması** | Her 30 saniyede bir ihtiyaçlar 5 puan azalır; hayvanı ihmal edersen durumu kötüleşir. |
| **Uyarı Sistemi** | İhtiyaç %30'un altına düşünce kırmızı uyarı, %15'in altında titreme animasyonu tetiklenir. |
| **Mini Oyunlar** | Her hayvan türüne özel 2 farklı mini oyun (Kedi, Köpek, Kuş, Tavşan). |
| **Çoklu Oda Sistemi** | Mutfak, Banyo, Tuvalet ve Uyku Odası — her ihtiyaç için ayrı ortam. |
| **Hayvan Seçimi** | Kuş 🐦, Kedi 🐱, Köpek 🐶, Tavşan 🐰 arasından seçim yapılabilir. |

### Aksiyon Etkileri

| Aksiyon | Etki |
|---|---|
| Besleme | Açlık +30, Tuvalet İhtiyacı +10, XP +5 |
| Oyun | Mutluluk +25, Enerji -15, XP +8 |
| Banyo | Temizlik +40, XP +4 |
| Tuvalet | Tuvalet İhtiyacı -50, XP +3 |
| Uyutma | Enerji +60, XP +6 |

---

## 🛠️ Teknoloji Yığını

- **Framework:** React Native + Expo (SDK 54)
- **Navigasyon:** Expo Router (file-based routing)
- **Durum Yönetimi:** Zustand
- **Dil:** TypeScript
- **Build:** EAS Build (Expo Application Services)
- **Ses:** expo-av
- **Animasyon:** React Native Animated API

---

## 📂 Proje Yapısı

```
dijital-evcil-hayvan/
├── app/
│   ├── (tabs)/          # Ana sekme ekranları
│   ├── (game)/          # Oyun ekranları (mutfak, banyo, tuvalet, uyku, mini oyunlar)
│   ├── setup.tsx        # Evcil hayvan kurulum ekranı
│   └── _layout.tsx      # Kök layout
├── components/
│   └── game/            # HUD, NeedBar, RoomBackground vb. bileşenler
├── constants/
│   └── game.ts          # Oyun sabitleri (XP, coin, decay değerleri)
├── store/               # Zustand store (global state)
├── utils/               # Ses ve yardımcı fonksiyonlar
├── assets/
│   ├── images/pets/     # Hayvan görselleri
│   └── sounds/          # Oyun sesleri
├── app.json             # Expo konfigürasyonu
├── eas.json             # EAS Build profilleri
└── dijital-evcil-hayvan.apk  # Release APK
```

---

## 🚀 Nasıl Çalıştırılır?

### Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üstü)
- [Git](https://git-scm.com/)
- Expo Go uygulaması (iOS/Android) **veya** Android Emülatör

### 1. Repoyu Klonla

```bash
git clone https://github.com/esramusul/dijital-evcil-hayvan.git
cd dijital-evcil-hayvan
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Uygulamayı Başlat

```bash
npx expo start
```

Terminalde bir QR kodu görünecektir.

### 4. Çalıştır

**Telefonda (Expo Go):**
- Android: [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) uygulamasını indir ve QR kodu tara.
- iOS: Kameranı aç ve QR kodu tara.

**Emülatörde:**
```bash
# Android emülatör
npx expo start --android

# iOS simülatör (sadece macOS)
npx expo start --ios
```

---

## 📦 APK İndirme

Uygulamayı doğrudan Android cihazınıza kurmak için:

### Seçenek 1 — Repo'dan İndir
APK dosyası repo kökünde mevcuttur:
```
dijital-evcil-hayvan.apk
```
[⬇️ APK'yı İndir](./dijital-evcil-hayvan.apk)

### Seçenek 2 — Expo Build Sayfasından İndir
[Expo Build Sayfası →](https://expo.dev/accounts/esramusul/projects/dijital-evcil-hayvan/builds/7c417e17-1a7f-48a2-8a01-15c322b08704)

### Kurulum Adımları (Android)
1. APK dosyasını telefonunuza indirin
2. Ayarlar → Güvenlik → **"Bilinmeyen Kaynaklardan Yükleme"** seçeneğini etkinleştirin
3. Dosya yöneticisinden APK'ya tıklayıp **Yükle** deyin

> **Not:** APK boyutu ~85 MB'dir. Android 6.0 (API 23) ve üzeri sürümlerle uyumludur.

---

## 🎬 Tanıtım Videosu

[![Dijital Evcil Hayvan Tanıtım Videosu](https://img.youtube.com/vi/LqBrZu47R98/0.jpg)](https://www.youtube.com/shorts/LqBrZu47R98)

---

## 👩‍💻 Geliştirici

**Esra Musul**

- LinkedIn: [Esra Musul](https://www.linkedin.com/posts/esra-musul-970789294_dijital-evcil-hayvan-react-native-expo-share-7439275798877954048-hoQT?utm_source=share&utm_medium=member_desktop)


---

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
