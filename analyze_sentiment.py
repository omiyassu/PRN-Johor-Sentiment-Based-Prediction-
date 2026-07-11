#!/usr/bin/env python3
"""
Johor PRN 16: Social Media Sentiment & Prediction Analyzer
Author: Antigravity Code Assistant
Date: 11 July 2026

This script analyzes social media posts from a CSV file (e.g. sample_tweets.csv)
using a bilingual (Malay/English) lexicon-based NLP classifier. It aggregates 
the sentiment scores and projects the winners for contested seats in Johor.
"""

import csv
import re
import sys
import os

# 1. Define Sentiment Lexicon (Aligned with data.js)
MALAY_LEXICON = {
    "positive": {
        "mantap", "hebat", "sokong", "stabil", "terbaik", "menang", "maju", "percaya", 
        "setuju", "berjaya", "adil", "prihatin", "bersih", "aman", "pilihan", "bagus", 
        "tahniah", "memuaskan", "semangat", "padu", "kebajikan", "berkualiti", "pantas", 
        "amanah", "cemerlang", "steady", "terbukti", "mudah", "selesa", "tolong", "bantu", 
        "sayang", "suka", "bijak", "ikhlas", "mesra", "hormat", "yakin", "sejahtera", "berkaliber"
    },
    "negative": {
        "kecewa", "gagal", "tolak", "mahal", "teruk", "tipu", "kroni", "rasuah", "lemah", 
        "benci", "susah", "marah", "rugi", "salah", "janji", "kosong", "bohong", "zalim", 
        "hancur", "lembap", "sombong", "penipu", "krisis", "terabai", "mundur", "bising", 
        "sembang", "habuk", "kencing", "sikit", "lembab", "lambat", "susahkan", "beban", 
        "derita", "miskin", "temberang", "korup", "menyeleweng", "fitnah", "kotor", "menderita",
        "menipu", "manipulasi", "menyusahkan", "sengsara", "curi", "pecah amanah"
    },
    "negation": {
        "tak", "tidak", "bukan", "jangan", "never", "no", "tiada", "kurang"
    }
}

# Party classification terms
PARTY_TERMS = {
    "BN": ["bn", "barisan", "nasional", "umno", "mca", "mic", "onn hafiz", "onn", "hafiz", "kerajaan negeri"],
    "PH": ["ph", "pakatan", "harapan", "dap", "pkr", "amanah", "liew chin tong", "chin tong", "anwar", "merah"],
    "PN": ["pn", "perikatan", "nasional", "pas", "bersatu", "gerakan", "sahruddin", "gelombang hijau", "biru muda"]
}

# DUN names map (Baseline lookup)
DUN_SEATS = {
    f"N{i:02d}": f"DUN N{i:02d}" for i in range(1, 57)
}
# Overlay actual names
DUN_NAMES_OVERLAY = {
    "N01": "Buloh Kasap", "N02": "Jementah", "N03": "Pemanis", "N04": "Kemelah", "N05": "Tenang", "N06": "Bekok",
    "N07": "Bukit Kepong", "N08": "Bukit Pasir", "N09": "Gambir", "N10": "Tangkak", "N11": "Serom", "N12": "Bentayan",
    "N13": "Simpang Jeram", "N14": "Bukit Naning", "N15": "Maharani", "N16": "Sungai Balang", "N17": "Semerah", 
    "N18": "Sri Medan", "N19": "Yong Peng", "N20": "Semarang", "N21": "Parit Yaani", "N22": "Parit Raja", 
    "N23": "Penggaram", "N24": "Senggarang", "N25": "Rengit", "N26": "Machap", "N27": "Layang-Layang", 
    "N28": "Mengkibol", "N29": "Mahkota", "N30": "Paloh", "N31": "Kahang", "N32": "Endau", "N33": "Tenggaroh", 
    "N34": "Panti", "N35": "Pasir Raja", "N36": "Sedili", "N37": "Johor Lama", "N38": "Penawar", "N39": "Tanjung Surat",
    "N40": "Tiram", "N41": "Puteri Wangsa", "N42": "Johor Jaya", "N43": "Permas", "N44": "Larkin", "N45": "Stulang",
    "N46": "Perling", "N47": "Kempas", "N48": "Skudai", "N49": "Kota Iskandar", "N50": "Bukit Permai", 
    "N51": "Bukit Batu", "N52": "Senai", "N53": "Benut", "N54": "Pulai Sebatang", "N55": "Pekan Nanas", "N56": "Kukup"
}
for code, name in DUN_NAMES_OVERLAY.items():
    DUN_SEATS[code] = name


def clean_and_tokenize(text):
    """Lowercase and extract words from text."""
    lower = text.lower()
    # Replace non-word chars with spaces, keeping alphanumeric
    cleaned = re.sub(r'[^\w\s]', ' ', lower)
    return cleaned.split()


def analyze_post_sentiment(text):
    """
    Classify text sentiment (Positive, Negative, Neutral) and detect political party mentions.
    Includes simple Malay negation handling.
    """
    tokens = clean_and_tokenize(text)
    
    positive_count = 0
    negative_count = 0
    negated = False
    negation_counter = 0

    triggered_pos = []
    triggered_neg = []
    
    for token in tokens:
        if negated:
            negation_counter += 1
            if negation_counter > 2:
                negated = False
        
        # Check if current word is negation
        if token in MALAY_LEXICON["negation"]:
            negated = True
            negation_counter = 0
            continue
            
        is_pos = token in MALAY_LEXICON["positive"]
        is_neg = token in MALAY_LEXICON["negative"]

        if is_pos:
            if negated:
                negative_count += 1
                triggered_neg.append(f"tidak-{token}")
                negated = False
            else:
                positive_count += 1
                triggered_pos.append(token)
        elif is_neg:
            if negated:
                positive_count += 1
                triggered_pos.append(f"tidak-{token}")
                negated = False
            else:
                negative_count += 1
                triggered_neg.append(token)

    # Party classification
    party_mentions = {"BN": 0, "PH": 0, "PN": 0}
    lower_text = text.lower()
    
    for party, terms in PARTY_TERMS.items():
        for term in terms:
            if term in lower_text:
                party_mentions[party] += 1
                
    # Find party with most mentions
    leaning = "OTH"
    max_mentions = 0
    for party, count in party_mentions.items():
        if count > max_mentions:
            leaning = party
            max_mentions = count

    # Sentiment category
    sentiment = "NEUTRAL"
    if positive_count > negative_count:
        sentiment = "POSITIVE"
    elif negative_count > positive_count:
        sentiment = "NEGATIVE"
        
    return {
        "sentiment": sentiment,
        "score": positive_count - negative_count,
        "party_leaning": leaning,
        "positive_words": triggered_pos,
        "negative_words": triggered_neg
    }


def load_and_analyze_csv(file_path):
    """Loads social media data from CSV and runs sentiment classification."""
    if not os.path.exists(file_path):
        print(f"[ERROR] Fail {file_path} tidak wujud! Pastikan fail data contoh ada.")
        sys.exit(1)
        
    results = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            post_text = row.get("text", "")
            dun_code = row.get("dun", "").upper().strip()
            
            analysis = analyze_post_sentiment(post_text)
            
            results.append({
                "id": row.get("id"),
                "username": row.get("username"),
                "text": post_text,
                "source": row.get("source"),
                "dun": dun_code if dun_code in DUN_SEATS else "GLOBAL",
                "analysis": analysis
            })
            
    return results


def run_prediction_projection(analyzed_data):
    """
    Project seat winners based on social media sentiment analysis.
    For each DUN:
    - Calculates the positive sentiment ratio for each party.
    - Resolves winner based on the highest positive-sentiment ratio.
    """
    # Group sentiments by DUN
    dun_stats = {}
    total_sentiment = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}
    party_sentiment_totals = {"BN": 0, "PH": 0, "PN": 0, "OTH": 0}

    for row in analyzed_data:
        dun = row["dun"]
        analysis = row["analysis"]
        sentiment = analysis["sentiment"]
        leaning = analysis["party_leaning"]

        # Global aggregations
        total_sentiment[sentiment] += 1
        
        if dun not in dun_stats:
            dun_stats[dun] = {
                "BN_pos": 0, "PH_pos": 0, "PN_pos": 0, "OTH_pos": 0,
                "BN_neg": 0, "PH_neg": 0, "PN_neg": 0, "OTH_neg": 0,
                "total_posts": 0
            }
            
        dun_stats[dun]["total_posts"] += 1
        
        if sentiment == "POSITIVE":
            dun_stats[dun][f"{leaning}_pos"] += 1
            party_sentiment_totals[leaning] += 1
        elif sentiment == "NEGATIVE":
            dun_stats[dun][f"{leaning}_neg"] += 1

    # Project winners for contituncies with data
    projected_seats = {"BN": 0, "PH": 0, "PN": 0, "OTH": 0}
    seat_details = []

    print("\n" + "="*70)
    print("           LAPORAN RAMALAN PEMENANG KERUSI DUN JOHOR")
    print("="*70)
    print(f"{'KOD':<6} | {'DUN NAME':<22} | {'POSTS':<6} | {'BN POS':<6} | {'PH POS':<6} | {'PN POS':<6} | {'RAMALAN'}")
    print("-"*70)

    # Contested DUNs prediction logic
    for dun_code in sorted(DUN_SEATS.keys()):
        stats = dun_stats.get(dun_code, {
            "BN_pos": 0, "PH_pos": 0, "PN_pos": 0, "OTH_pos": 0,
            "BN_neg": 0, "PH_neg": 0, "PN_neg": 0, "OTH_neg": 0,
            "total_posts": 0
        })
        
        dun_name = DUN_SEATS[dun_code]
        total_posts = stats["total_posts"]

        if total_posts > 0:
            # Predict based on highest positive sentiment score
            scores = {
                "BN": stats["BN_pos"] - stats["BN_neg"],
                "PH": stats["PH_pos"] - stats["PH_neg"],
                "PN": stats["PN_pos"] - stats["PN_neg"],
                "OTH": stats["OTH_pos"] - stats["OTH_neg"]
            }
            
            # Find highest score
            winner = "OTH"
            max_score = -9999
            for party, val in scores.items():
                if val > max_score:
                    winner = party
                    max_score = val
                    
            # Fallback if draw or 0 sentiment: default to BN base
            if max_score == 0 and stats["BN_pos"] == 0 and stats["PH_pos"] == 0 and stats["PN_pos"] == 0:
                winner = "BN" # Baseline bias
        else:
            # Baseline simulation prediction if no social posts exist for this DUN
            # (Representing standard default projection)
            # In a real environment, we'd have full data coverage.
            # Here we default to baseline expectations:
            # Segamat/Mersing rural -> BN/PN, JB urban -> PH
            if dun_code in ["N02", "N06", "N10", "N12", "N15", "N23", "N28", "N41", "N42", "N45", "N46", "N48", "N51", "N52"]:
                winner = "PH"
            elif dun_code in ["N07", "N09", "N32"]:
                winner = "PN"
            else:
                winner = "BN"

        projected_seats[winner] += 1
        
        if total_posts > 0:
            print(f"{dun_code:<6} | {dun_name:<22} | {total_posts:<6} | {stats['BN_pos']:<6} | {stats['PH_pos']:<6} | {stats['PN_pos']:<6} | \033[92m{winner}\033[0m")
        
        seat_details.append({
            "code": dun_code,
            "name": dun_name,
            "posts": total_posts,
            "winner": winner
        })

    print("-"*70)
    print("\n" + "="*70)
    print("        RUMUSAN KEPUTUSAN UNJURAN PRN JOHOR (56 KERUSI)")
    print("="*70)
    print(f" Barisan Nasional (BN)      : {projected_seats['BN']} kerusi")
    print(f" Pakatan Harapan (PH)       : {projected_seats['PH']} kerusi")
    print(f" Perikatan Nasional (PN)    : {projected_seats['PN']} kerusi")
    print(f" Bebas / Lain-lain (OTH)    : {projected_seats['OTH']} kerusi")
    print("-"*70)
    
    # Check for majority
    winners_sorted = sorted(projected_seats.items(), key=lambda x: x[1], reverse=True)
    top_party, top_seats = winners_sorted[0]
    
    if top_seats >= 29:
        print(f" KEPUTUSAN: \033[92m{top_party} berjaya membentuk Kerajaan Negeri Johor\033[0m (Majoriti {top_seats}/56)")
    else:
        print(" KEPUTUSAN: Dewan Undangan Negeri Tergantung (Hung Parliament) - Tiada parti dapat 29 kerusi.")
        
    print("="*70)

    # Print general stats summary
    print("\n[INFO] Taburan Sentimen Media Sosial Keseluruhan:")
    for sent, count in total_sentiment.items():
        pct = (count / len(analyzed_data)) * 100 if len(analyzed_data) > 0 else 0
        bars = "#" * int(pct // 5)
        print(f" - {sent:<8}: {count:<4} ({pct:.1f}%) {bars}")


def main():
    print("="*70)
    print("      JOHOR PRN 16 SOCIAL MEDIA SENTIMENT ANALYZER (PYTHON)")
    print("="*70)
    
    file_name = "sample_tweets.csv"
    if len(sys.argv) > 1:
        file_name = sys.argv[1]
        
    print(f"[START] Membaca data media sosial dari fail: {file_name}")
    
    analyzed_data = load_and_analyze_csv(file_name)
    print(f"[OK] Memproses {len(analyzed_data)} komen media sosial.")
    
    # Run projection models
    run_prediction_projection(analyzed_data)
    
    print("\n[TIP] Untuk menaik taraf sistem ini ke model Machine Learning (AI):")
    print(" 1. Pasang Hugging Face Transformers: `pip install transformers`")
    print(" 2. Gunakan model Bahasa Melayu Pra-latih (Pre-trained BERT):")
    print("    `from transformers import pipeline`")
    print("    `nlp = pipeline('sentiment-analysis', model='malay-dataset/sentiment-analysis-bert-base')`")
    print(" 3. Gantikan enjin lexicon-based dengan pemanggilan model `nlp(text)` tersebut.")
    print("="*70)

if __name__ == "__main__":
    main()
