// PRN Johor 16: Sentiment & Prediction Dashboard Application Logic

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State & Configuration
  let currentSwingTarget = "BN"; // Default coalition targeted for swing adjustments
  const regionSwings = {}; // Stores swing value for each region (e.g. { "Segamat & Ledang (North)": 0 })

  // Initialize region swings to 0
  Object.values(REGIONS).forEach(region => {
    regionSwings[region] = 0;
  });

  // 2. DOM Elements
  const slidersContainer = document.getElementById("sliders-container");
  const resetSlidersBtn = document.getElementById("reset-sliders-btn");
  
  const valBn = document.getElementById("val-bn");
  const valPh = document.getElementById("val-ph");
  const valPn = document.getElementById("val-pn");
  const valOth = document.getElementById("val-oth");
  
  const barBn = document.getElementById("bar-bn");
  const barPh = document.getElementById("bar-ph");
  const barPn = document.getElementById("bar-pn");
  const barOth = document.getElementById("bar-oth");
  
  const seatSearch = document.getElementById("seat-search");
  const regionFilter = document.getElementById("region-filter");
  const seatsTableBody = document.getElementById("seats-table-body");
  
  const testerInput = document.getElementById("tester-input");
  const btnAnalyze = document.getElementById("btn-analyze");
  const btnClearTester = document.getElementById("btn-clear-tester");
  const testerResult = document.getElementById("tester-result");

  // Initialize Chart Variables
  let sentimentPieChart;
  let issuesBarChart;

  // 3. Inject Swing Target Selectors inside Swing Card
  function initSwingTargetSelector() {
    const selectorHtml = `
      <div style="margin-bottom: 1.25rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Pilih Koalisi Penerima Swing:</span>
        <div style="display: flex; gap: 0.75rem;">
          <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; cursor: pointer;">
            <input type="radio" name="swing-target" value="BN" checked style="accent-color: var(--bn-color);"> BN (Barisan Nasional)
          </label>
          <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; cursor: pointer;">
            <input type="radio" name="swing-target" value="PH" style="accent-color: var(--ph-color);"> PH (Pakatan Harapan)
          </label>
          <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; cursor: pointer;">
            <input type="radio" name="swing-target" value="PN" style="accent-color: var(--pn-color);"> PN (Perikatan Nasional)
          </label>
        </div>
      </div>
    `;
    slidersContainer.insertAdjacentHTML('beforebegin', selectorHtml);

    // Event listener for radio buttons
    document.querySelectorAll('input[name="swing-target"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        currentSwingTarget = e.target.value;
        updateProjection();
      });
    });
  }

  // 4. Generate Regional Sliders Dynamically
  function initSliders() {
    slidersContainer.innerHTML = "";
    Object.entries(REGIONS).forEach(([key, regionName]) => {
      const regionId = `slider-${key.toLowerCase()}`;
      const sliderHtml = `
        <div class="slider-group">
          <div class="slider-info">
            <span class="region-name">${regionName}</span>
            <span class="swing-value" id="${regionId}-val">0%</span>
          </div>
          <div class="slider-wrapper">
            <input type="range" id="${regionId}" min="-20" max="20" value="0" step="1">
          </div>
          <div class="slider-labels">
            <span>-20% (Kemerosotan)</span>
            <span>Neutral</span>
            <span>+20% (Gelombang)</span>
          </div>
        </div>
      `;
      slidersContainer.insertAdjacentHTML("beforeend", sliderHtml);

      // Add slider event listeners
      const sliderInput = document.getElementById(regionId);
      const sliderValSpan = document.getElementById(`${regionId}-val`);
      
      sliderInput.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        regionSwings[regionName] = val;
        
        // Update label styles
        sliderValSpan.innerText = (val > 0 ? "+" : "") + val + "%";
        if (val > 0) {
          sliderValSpan.style.color = "var(--sentiment-pos)";
        } else if (val < 0) {
          sliderValSpan.style.color = "var(--sentiment-neg)";
        } else {
          sliderValSpan.style.color = "var(--text-secondary)";
        }
        
        updateProjection();
      });
    });
  }

  // 5. Populate Region Filter Dropdown
  function initRegionFilter() {
    Object.values(REGIONS).forEach(region => {
      const option = document.createElement("option");
      option.value = region;
      option.innerText = region;
      regionFilter.appendChild(option);
    });

    regionFilter.addEventListener("change", renderSeatsTable);
    seatSearch.addEventListener("input", renderSeatsTable);
  }

  // 6. Perform Calculations & Update UI Predictions
  function updateProjection() {
    const seatCounts = { BN: 0, PH: 0, PN: 0, OTH: 0 };
    const simulatedSeats = JOHOR_SEATS.map(seat => {
      const swingPct = (regionSwings[seat.region] || 0) / 100;
      
      // Calculate adjusted shares
      let newBN = seat.base.BN;
      let newPH = seat.base.PH;
      let newPN = seat.base.PN;
      let newOTH = seat.base.OTH;

      if (swingPct !== 0) {
        if (currentSwingTarget === "BN") {
          newBN = Math.min(1.0, Math.max(0.0, seat.base.BN + swingPct));
          const diff = newBN - seat.base.BN;
          const sumOthers = seat.base.PH + seat.base.PN + seat.base.OTH;
          if (sumOthers > 0) {
            newPH = Math.max(0.0, seat.base.PH - diff * (seat.base.PH / sumOthers));
            newPN = Math.max(0.0, seat.base.PN - diff * (seat.base.PN / sumOthers));
            newOTH = Math.max(0.0, seat.base.OTH - diff * (seat.base.OTH / sumOthers));
          }
        } else if (currentSwingTarget === "PH") {
          newPH = Math.min(1.0, Math.max(0.0, seat.base.PH + swingPct));
          const diff = newPH - seat.base.PH;
          const sumOthers = seat.base.BN + seat.base.PN + seat.base.OTH;
          if (sumOthers > 0) {
            newBN = Math.max(0.0, seat.base.BN - diff * (seat.base.BN / sumOthers));
            newPN = Math.max(0.0, seat.base.PN - diff * (seat.base.PN / sumOthers));
            newOTH = Math.max(0.0, seat.base.OTH - diff * (seat.base.OTH / sumOthers));
          }
        } else if (currentSwingTarget === "PN") {
          newPN = Math.min(1.0, Math.max(0.0, seat.base.PN + swingPct));
          const diff = newPN - seat.base.PN;
          const sumOthers = seat.base.BN + seat.base.PH + seat.base.OTH;
          if (sumOthers > 0) {
            newBN = Math.max(0.0, seat.base.BN - diff * (seat.base.BN / sumOthers));
            newPH = Math.max(0.0, seat.base.PH - diff * (seat.base.PH / sumOthers));
            newOTH = Math.max(0.0, seat.base.OTH - diff * (seat.base.OTH / sumOthers));
          }
        }
      }

      // Determine winner
      let winner = "OTH";
      let maxVal = newOTH;
      if (newBN > maxVal) { winner = "BN"; maxVal = newBN; }
      if (newPH > maxVal) { winner = "PH"; maxVal = newPH; }
      if (newPN > maxVal) { winner = "PN"; maxVal = newPN; }

      seatCounts[winner]++;

      return {
        ...seat,
        adjusted: { BN: newBN, PH: newPH, PN: newPN, OTH: newOTH },
        winner: winner
      };
    });

    // Update Global Seat Stats Cards
    valBn.innerText = seatCounts.BN;
    valPh.innerText = seatCounts.PH;
    valPn.innerText = seatCounts.PN;
    valOth.innerText = seatCounts.OTH;

    // Update Seat Progress Bar
    const total = 56;
    const bnPct = (seatCounts.BN / total) * 100;
    const phPct = (seatCounts.PH / total) * 100;
    const pnPct = (seatCounts.PN / total) * 100;
    const othPct = (seatCounts.OTH / total) * 100;

    barBn.style.width = `${bnPct}%`;
    barBn.innerText = seatCounts.BN >= 4 ? `BN (${seatCounts.BN})` : "";
    barPh.style.width = `${phPct}%`;
    barPh.innerText = seatCounts.PH >= 4 ? `PH (${seatCounts.PH})` : "";
    barPn.style.width = `${pnPct}%`;
    barPn.innerText = seatCounts.PN >= 4 ? `PN (${seatCounts.PN})` : "";
    barOth.style.width = `${othPct}%`;
    barOth.innerText = seatCounts.OTH >= 4 ? `OTH (${seatCounts.OTH})` : "";

    // Highlight MB/Leader status if a coalition hits 29 seats
    updateWinnerHighlighting(seatCounts);

    // Save temporary state globally on window for list renderer to access
    window.lastSimulatedSeats = simulatedSeats;
    renderSeatsTable();
    updateCharts(seatCounts);
  }

  // Highlight MB/Leader details when majority won
  function updateWinnerHighlighting(counts) {
    // BN majority
    if (counts.BN >= 29) {
      document.getElementById("stat-bn").style.borderColor = "var(--sentiment-pos)";
      document.getElementById("sub-bn").innerHTML = "🏆 <strong>Majoriti Mudah! Onn Hafiz MB Johor</strong>";
    } else {
      document.getElementById("stat-bn").style.borderColor = "var(--border-color)";
      document.getElementById("sub-bn").innerText = "Menteri Besar: Datuk Onn Hafiz Ghazi";
    }
    
    // PH majority
    if (counts.PH >= 29) {
      document.getElementById("stat-ph").style.borderColor = "var(--sentiment-pos)";
      document.getElementById("sub-ph").innerHTML = "🏆 <strong>Majoriti Mudah! Liew Chin Tong MB Johor</strong>";
    } else {
      document.getElementById("stat-ph").style.borderColor = "var(--border-color)";
      document.getElementById("sub-ph").innerText = "Ketua Pembangkang: Liew Chin Tong";
    }

    // PN majority
    if (counts.PN >= 29) {
      document.getElementById("stat-pn").style.borderColor = "var(--sentiment-pos)";
      document.getElementById("sub-pn").innerHTML = "🏆 <strong>Majoriti Mudah! Dr Sahruddin MB Johor</strong>";
    } else {
      document.getElementById("stat-pn").style.borderColor = "var(--border-color)";
      document.getElementById("sub-pn").innerText = "Pengerusi Negeri: Datuk Dr. Sahruddin Jamal";
    }
  }

  // 7. Render Seats List Table (with filters & search)
  function renderSeatsTable() {
    const query = seatSearch.value.toLowerCase().trim();
    const region = regionFilter.value;
    const seats = window.lastSimulatedSeats || JOHOR_SEATS;

    seatsTableBody.innerHTML = "";

    seats.forEach(seat => {
      // Apply filters
      const matchesSearch = seat.name.toLowerCase().includes(query) || seat.code.toLowerCase().includes(query) || seat.region.toLowerCase().includes(query);
      const matchesRegion = region === "all" || seat.region === region;

      if (matchesSearch && matchesRegion) {
        const winner = seat.winner || "BN";
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.title = `Baseline: BN(${Math.round(seat.base.BN*100)}%) PH(${Math.round(seat.base.PH*100)}%) PN(${Math.round(seat.base.PN*100)}%)`;
        
        tr.innerHTML = `
          <td><strong>${seat.code}</strong></td>
          <td>${seat.name}</td>
          <td style="color: var(--text-secondary); font-size: 0.75rem;">${seat.region}</td>
          <td><span class="party-badge ${winner}">${winner} (${Math.round((seat.adjusted ? seat.adjusted[winner] : seat.base[winner])*100)}%)</span></td>
        `;
        
        // Add click to check baseline details alert
        tr.addEventListener("click", () => {
          alert(
            `Kawasan DUN: ${seat.code} ${seat.name}\n` +
            `Daerah: ${seat.region}\n` +
            `Jumlah Pengundi: ${seat.voters.toLocaleString()} orang\n\n` +
            `PROJEKSI SEMASA:\n` +
            `• Barisan Nasional (BN): ${Math.round((seat.adjusted ? seat.adjusted.BN : seat.base.BN)*100)}%\n` +
            `• Pakatan Harapan (PH): ${Math.round((seat.adjusted ? seat.adjusted.PH : seat.base.PH)*100)}%\n` +
            `• Perikatan Nasional (PN): ${Math.round((seat.adjusted ? seat.adjusted.PN : seat.base.PN)*100)}%\n` +
            `• Bebas / Lain-lain (OTH): ${Math.round((seat.adjusted ? seat.adjusted.OTH : seat.base.OTH)*100)}%\n\n` +
            `Baseline Sebelum Swing:\n` +
            `BN: ${Math.round(seat.base.BN*100)}% | PH: ${Math.round(seat.base.PH*100)}% | PN: ${Math.round(seat.base.PN*100)}%`
          );
        });

        seatsTableBody.appendChild(tr);
      }
    });
  }

  // 8. Reset Sliders
  resetSlidersBtn.addEventListener("click", () => {
    Object.values(REGIONS).forEach(region => {
      regionSwings[region] = 0;
    });

    document.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.value = 0;
    });

    document.querySelectorAll(".swing-value").forEach(valSpan => {
      valSpan.innerText = "0%";
      valSpan.style.color = "var(--text-secondary)";
    });

    updateProjection();
  });

  // 9. Sentiment Analyzer Logic (Malay NLP Engine)
  function analyzeSentiment(text) {
    if (!text.trim()) return null;

    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, " ");
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);

    let positiveCount = 0;
    let negativeCount = 0;
    let negated = false;
    let negationCounter = 0;
    
    const triggeredPositive = [];
    const triggeredNegative = [];
    const triggeredNegation = [];

    // Analyze token by token
    words.forEach(word => {
      // Check negation window
      if (negated) {
        negationCounter++;
        if (negationCounter > 2) { // Negation window of 2 words
          negated = false;
        }
      }

      // Check if word is a negation word
      if (MALAY_LEXICON.negation.includes(word)) {
        negated = true;
        negationCounter = 0;
        triggeredNegation.push(word);
        return;
      }

      const isPos = MALAY_LEXICON.positive.includes(word);
      const isNeg = MALAY_LEXICON.negative.includes(word);

      if (isPos) {
        if (negated) {
          negativeCount++;
          triggeredNegative.push(`tidak ${word}`);
          negated = false; // reset
        } else {
          positiveCount++;
          triggeredPositive.push(word);
        }
      } else if (isNeg) {
        if (negated) {
          positiveCount++;
          triggeredPositive.push(`tidak ${word}`);
          negated = false; // reset
        } else {
          negativeCount++;
          triggeredNegative.push(word);
        }
      }
    });

    // Party detection
    const bnTerms = ["bn", "barisan", "nasional", "umno", "mca", "mic", "onn hafiz", "onn", "hafiz", "kerajaan negeri"];
    const phTerms = ["ph", "pakatan", "harapan", "dap", "pkr", "amanah", "liew chin tong", "chin tong", "anwar", "merah"];
    const pnTerms = ["pn", "perikatan", "nasional", "pas", "bersatu", "gerakan", "sahruddin", "gelombang hijau"];

    let bnMentions = 0;
    let phMentions = 0;
    let pnMentions = 0;

    // Direct multi-word check in original text
    const lowerText = text.toLowerCase();
    bnTerms.forEach(t => { if (lowerText.includes(t)) bnMentions++; });
    phTerms.forEach(t => { if (lowerText.includes(t)) phMentions++; });
    pnTerms.forEach(t => { if (lowerText.includes(t)) pnMentions++; });

    let primaryParty = "N/A";
    let maxMentions = 0;
    if (bnMentions > maxMentions) { primaryParty = "BN"; maxMentions = bnMentions; }
    if (phMentions > maxMentions) { primaryParty = "PH"; maxMentions = phMentions; }
    if (pnMentions > maxMentions) { primaryParty = "PN"; maxMentions = pnMentions; }

    // Final sentiment classification
    let sentiment = "neutral";
    if (positiveCount > negativeCount) sentiment = "positive";
    else if (negativeCount > positiveCount) sentiment = "negative";

    return {
      sentiment,
      positiveCount,
      negativeCount,
      partyLeaning: primaryParty,
      details: {
        positive: [...new Set(triggeredPositive)],
        negative: [...new Set(triggeredNegative)],
        negation: [...new Set(triggeredNegation)]
      }
    };
  }

  // 10. Live Tester Interface Events
  btnAnalyze.addEventListener("click", () => {
    const text = testerInput.value;
    const result = analyzeSentiment(text);

    if (!result) {
      testerResult.innerHTML = `
        <div class="result-content">
          <span style="color: var(--text-muted); font-size: 0.85rem;">Sila masukkan komen media sosial terlebih dahulu.</span>
        </div>
      `;
      return;
    }

    // Dynamic UI display
    let sentimentLabel = "Neutral / Sederhana";
    let pillClass = "neutral";
    if (result.sentiment === "positive") {
      sentimentLabel = "Sentimen Positif";
      pillClass = "positive";
    } else if (result.sentiment === "negative") {
      sentimentLabel = "Sentimen Negatif";
      pillClass = "negative";
    }

    const partyBadge = result.partyLeaning !== "N/A" 
      ? `<span class="party-badge ${result.partyLeaning}" style="margin-left: 0.5rem; vertical-align: middle;">Kecenderungan: ${result.partyLeaning}</span>` 
      : "";

    // Show triggered word list
    const posWords = result.details.positive.map(w => `<span class="word-badge" style="color: var(--sentiment-pos);">${w}</span>`).join("");
    const negWords = result.details.negative.map(w => `<span class="word-badge" style="color: var(--sentiment-neg);">${w}</span>`).join("");
    const negations = result.details.negation.map(w => `<span class="word-badge" style="color: var(--text-muted);">${w}</span>`).join("");

    testerResult.innerHTML = `
      <div class="result-content" style="align-items: flex-start; text-align: left;">
        <div>
          <span class="sentiment-pill ${pillClass}">${sentimentLabel}</span>
          ${partyBadge}
        </div>
        <p style="font-size: 0.85rem; margin-top: 0.5rem;">
          Skor Sentimen: <strong style="color: var(--sentiment-pos);">${result.positiveCount} perkataan positif</strong> vs 
          <strong style="color: var(--sentiment-neg);">${result.negativeCount} perkataan negatif</strong>.
        </p>
        <div class="word-list">
          ${posWords ? `<div><strong>Kata Positif:</strong> ${posWords}</div>` : ""}
          ${negWords ? `<div><strong>Kata Negatif:</strong> ${negWords}</div>` : ""}
          ${negations ? `<div><strong>Kata Nafi:</strong> ${negations}</div>` : ""}
          ${!posWords && !negWords && !negations ? `<div><em style="color: var(--text-muted);">Tiada kata sentimen khusus dikesan. Menggunakan klasifikasi asas.</em></div>` : ""}
        </div>
      </div>
    `;

    // Highlight card border based on result
    const borderColors = { positive: "var(--sentiment-pos)", negative: "var(--sentiment-neg)", neutral: "var(--border-color)" };
    testerResult.style.borderColor = borderColors[result.sentiment];
  });

  // Sample pill clicks
  document.querySelectorAll(".sample-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      testerInput.value = pill.getAttribute("data-text");
      btnAnalyze.click();
    });
  });

  btnClearTester.addEventListener("click", () => {
    testerInput.value = "";
    testerResult.innerHTML = `
      <div class="result-content" id="result-placeholder">
        <span style="color: var(--text-muted); font-size: 0.85rem;">Menunggu input untuk dianalisis...</span>
      </div>
    `;
    testerResult.style.borderColor = "var(--border-color)";
  });

  // 11. Initializing Chart.js Graph Visuals
  function initCharts() {
    // Standard Chart.js configuration options for premium dark theme
    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#94a3b8", font: { family: "Inter", size: 10 } }
        }
      }
    };

    // Chart 1: Overall Sentiment Pie Chart
    const ctxPie = document.getElementById("sentiment-pie-chart").getContext("2d");
    sentimentPieChart = new Chart(ctxPie, {
      type: "doughnut",
      data: {
        labels: ["Positif", "Negatif", "Neutral"],
        datasets: [{
          data: [42, 38, 20],
          backgroundColor: ["#10b981", "#f43f5e", "#64748b"],
          borderWidth: 2,
          borderColor: "#1e293b"
        }]
      },
      options: {
        ...chartDefaults,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#94a3b8", boxWidth: 12, padding: 15 }
          }
        }
      }
    });

    // Chart 2: Issues Breakdown Chart
    const ctxBar = document.getElementById("issues-bar-chart").getContext("2d");
    issuesBarChart = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ELECTION_ISSUES.map(issue => issue.name),
        datasets: [
          {
            label: "Positif (%)",
            data: ELECTION_ISSUES.map(issue => Math.round(issue.sentiment.positive * 100)),
            backgroundColor: "#10b981",
          },
          {
            label: "Negatif (%)",
            data: ELECTION_ISSUES.map(issue => Math.round(issue.sentiment.negative * 100)),
            backgroundColor: "#f43f5e",
          }
        ]
      },
      options: {
        ...chartDefaults,
        indexAxis: "y",
        scales: {
          x: {
            stacked: true,
            max: 100,
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#64748b", font: { size: 9 } }
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 9 } }
          }
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#94a3b8", boxWidth: 10, padding: 10 }
          }
        }
      }
    });
  }

  // Dynamically update charts depending on seat prediction
  function updateCharts(seatCounts) {
    if (!sentimentPieChart) return;
    
    // Simulate slight changes in sentiment distribution relative to predictions
    const total = 56;
    const bnRatio = seatCounts.BN / total;
    const phRatio = seatCounts.PH / total;
    const pnRatio = seatCounts.PN / total;

    // Shift pie data dynamically
    const positive = Math.round((bnRatio * 0.5 + phRatio * 0.45 + pnRatio * 0.3) * 100);
    const negative = Math.round(((1 - bnRatio) * 0.4 + (1 - phRatio) * 0.35) * 100);
    const neutral = Math.max(10, 100 - positive - negative);

    sentimentPieChart.data.datasets[0].data = [positive, negative, neutral];
    sentimentPieChart.update();
  }

  // 12. Run Setup
  initSwingTargetSelector();
  initSliders();
  initRegionFilter();
  initCharts();
  updateProjection(); // Run first calculation pass
});
