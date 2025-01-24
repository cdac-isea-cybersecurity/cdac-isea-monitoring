// Proxy URL (use a public proxy or host your own)
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

// Timeout for fetch requests (in milliseconds)
const FETCH_TIMEOUT = 30000; // 10 seconds

// List of websites to monitor
const websites = [
  { name: "isea.gov.in", url: "https://isea.gov.in" },
  { name: "infosecawareness.in", url: "https://infosecawareness.in" },
  { name: "isea.app", url: "https://isea.app" },
  { name: "ivp.isea.app", url: "https://ivp.isea.app" },
  { name: "staysafeonline.in", url: "https://staysafeonline.in" },
];

// Ping history data
const pingHistory = [];
const pingLog = [];

// Chart instance
let pingChart;

// Uptime score
let uptimeScore = 100; // Start with 100% uptime

// Initialize the chart
function initializeChart() {
  const ctx = document.getElementById("pingChart").getContext("2d");
  pingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: websites.map((website) => ({
        label: website.name,
        data: [],
        borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: "Time" } },
        y: { display: true, title: { display: true, text: "Ping (ms)" } },
      },
    },
  });
}

// Update the chart with new data
function updateChart() {
  pingChart.data.labels.push(new Date().toLocaleTimeString());
  websites.forEach((website, index) => {
    const lastPing = pingHistory.filter((ping) => ping.name === website.name).slice(-1)[0];
    pingChart.data.datasets[index].data.push(lastPing ? lastPing.ping : null);
  });
  pingChart.update();
}

// Add a log entry to the ping log
function addLogEntry(website, ping, status) {
  const logEntry = `${new Date().toLocaleTimeString()} - ${website.name}: ${status} (${ping}ms)`;
  pingLog.push(logEntry);
  const logElement = document.createElement("div");
  logElement.textContent = logEntry;
  document.getElementById("ping-log").appendChild(logElement);
}

// Update the uptime score
function updateUptimeScore() {
  const totalPings = pingHistory.length;
  const failedPings = pingHistory.filter((ping) => !ping.isWorking).length;
  uptimeScore = Math.round(((totalPings - failedPings) / totalPings) * 100);
  document.getElementById("uptime-score").textContent = `${uptimeScore}%`;
}

// Ping a website and return its status
async function pingWebsite(website) {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(`${PROXY_URL}${website.url}`, {
      method: "GET", // Use GET for better compatibility
      mode: "cors",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const endTime = Date.now();
    const ping = endTime - startTime;

    // Validate response status
    if (response.ok) {
      const speed = ping < 500 ? "Fast" : ping < 1000 ? "Moderate" : "Slow";
      return { isWorking: true, ping, speed };
    } else {
      return { isWorking: false, ping: null, speed: null };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    return { isWorking: false, ping: null, speed: null };
  }
}

// Update the UI with website status
function updateUI(website, status, ping, speed) {
  const cardId = `card-${website.name.replace(/\./g, "-")}`; // Create a unique ID for each card
  let card = document.getElementById(cardId);

  if (!card) {
    // Create a new card if it doesn't exist
    card = document.createElement("div");
    card.id = cardId;
    card.className = "card";
    document.getElementById("website-list").appendChild(card);
  }

  // Update the card content
  card.innerHTML = `
    <div class="name">${website.name}</div>
    <div class="loading">${status === null ? "Testing..." : ""}</div>
    <div class="speed">${speed ? `Speed: ${speed}` : ""}</div>
    <div class="ping">${ping ? `Ping: ${ping}ms` : ""}</div>
    <div class="status ${status ? (speed === "Slow" ? "slow" : "working") : "not-working"}"></div>
  `;
}

// Clear the list before updating
function clearList() {
  const list = document.getElementById("website-list");
  list.innerHTML = ""; // Clear the list
}

// Monitor websites and update UI
async function monitorWebsites() {
  clearList(); // Clear the list before updating
  for (const website of websites) {
    updateUI(website, null, null, null); // Show loading state
    const { isWorking, ping, speed } = await pingWebsite(website);
    updateUI(website, isWorking, ping, speed);

    // Add to ping history
    pingHistory.push({ name: website.name, ping, isWorking });
    addLogEntry(website, ping, isWorking ? "Working" : "Not Working");

    // Update uptime score
    updateUptimeScore();
  }

  // Update the chart
  updateChart();
}

// Check a custom website
async function checkCustomWebsite() {
  const url = document.getElementById("custom-url").value;
  if (!url) {
    alert("Please enter a valid URL.");
    return;
  }

  const customResult = document.getElementById("custom-result");
  customResult.innerHTML = "Testing...";

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(`${PROXY_URL}${url}`, {
      method: "GET",
      mode: "cors",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const endTime = Date.now();
    const ping = endTime - startTime;

    // Validate response status
    if (response.ok) {
      const speed = ping < 500 ? "Fast" : ping < 1000 ? "Moderate" : "Slow";
      customResult.innerHTML = `
        <strong>Status:</strong> Working 🟢<br>
        <strong>Speed:</strong> ${speed}<br>
        <strong>Ping:</strong> ${ping}ms
      `;
    } else {
      customResult.innerHTML = `
        <strong>Status:</strong> Not Working 🔴<br>
        <strong>Error:</strong> Invalid response (Status: ${response.status})
      `;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    customResult.innerHTML = `
      <strong>Status:</strong> Not Working 🔴<br>
      <strong>Error:</strong> ${error.message || "Request timed out or failed"}
    `;
  }
}

// Export data as CSV
function exportData() {
  const csvContent = "data:text/csv;charset=utf-8," +
    "Name,Ping (ms),Status\n" +
    pingHistory.map((ping) => `${ping.name},${ping.ping || "N/A"},${ping.isWorking ? "Working" : "Not Working"}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ping_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Initialize the app
function initializeApp() {
  initializeChart();
  monitorWebsites();
  setInterval(monitorWebsites, 5 * 60 * 1000); // Refresh every 5 minutes
}

// Start the app
initializeApp();
