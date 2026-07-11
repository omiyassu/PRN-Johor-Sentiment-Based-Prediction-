# PRN Johor 16: Social Media Sentiment & Prediction Dashboard

Sistem ramalan politik dan analisis sentimen media sosial bilingual (Bahasa Melayu / English) bagi **Pilihan Raya Negeri (PRN) Johor ke-16** (11 Julai 2026). Projek ini merangkumi papan pemuka interaktif (Web Dashboard) dan skrip analisis data Python.

---

## Struktur Fail Projek

- **`index.html`**: Halaman utama dashboard visual (Single Page Application).
- **`style.css`**: Reka bentuk premium bertemakan *dark mode* dengan glassmorphic UI.
- **`data.js`**: Fail pangkalan data bagi 56 DUN Johor, statistik baseline, isu pilihan raya, dan leksikon sentimen Bahasa Melayu.
- **`app.js`**: Logik interaktif dashboard web, simulasi swing politik daerah, enjin NLP Bahasa Melayu di pelayar web, dan penjanaan carta Chart.js.
- **`analyze_sentiment.py`**: Skrip sains data Python untuk menganalisis data CSV secara pukal dan mengeluarkan ramalan pemenang kerusi DUN Johor di terminal.
- **`sample_tweets.csv`**: Set data komen media sosial contoh yang mengandungi komen politik sebenar/simulasi dalam Bahasa Melayu.

---

## Cara Menjalankan Projek

### 1. Dashboard Web Interaktif (Frontend)
Tidak memerlukan pelayan (*web server*) atau pemasangan modul pihak ketiga.
1. Buka fail **[`index.html`](file:///C:/Users/User/.gemini/antigravity/scratch/johor_election_sentiment/index.html)** terus menggunakan mana-mana pelayar web moden (Google Chrome, Microsoft Edge, Safari, dll.).
2. **Ciri-ciri Utama**:
   - **Interactive Seat Simulator**: Pilih koalisi sasaran (BN / PH / PN) dan seret gelongsor (slider) daerah untuk mensimulasikan gelombang sokongan pengundi atas pagar di daerah tersebut. Perhatikan unjuran kerusi DUN berubah secara langsung.
   - **Live Sentiment Tester**: Taip sebarang ayat dalam Bahasa Melayu/Rojak, atau klik sampel pil teks sedia ada untuk melihat bagaimana enjin mengelas sentimen dan kecenderungan parti komen tersebut.
   - **Visualisasi Chart.js**: Graf taburan sentimen keseluruhan dan pecahan sentimen berasaskan isu utama pilihan raya dikemas kini secara dinamik.
   - **Carian DUN**: Senarai lengkap 56 DUN boleh dicari mengikut nama atau ditapis mengikut zon daerah. Klik pada baris meja untuk melihat data populasi pemilih dan pecahan baseline peratusan kerusi.

### 2. Skrip Analisis Sentimen (Python Backend)
Skrip ini ditulis menggunakan pustaka standard Python (tiada kebergantungan luar diperlukan secara mandatori).
1. Pastikan anda mempunyai **Python 3.x** terpasang.
2. Buka terminal (PowerShell / Command Prompt) dan navigasi ke folder projek.
3. Jalankan arahan:
   ```bash
   python analyze_sentiment.py
   ```
4. Output terminal akan memaparkan keputusan analisis sentimen setiap DUN, statistik visual, dan ramalan parti mana yang berjaya membentuk kerajaan negeri (melebihi 29 kerusi).
5. Anda juga boleh memproses fail CSV tersuai dengan format yang sama:
   ```bash
   python analyze_sentiment.py nama_fail_anda.csv
   ```

---

## Naik Taraf ke Model Machine Learning (BERT / Hugging Face)

Enjin lalai menggunakan pendekatan leksikon (*lexicon-based*) dengan pengendalian kata nafi (*negation handling*) untuk prestasi pantas dan ringan. Sekiranya anda mahu ketepatan yang lebih tinggi (mengendalikan sarkasme, konteks ayat, dan dialek Johor dengan lebih baik), anda boleh menaik taraf kepada model AI:

1. Pasang pustaka Hugging Face:
   ```bash
   pip install transformers pandas torch
   ```
2. Rujuk kod dalam skrip `analyze_sentiment.py` untuk mengintegrasikan model BERT Bahasa Melayu seperti `malay-dataset/sentiment-analysis-bert-base` menerusi pipeline Hugging Face.
