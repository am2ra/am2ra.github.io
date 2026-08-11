const JSON_URL = "data.json";

const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modalTitle");
const modalTable = document.getElementById("modalTable");
const closeBtn = document.getElementById("closeBtn");

function openModal(item) {
  modalTitle.textContent = item.name ?? "Details";
  modalTable.innerHTML = "";

  Object.entries(item).forEach(([key, value]) => {
    if (key === "name" || key === "dateAdded") return;
    const row = document.createElement("tr");

    const keyCell = document.createElement("td");
    keyCell.className = "key";
    keyCell.textContent = key;

    const valCell = document.createElement("td");
    valCell.className = "value";
    valCell.textContent = typeof value === "object" ? JSON.stringify(value) : value;

    row.appendChild(keyCell);
    row.appendChild(valCell);
    modalTable.appendChild(row);
  });

  overlay.classList.add("open");
}

function closeModal() {
  overlay.classList.remove("open");
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

async function loadData() {
  const statusEl = document.getElementById("status"); // optional, may be null
  const listEl = document.getElementById("list");

  try {
    const response = await fetch(JSON_URL);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected JSON to be an array");
    }

    // Sort by dateAdded, newest first. Items without a valid date sink to the bottom.
    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.dateAdded);
      const dateB = new Date(b.dateAdded);
      const validA = !isNaN(dateA);
      const validB = !isNaN(dateB);
      if (!validA && !validB) return 0;
      if (!validA) return 1;
      if (!validB) return -1;
      return dateB - dateA;
    });

    const MAX_RESULTS = 6;
    const visible = sorted.slice(0, MAX_RESULTS);

    if (statusEl) {
      statusEl.textContent = `Showing ${visible.length} of ${data.length} item(s). Click an item for details.`;
    }

    visible.forEach(item => {
      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = item.name ?? JSON.stringify(item);
      li.appendChild(nameSpan);

      if (item.dateAdded) {
        const dateSpan = document.createElement("span");
        dateSpan.className = "date";
        dateSpan.textContent = item.dateAdded;
        li.appendChild(dateSpan);
      }

      li.addEventListener("click", () => openModal(item));
      listEl.appendChild(li);
    });

  } catch (err) {
    if (statusEl) {
      statusEl.textContent = "Failed to load data: " + err.message;
    } else {
      console.error("Failed to load data:", err);
    }
  }
}

loadData();