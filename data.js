// Johor PRN 16 State Seats Data & Malay Sentiment Lexicon

const REGIONS = {
  NORTH: "Segamat & Ledang (North)",
  WEST: "Muar & Bakri (West)",
  CENTRAL_WEST: "Batu Pahat (Central-West)",
  CENTRAL_NORTH: "Kluang & Mersing (Central-North)",
  EAST_SOUTHWEST: "Kota Tinggi & Pontian (East & South-West)",
  SOUTH: "Johor Bahru & Kulai (South)"
};

// 56 DUN Seats with simulated baseline popularity for PRN Johor 16
// Base sentiments reflect typical political dynamics (e.g. urban/non-urban split)
const JOHOR_SEATS = [
  // Segamat & Ledang (North)
  { code: "N01", name: "Buloh Kasap", region: REGIONS.NORTH, voters: 28450, base: { BN: 0.48, PH: 0.22, PN: 0.25, OTH: 0.05 } },
  { code: "N02", name: "Jementah", region: REGIONS.NORTH, voters: 41200, base: { BN: 0.35, PH: 0.45, PN: 0.16, OTH: 0.04 } },
  { code: "N03", name: "Pemanis", region: REGIONS.NORTH, voters: 29800, base: { BN: 0.42, PH: 0.25, PN: 0.28, OTH: 0.05 } },
  { code: "N04", name: "Kemelah", region: REGIONS.NORTH, voters: 33700, base: { BN: 0.44, PH: 0.28, PN: 0.23, OTH: 0.05 } },
  { code: "N05", name: "Tenang", region: REGIONS.NORTH, voters: 22600, base: { BN: 0.46, PH: 0.22, PN: 0.27, OTH: 0.05 } },
  { code: "N06", name: "Bekok", region: REGIONS.NORTH, voters: 27400, base: { BN: 0.38, PH: 0.44, PN: 0.14, OTH: 0.04 } },
  { code: "N10", name: "Tangkak", region: REGIONS.NORTH, voters: 35500, base: { BN: 0.33, PH: 0.48, PN: 0.15, OTH: 0.04 } },
  { code: "N11", name: "Serom", region: REGIONS.NORTH, voters: 39000, base: { BN: 0.45, PH: 0.20, PN: 0.31, OTH: 0.04 } },

  // Muar & Bakri (West)
  { code: "N07", name: "Bukit Kepong", region: REGIONS.WEST, voters: 37500, base: { BN: 0.38, PH: 0.18, PN: 0.41, OTH: 0.03 } },
  { code: "N08", name: "Bukit Pasir", region: REGIONS.WEST, voters: 32200, base: { BN: 0.43, PH: 0.21, PN: 0.32, OTH: 0.04 } },
  { code: "N09", name: "Gambir", region: REGIONS.WEST, voters: 29400, base: { BN: 0.40, PH: 0.22, PN: 0.35, OTH: 0.03 } },
  { code: "N12", name: "Bentayan", region: REGIONS.WEST, voters: 34800, base: { BN: 0.22, PH: 0.65, PN: 0.10, OTH: 0.03 } },
  { code: "N13", name: "Simpang Jeram", region: REGIONS.WEST, voters: 40000, base: { BN: 0.32, PH: 0.46, PN: 0.20, OTH: 0.02 } },
  { code: "N14", name: "Bukit Naning", region: REGIONS.WEST, voters: 22600, base: { BN: 0.41, PH: 0.28, PN: 0.27, OTH: 0.04 } },
  { code: "N15", name: "Maharani", region: REGIONS.WEST, voters: 38600, base: { BN: 0.34, PH: 0.38, PN: 0.25, OTH: 0.03 } },
  { code: "N16", name: "Sungai Balang", region: REGIONS.WEST, voters: 30100, base: { BN: 0.49, PH: 0.15, PN: 0.32, OTH: 0.04 } },

  // Batu Pahat (Central-West)
  { code: "N17", name: "Semerah", region: REGIONS.CENTRAL_WEST, voters: 46600, base: { BN: 0.46, PH: 0.22, PN: 0.29, OTH: 0.03 } },
  { code: "N18", name: "Sri Medan", region: REGIONS.CENTRAL_WEST, voters: 32700, base: { BN: 0.58, PH: 0.12, PN: 0.27, OTH: 0.03 } },
  { code: "N19", name: "Yong Peng", region: REGIONS.CENTRAL_WEST, voters: 34700, base: { BN: 0.47, PH: 0.38, PN: 0.12, OTH: 0.03 } },
  { code: "N20", name: "Semarang", region: REGIONS.CENTRAL_WEST, voters: 27700, base: { BN: 0.62, PH: 0.10, PN: 0.25, OTH: 0.03 } },
  { code: "N21", name: "Parit Yaani", region: REGIONS.CENTRAL_WEST, voters: 41800, base: { BN: 0.42, PH: 0.36, PN: 0.19, OTH: 0.03 } },
  { code: "N22", name: "Parit Raja", region: REGIONS.CENTRAL_WEST, voters: 36000, base: { BN: 0.48, PH: 0.20, PN: 0.29, OTH: 0.03 } },
  { code: "N23", name: "Penggaram", region: REGIONS.CENTRAL_WEST, voters: 69000, base: { BN: 0.26, PH: 0.59, PN: 0.12, OTH: 0.03 } },
  { code: "N24", name: "Senggarang", region: REGIONS.CENTRAL_WEST, voters: 37400, base: { BN: 0.43, PH: 0.28, PN: 0.26, OTH: 0.03 } },
  { code: "N25", name: "Rengit", region: REGIONS.CENTRAL_WEST, voters: 27100, base: { BN: 0.52, PH: 0.16, PN: 0.29, OTH: 0.03 } },

  // Kluang & Mersing (Central-North)
  { code: "N26", name: "Machap", region: REGIONS.CENTRAL_NORTH, voters: 33800, base: { BN: 0.54, PH: 0.18, PN: 0.25, OTH: 0.03 } },
  { code: "N27", name: "Layang-Layang", region: REGIONS.CENTRAL_NORTH, voters: 25200, base: { BN: 0.46, PH: 0.28, PN: 0.22, OTH: 0.04 } },
  { code: "N28", name: "Mengkibol", region: REGIONS.CENTRAL_NORTH, voters: 66300, base: { BN: 0.25, PH: 0.63, PN: 0.09, OTH: 0.03 } },
  { code: "N29", name: "Mahkota", region: REGIONS.CENTRAL_NORTH, voters: 65100, base: { BN: 0.48, PH: 0.33, PN: 0.16, OTH: 0.03 } },
  { code: "N30", name: "Paloh", region: REGIONS.CENTRAL_NORTH, voters: 25800, base: { BN: 0.45, PH: 0.35, PN: 0.16, OTH: 0.04 } },
  { code: "N31", name: "Kahang", region: REGIONS.CENTRAL_NORTH, voters: 29300, base: { BN: 0.56, PH: 0.15, PN: 0.25, OTH: 0.04 } },
  { code: "N32", name: "Endau", region: REGIONS.CENTRAL_NORTH, voters: 27900, base: { BN: 0.41, PH: 0.14, PN: 0.42, OTH: 0.03 } },
  { code: "N33", name: "Tenggaroh", region: REGIONS.CENTRAL_NORTH, voters: 38400, base: { BN: 0.58, PH: 0.12, PN: 0.27, OTH: 0.03 } },

  // Kota Tinggi & Pontian (East & South-West)
  { code: "N34", name: "Panti", region: REGIONS.EAST_SOUTHWEST, voters: 38400, base: { BN: 0.60, PH: 0.12, PN: 0.25, OTH: 0.03 } },
  { code: "N35", name: "Pasir Raja", region: REGIONS.EAST_SOUTHWEST, voters: 28000, base: { BN: 0.64, PH: 0.10, PN: 0.23, OTH: 0.03 } },
  { code: "N36", name: "Sedili", region: REGIONS.EAST_SOUTHWEST, voters: 28600, base: { BN: 0.68, PH: 0.08, PN: 0.21, OTH: 0.03 } },
  { code: "N37", name: "Johor Lama", region: REGIONS.EAST_SOUTHWEST, voters: 32700, base: { BN: 0.62, PH: 0.11, PN: 0.24, OTH: 0.03 } },
  { code: "N38", name: "Penawar", region: REGIONS.EAST_SOUTHWEST, voters: 36600, base: { BN: 0.72, PH: 0.06, PN: 0.19, OTH: 0.03 } },
  { code: "N39", name: "Tanjung Surat", region: REGIONS.EAST_SOUTHWEST, voters: 25100, base: { BN: 0.66, PH: 0.09, PN: 0.22, OTH: 0.03 } },
  { code: "N53", name: "Benut", region: REGIONS.EAST_SOUTHWEST, voters: 28100, base: { BN: 0.58, PH: 0.14, PN: 0.25, OTH: 0.03 } },
  { code: "N54", name: "Pulai Sebatang", region: REGIONS.EAST_SOUTHWEST, voters: 46900, base: { BN: 0.44, PH: 0.28, PN: 0.25, OTH: 0.03 } },
  { code: "N55", name: "Pekan Nanas", region: REGIONS.EAST_SOUTHWEST, voters: 35800, base: { BN: 0.46, PH: 0.38, PN: 0.13, OTH: 0.03 } },
  { code: "N56", name: "Kukup", region: REGIONS.EAST_SOUTHWEST, voters: 34600, base: { BN: 0.53, PH: 0.18, PN: 0.26, OTH: 0.03 } },

  // Johor Bahru & Kulai (South)
  { code: "N40", name: "Tiram", region: REGIONS.SOUTH, voters: 105700, base: { BN: 0.41, PH: 0.35, PN: 0.21, OTH: 0.03 } },
  { code: "N41", name: "Puteri Wangsa", region: REGIONS.SOUTH, voters: 112800, base: { BN: 0.32, PH: 0.45, PN: 0.20, OTH: 0.03 } },
  { code: "N42", name: "Johor Jaya", region: REGIONS.SOUTH, voters: 91800, base: { BN: 0.36, PH: 0.48, PN: 0.13, OTH: 0.03 } },
  { code: "N43", name: "Permas", region: REGIONS.SOUTH, voters: 103500, base: { BN: 0.42, PH: 0.34, PN: 0.21, OTH: 0.03 } },
  { code: "N44", name: "Larkin", region: REGIONS.SOUTH, voters: 76000, base: { BN: 0.44, PH: 0.32, PN: 0.21, OTH: 0.03 } },
  { code: "N45", name: "Stulang", region: REGIONS.SOUTH, voters: 60500, base: { BN: 0.29, PH: 0.58, PN: 0.10, OTH: 0.03 } },
  { code: "N46", name: "Perling", region: REGIONS.SOUTH, voters: 101200, base: { BN: 0.33, PH: 0.51, PN: 0.13, OTH: 0.03 } },
  { code: "N47", name: "Kempas", region: REGIONS.SOUTH, voters: 62000, base: { BN: 0.45, PH: 0.30, PN: 0.22, OTH: 0.03 } },
  { code: "N48", name: "Skudai", region: REGIONS.SOUTH, voters: 102800, base: { BN: 0.20, PH: 0.68, PN: 0.09, OTH: 0.03 } },
  { code: "N49", name: "Kota Iskandar", region: REGIONS.SOUTH, voters: 116400, base: { BN: 0.41, PH: 0.36, PN: 0.20, OTH: 0.03 } },
  { code: "N50", name: "Bukit Permai", region: REGIONS.SOUTH, voters: 39600, base: { BN: 0.45, PH: 0.32, PN: 0.20, OTH: 0.03 } },
  { code: "N51", name: "Bukit Batu", region: REGIONS.SOUTH, voters: 46200, base: { BN: 0.34, PH: 0.48, PN: 0.15, OTH: 0.03 } },
  { code: "N52", name: "Senai", region: REGIONS.SOUTH, voters: 63700, base: { BN: 0.25, PH: 0.63, PN: 0.09, OTH: 0.03 } }
];

// Sentiment Lexicon with positive, negative, and neutral Malay words (including slangs & typos)
const MALAY_LEXICON = {
  positive: [
    "mantap", "hebat", "sokong", "stabil", "terbaik", "menang", "maju", "percaya", 
    "setuju", "berjaya", "adil", "prihatin", "bersih", "aman", "pilihan", "bagus", 
    "tahniah", "memuaskan", "semangat", "padu", "kebajikan", "berkualiti", "pantas", 
    "amanah", "cemerlang", "steady", "terbukti", "mudah", "selesa", "tolong", "bantu", 
    "sayang", "suka", "bijak", "ikhlas", "mesra", "hormat", "yakin", "padu", "mampunyai", 
    "selamat", "berbakti", "membantu", "memajukan", "kemajuan", "sejahtera", "berkaliber"
  ],
  negative: [
    "kecewa", "gagal", "tolak", "mahal", "teruk", "tipu", "kroni", "rasuah", "lemah", 
    "benci", "susah", "marah", "rugi", "salah", "janji", "kosong", "bohong", "zalim", 
    "hancur", "lembap", "sombong", "penipu", "krisis", "terabai", "mundur", "bising", 
    "sembang", "sembang kencang", "habuk", "kencing", "sikit", "lembab", "lambat", 
    "susahkan", "beban", "derita", "miskin", "temberang", "korup", "menyeleweng", "fitnah",
    "kotor", "menderita", "menipu", "manipulasi", "menyusahkan", "sengsara", "curi", "pecah amanah"
  ],
  negation: [
    "tak", "tidak", "bukan", "jangan", "never", "no", "tiada", "kurang"
  ]
};

// Simulated issue categories driving social media conversations in Johor
const ELECTION_ISSUES = [
  { name: "Kos Sara Hidup & Inflasi", weight: 0.35, sentiment: { positive: 0.20, negative: 0.65, neutral: 0.15 } },
  { name: "Peluang Kerja & Hubungan Singapura", weight: 0.25, sentiment: { positive: 0.45, negative: 0.35, neutral: 0.20 } },
  { name: "Infrastruktur & Jalan Raya (e.g. FT050)", weight: 0.20, sentiment: { positive: 0.30, negative: 0.55, neutral: 0.15 } },
  { name: "Kestabilan Politik Negeri", weight: 0.20, sentiment: { positive: 0.55, negative: 0.25, neutral: 0.20 } }
];

// Target parties & mapping
const PARTIES = {
  BN: { name: "Barisan Nasional", color: "#000080", secondaryColor: "#1d4ed8", leader: "Onn Hafiz Ghazi" },
  PH: { name: "Pakatan Harapan", color: "#ED1C24", secondaryColor: "#ef4444", leader: "Liew Chin Tong" },
  PN: { name: "Perikatan Nasional", color: "#005E82", secondaryColor: "#06b6d4", leader: "Sahruddin Jamal" },
  OTH: { name: "Lain-lain / Bebas", color: "#71717a", secondaryColor: "#a1a1aa", leader: "N/A" }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REGIONS, JOHOR_SEATS, MALAY_LEXICON, ELECTION_ISSUES, PARTIES };
}
