/**
 * KonserKita - Data Konser, Kategori Tiket, Voucher & Iklan Sponsor
 */

const CONCERTS_DATA = [
  {
    id: "konser-harmony-2026",
    title: "Harmony Live Festival 2026",
    genre: "Pop & All-Stars",
    genreKey: "pop",
    city: "Jakarta",
    venue: "Stadion Madya GBK, Senayan, Jakarta",
    date: "28 November 2026",
    time: "15:00 - 23:00 WIB",
    lineup: "Sheila On 7, Tulus, Raisa, Maliq & D'Essentials, Kahitna",
    image: "assets/images/hero_banner.jpg",
    status: "Tersedia",
    statusType: "available",
    startingPrice: 450000,
    description: "Festival musik spektakuler tahunan di jantung Jakarta dengan tata panggung megah, nuansa hangat, dan deretan musisi papan atas Indonesia yang menyatukan generasi.",
    gates: "Gate A & Gate B (Pintu Senayan Timur)",
    tiers: [
      {
        id: "vip",
        name: "VIP Seated (Numbered)",
        badge: "VIP Paling Eksklusif",
        badgeType: "vip",
        price: 1850000,
        quota: 15,
        desc: "Duduk bernomor tepat di depan panggung dengan sightline terbaik, free snack & drink box, lanyard eksklusif, serta akses soundcheck.",
        perks: ["Kursi Bernomor", "Akses Soundcheck 1 Jam", "Exclusive Merchandise Kit", "Jalur Masuk VIP Khusus"]
      },
      {
        id: "cat1",
        name: "CAT 1 - Festival Standing",
        badge: "Favorit Penonton",
        badgeType: "cat1",
        price: 1150000,
        quota: 45,
        desc: "Area berdiri tepat di depan panggung utama, paling dekat dengan interaksi artis dan atmosfer konser yang semarak.",
        perks: ["Berdiri Area Depan", "Wristband Festival Khusus", "Akses Cepat Area Makanan"]
      },
      {
        id: "cat2",
        name: "CAT 2 - Tribune Tengah",
        badge: "Kenyamanan Seimbang",
        badgeType: "cat2",
        price: 750000,
        quota: 90,
        desc: "Duduk bernomor di tribun lantai 1 dengan sudut pandang panggung yang seimbang dan audio jernih.",
        perks: ["Duduk Bernomor", "Atap Pelindung Tribun", "Fasilitas Toilet Dekat"]
      },
      {
        id: "cat3",
        name: "CAT 3 - Tribune Atas",
        badge: "Paling Hemat",
        badgeType: "cat2",
        price: 450000,
        quota: 120,
        desc: "Duduk bernomor di tribun atas, pilihan paling ekonomis untuk menikmati lagu-lagu hits bersama ribuan penonton.",
        perks: ["Duduk Bernomor", "Pandangan Luas Seluruh Stadion"]
      }
    ]
  },
  {
    id: "konser-archipelago-bandung",
    title: "Sounds of Archipelago Tour",
    genre: "Indie & Rock",
    genreKey: "indie",
    city: "Bandung",
    venue: "Eldorado Dome, Lembang, Bandung",
    date: "12 Desember 2026",
    time: "16:00 - 22:30 WIB",
    lineup: ".Feast, Hindia, Reality Club, The Adams",
    imageSvg: "svg-rock",
    status: "Hampir Habis",
    statusType: "limited",
    startingPrice: 350000,
    description: "Tur kolaborasi panggung alternatif paling dinanti tahun ini di udara sejuk Bandung dengan energi musik indie rock yang bergelora.",
    gates: "Gate Barat & Gate Timur Eldorado",
    tiers: [
      {
        id: "vip",
        name: "VIP Early Access + Meet & Greet",
        badge: "Sisa 5 Tiket",
        badgeType: "vip",
        price: 850000,
        quota: 5,
        desc: "Masuk 1 jam lebih awal, poster konser bertanda tangan musisi, dan sesi foto singkat.",
        perks: ["Masuk 1 Jam Awal", "Official Tour T-shirt", "Poster Bertanda Tangan"]
      },
      {
        id: "cat1",
        name: "CAT 1 - Festival Moshpit",
        badge: "Tersedia",
        badgeType: "cat1",
        price: 550000,
        quota: 30,
        desc: "Area berdiri utama di depan panggung untuk sing-along paling intens.",
        perks: ["Berdiri Area Inti", "Wristband Kain Eksklusif"]
      },
      {
        id: "cat2",
        name: "CAT 2 - Regular Festival",
        badge: "Tersedia",
        badgeType: "cat2",
        price: 350000,
        quota: 65,
        desc: "Area berdiri santai di belakang CAT 1 dengan pandangan panggung utuh.",
        perks: ["Akses Area F&B", "Pandangan Penuh Panggung"]
      }
    ]
  },
  {
    id: "konser-acoustic-senja",
    title: "Nusantara Acoustic Senja",
    genre: "Folk & Acoustic",
    genreKey: "indie",
    city: "Yogyakarta",
    venue: "Tebing Breksi Open Air, Yogyakarta",
    date: "5 Desember 2026",
    time: "16:30 - 22:00 WIB",
    lineup: "Fourtwnty, Nadin Amizah, Danilla Riyadi, Sal Priadi",
    imageSvg: "svg-folk",
    status: "Tersedia",
    statusType: "available",
    startingPrice: 280000,
    description: "Nikmati lantunan musik syahdu di bawah langit senja dengan latar belakang megahnya ukiran tebing batu alam Breksi Yogyakarta.",
    gates: "Gate Utama Tebing Breksi",
    tiers: [
      {
        id: "vip",
        name: "VIP Mat & Cushion Senja",
        badge: "Best Sunset View",
        badgeType: "vip",
        price: 650000,
        quota: 20,
        desc: "Area duduk lesehan nyaman dengan bantal khusus di teras paling depan menghadap panggung & matahari terbenam.",
        perks: ["Bantal & Tikar Khusus", "Minuman Hangat Gratis", "Lanyard Senja"]
      },
      {
        id: "cat1",
        name: "CAT 1 - Amphitheatre Steps",
        badge: "Tersedia",
        badgeType: "cat1",
        price: 450000,
        quota: 70,
        desc: "Duduk santai di undakan batu tebing dengan visibilitas sempurna ke arah panggung.",
        perks: ["Duduk Undakan Alami", "Suasana Intim"]
      },
      {
        id: "cat2",
        name: "CAT 2 - Lawn Grass Area",
        badge: "Hemat",
        badgeType: "cat2",
        price: 280000,
        quota: 100,
        desc: "Area rumput terbuka di pelataran Breksi, cocok untuk berkumpul bersama teman.",
        perks: ["Bebas Bawa Tikar", "Area Terbuka Luas"]
      }
    ]
  },
  {
    id: "konser-rock-legenda",
    title: "Rock Legenda Indonesia",
    genre: "Rock & Band",
    genreKey: "rock",
    city: "Surabaya",
    venue: "Stadion Gelora Bung Tomo, Surabaya",
    date: "19 Desember 2026",
    time: "18:00 - 23:30 WIB",
    lineup: "Dewa 19 ft. Ari Lasso & Virzha, Padi Reborn, Jamrud",
    imageSvg: "svg-metal",
    status: "Tersedia",
    statusType: "available",
    startingPrice: 400000,
    description: "Konser akbar perayaan 3 dekade musik rock Indonesia dengan sound system standar dunia 150.000 watt dan 30 lagu legendaris.",
    gates: "Pintu Masuk Barat & Utara GBT",
    tiers: [
      {
        id: "vip",
        name: "VIP Seated Orchestra",
        badge: "Akses Terbaik",
        badgeType: "vip",
        price: 2000000,
        quota: 18,
        desc: "Kursi bernomor tepat di depan panggung, t-shirt edisi khusus, dan jalur parkir VIP.",
        perks: ["Kursi Bernomor Eksklusif", "T-shirt Tur Resmi", "Stiker Parkir VIP"]
      },
      {
        id: "cat1",
        name: "CAT 1 - Rocker Field",
        badge: "Tersedia",
        badgeType: "cat1",
        price: 900000,
        quota: 60,
        desc: "Area berdiri di rumput lapangan dekat panggung untuk menyanyikan hits rock tanpa henti.",
        perks: ["Akses Lapangan Depan", "Wristband Kulit Sintetis"]
      },
      {
        id: "cat2",
        name: "CAT 2 - Tribune West (Seated)",
        badge: "Tersedia",
        badgeType: "cat2",
        price: 600000,
        quota: 85,
        desc: "Duduk bernomor di tribun barat beratap.",
        perks: ["Duduk Bernomor", "Tribun Nyaman"]
      },
      {
        id: "cat3",
        name: "CAT 3 - Tribune East (Seated)",
        badge: "Hemat",
        badgeType: "cat2",
        price: 400000,
        quota: 110,
        desc: "Duduk bernomor di tribun timur dengan harga ramah kantong.",
        perks: ["Duduk Bernomor", "Pandangan Luas"]
      }
    ]
  },
  {
    id: "konser-jazz-soul",
    title: "Jakarta Jazz & Soul Lounge",
    genre: "Jazz & R&B",
    genreKey: "jazz",
    city: "Jakarta",
    venue: "Balai Sarbini, Semanggi, Jakarta",
    date: "23 Januari 2027",
    time: "19:30 - 23:00 WIB",
    lineup: "Tompi, Andien, Maliq & D'Essentials Jazz Set, Teza Sumendra",
    imageSvg: "svg-jazz",
    status: "Tersedia",
    statusType: "available",
    startingPrice: 500000,
    description: "Malam elegan penuh harmoni dan alunan instrumen brass dalam suasana indoor ber-AC dengan akustik ruang kelas dunia.",
    gates: "Lobi Utama Balai Sarbini (Lt. 2)",
    tiers: [
      {
        id: "vip",
        name: "VVIP Diamond Lounge",
        badge: "Meja Khusus",
        badgeType: "vip",
        price: 1750000,
        quota: 10,
        desc: "Duduk meja melingkar 4 orang, mocktail & canape gratis, serta katalog eksklusif.",
        perks: ["Meja Bundar VVIP", "Canape & Mocktail", "Layanan Pelayan Pribadi"]
      },
      {
        id: "cat1",
        name: "VIP Gold Floor (Seated)",
        badge: "Tersedia",
        badgeType: "cat1",
        price: 1100000,
        quota: 35,
        desc: "Kursi empuk di area parquette bawah lantai dasar.",
        perks: ["Kursi Parquette Empuk", "Akustik Maksimal"]
      },
      {
        id: "cat2",
        name: "Silver Balcony (Seated)",
        badge: "Tersedia",
        badgeType: "cat2",
        price: 500000,
        quota: 60,
        desc: "Duduk bertingkat di balkon lantai 2 dengan pemandangan panggung menyeluruh.",
        perks: ["Duduk Balkon", "Suasana Santai"]
      }
    ]
  },
  {
    id: "konser-bali-sunset-beats",
    title: "Sunset Beats Summer Fest",
    genre: "Electronic & Pop",
    genreKey: "electronic",
    city: "Bali",
    venue: "GWK Cultural Park, Uluwatu, Bali",
    date: "31 Desember 2026",
    time: "16:00 - 02:00 WITA",
    lineup: "Weird Genius, Dipha Barus, Diskoria, Whisnu Santika",
    imageSvg: "svg-dance",
    status: "Hampir Habis",
    statusType: "limited",
    startingPrice: 450000,
    description: "Perayaan pergantian tahun paling meriah di Pulau Dewata berlatar patung Garuda Wisnu Kencana dengan atraksi kembang api spektakuler.",
    gates: "Plaza Utama GWK Park",
    tiers: [
      {
        id: "vip",
        name: "VIP Sunset Deck Access",
        badge: "Sisa 8 Tiket",
        badgeType: "vip",
        price: 1950000,
        quota: 8,
        desc: "Akses dek elevated VIP khusus, bar eksklusif tanpa antri, dan merchandise NYE.",
        perks: ["Elevated Sunset Deck", "VIP Private Bar", "New Year Party Kit"]
      },
      {
        id: "cat1",
        name: "CAT 1 - Festival Wave Front",
        badge: "Tersedia",
        badgeType: "cat1",
        price: 850000,
        quota: 40,
        desc: "Area berdiri terdepan untuk berdansa dan menyambut kembang api tahun baru.",
        perks: ["Area Paling Dekat Panggung", "Kacamata Glow Party"]
      },
      {
        id: "cat2",
        name: "CAT 2 - General Admission",
        badge: "Tersedia",
        badgeType: "cat2",
        price: 450000,
        quota: 80,
        desc: "Akses seluruh area festival dan bazaar kuliner lokal.",
        perks: ["Akses Festival Luas", "Bazaar Kuliner & Seni"]
      }
    ]
  }
];

const VOUCHER_CODES = {
  "HARMONI10": {
    type: "percentage",
    value: 10,
    maxDiscount: 150000,
    label: "Diskon 10% (Maks. Rp 150.000)"
  },
  "KONSERHEMAT": {
    type: "flat",
    value: 75000,
    minPurchase: 300000,
    label: "Potongan Rp 75.000"
  },
  "TIKETBARU": {
    type: "flat",
    value: 50000,
    minPurchase: 100000,
    label: "Potongan Pengguna Baru Rp 50.000"
  },
  "BCA20": {
    type: "flat",
    value: 100000,
    minPurchase: 500000,
    label: "Diskon Kemitraan Bank BCA Rp 100.000"
  }
};

const PAYMENT_METHODS = [
  { id: "qris", name: "QRIS", desc: "BCA, GoPay, OVO, Dana, ShopeePay", icon: "📱", fee: 0 },
  { id: "bca_va", name: "BCA Virtual Account", desc: "Verifikasi Otomatis 24 Jam", icon: "🏦", fee: 2000 },
  { id: "mandiri_va", name: "Mandiri Virtual Account", desc: "Livin' by Mandiri & ATM", icon: "💳", fee: 2000 },
  { id: "gopay", name: "GoPay / GoPay Later", desc: "Konfirmasi lewat aplikasi Gojek", icon: "🟢", fee: 1000 },
  { id: "credit_card", name: "Kartu Kredit / Debit", desc: "Visa, Mastercard, JCB", icon: "🔒", fee: 3500 }
];
