(function () {
  "use strict";

  const ASSETS = ["us_equity", "intl_equity", "bonds", "reits", "cash"];
  const ASSET_LABELS = {
    us_equity: "US Equity",
    intl_equity: "International Equity",
    bonds: "Bonds",
    reits: "REITs",
    cash: "Cash",
  };
  const ASSET_COLORS = ["#3b82f6", "#0ea5e9", "#496A94", "#7c3aed", "#6b7280"];

  let chart = null;
  let debounceTimer = null;

  const modeSelect = document.getElementById("mode-select");
  const modeCopy = document.getElementById("mode-copy");
  const editorModeHint = document.getElementById("editor-mode-hint");
  const manualTotal = document.getElementById("manual-total");

  const profileInputs = {
    risk: document.getElementById("risk-slider"),
    horizon: document.getElementById("horizon-slider"),
    liquidity_need: document.getElementById("liquidity-slider"),
    drawdown_tolerance: document.getElementById("drawdown-slider"),
  };

  const profileValueLabels = {
    risk: document.getElementById("risk-value"),
    horizon: document.getElementById("horizon-value"),
    liquidity_need: document.getElementById("liquidity-value"),
    drawdown_tolerance: document.getElementById("drawdown-value"),
  };

  const tacticalInputs = {
    tactical_intensity: document.getElementById("tactical-slider"),
    macro_growth: document.getElementById("growth-slider"),
    macro_rates: document.getElementById("rates-slider"),
    macro_inflation: document.getElementById("inflation-slider"),
    macro_volatility: document.getElementById("volatility-slider"),
  };

  const tacticalValueLabels = {
    tactical_intensity: document.getElementById("tactical-value"),
    macro_growth: document.getElementById("growth-value"),
    macro_rates: document.getElementById("rates-value"),
    macro_inflation: document.getElementById("inflation-value"),
    macro_volatility: document.getElementById("volatility-value"),
  };

  const manualInputs = {
    us_equity: document.getElementById("manual-us_equity"),
    intl_equity: document.getElementById("manual-intl_equity"),
    bonds: document.getElementById("manual-bonds"),
    reits: document.getElementById("manual-reits"),
    cash: document.getElementById("manual-cash"),
  };

  const outputFields = {
    us_equity: document.getElementById("us_equity-pct"),
    intl_equity: document.getElementById("intl_equity-pct"),
    bonds: document.getElementById("bonds-pct"),
    reits: document.getElementById("reits-pct"),
    cash: document.getElementById("cash-pct"),
  };

  const inferredProfileNode = document.getElementById("inferred-profile");
  const fitScoreNode = document.getElementById("fit-score");
  const constraintCountNode = document.getElementById("constraint-count");
  const explanationsNode = document.getElementById("explanations");

  function round(value) {
    return Math.round(value * 10) / 10;
  }

  function getMode() {
    return modeSelect.value;
  }

  function initChart() {
    const ctx = document.getElementById("allocationChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ASSETS.map(function (key) {
          return ASSET_LABELS[key];
        }),
        datasets: [
          {
            data: [20, 20, 20, 20, 20],
            backgroundColor: ASSET_COLORS,
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#161b22",
            titleColor: "#e6edf3",
            bodyColor: "#e6edf3",
            borderColor: "#21262d",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (ctx) {
                return " " + ctx.label + ": " + ctx.parsed.toFixed(1) + "%";
              },
            },
          },
        },
        animation: {
          duration: 400,
          easing: "easeOutQuart",
        },
      },
    });
  }

  function setModeUI() {
    const isManual = getMode() === "manual_override";
    modeCopy.textContent = isManual
      ? "Manual Override is active. Portfolio edits infer profile values."
      : "Profile and tactical settings drive final allocations.";
    editorModeHint.textContent = isManual
      ? "Edit final weights directly. Values are normalized and guardrails apply."
      : "Locked in Inferred Profile mode. Switch to Manual Override to edit directly.";

    ASSETS.forEach(function (asset) {
      manualInputs[asset].disabled = !isManual;
    });
  }

  function updateAllValueLabels() {
    Object.keys(profileInputs).forEach(function (key) {
      profileValueLabels[key].textContent = profileInputs[key].value;
    });
    Object.keys(tacticalInputs).forEach(function (key) {
      tacticalValueLabels[key].textContent = tacticalInputs[key].value;
    });
    updateManualTotal();
  }

  function updateManualTotal() {
    const total = ASSETS.reduce(function (sum, asset) {
      return sum + Number(manualInputs[asset].value || 0);
    }, 0);
    manualTotal.textContent = total.toFixed(1) + "%";
    manualTotal.classList.toggle("invalid", Math.abs(total - 100) > 0.2);
  }

  function buildQuery() {
    const params = new URLSearchParams();
    params.set("mode", getMode());

    Object.keys(profileInputs).forEach(function (key) {
      params.set(key, profileInputs[key].value);
    });
    Object.keys(tacticalInputs).forEach(function (key) {
      params.set(key, tacticalInputs[key].value);
    });

    if (getMode() === "manual_override") {
      ASSETS.forEach(function (asset) {
        params.set("manual_" + asset, manualInputs[asset].value);
      });
    }

    return params.toString();
  }

  function hydrateManualInputsFromFinal(finalWeights) {
    ASSETS.forEach(function (asset) {
      manualInputs[asset].value = round(finalWeights[asset]).toFixed(1);
    });
    updateManualTotal();
  }

  function renderBreakdown(response) {
    ASSETS.forEach(function (asset) {
      const strategic = response.strategic_weights[asset];
      const tactical = response.tactical_overlays[asset];
      const finalWeight = response.final_weights[asset];
      outputFields[asset].textContent =
        strategic.toFixed(1) +
        "% / " +
        (tactical >= 0 ? "+" : "") +
        tactical.toFixed(1) +
        "% / " +
        finalWeight.toFixed(1) +
        "%";
    });
  }

  function renderInferredProfile(response) {
    const inferred = response.inferred_profile;
    inferredProfileNode.textContent =
      "Risk " +
      inferred.risk.toFixed(1) +
      ", Horizon " +
      inferred.horizon.toFixed(1) +
      "y, Liquidity " +
      inferred.liquidity_need.toFixed(1) +
      ", Drawdown " +
      inferred.drawdown_tolerance.toFixed(1);
    fitScoreNode.textContent = inferred.fit_score.toFixed(2) + " / 100";
    constraintCountNode.textContent = String(response.constraint_events.length);
  }

  function renderExplanations(response) {
    explanationsNode.innerHTML = "";
    response.explanations.forEach(function (line) {
      const li = document.createElement("li");
      li.textContent = line;
      explanationsNode.appendChild(li);
    });
  }

  function updateUI(data) {
    chart.data.datasets[0].data = ASSETS.map(function (asset) {
      return data.final_weights[asset];
    });
    chart.update();

    renderBreakdown(data);
    renderInferredProfile(data);
    renderExplanations(data);
    hydrateManualInputsFromFinal(data.final_weights);
  }

  function fetchAllocation() {
    updateAllValueLabels();
    fetch("/api?" + buildQuery())
      .then(function (res) {
        if (!res.ok) throw new Error("API error " + res.status);
        return res.json();
      })
      .then(updateUI)
      .catch(function (err) {
        console.error("Unable to reach the advisor.", err);
      });
  }

  function queueFetch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchAllocation, 150);
  }

  Object.keys(profileInputs).forEach(function (key) {
    profileInputs[key].addEventListener("input", queueFetch);
  });

  Object.keys(tacticalInputs).forEach(function (key) {
    tacticalInputs[key].addEventListener("input", queueFetch);
  });

  ASSETS.forEach(function (asset) {
    manualInputs[asset].addEventListener("input", function () {
      updateManualTotal();
      if (getMode() === "manual_override") {
        queueFetch();
      }
    });
  });

  modeSelect.addEventListener("change", function () {
    setModeUI();
    queueFetch();
  });

  initChart();
  setModeUI();
  fetchAllocation();
})();
