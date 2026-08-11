const JSON_URL = "p.json";

// Optional tag filter, set via <script src="p.js" data-tag="mouse"></script>.
// Leave the attribute off to show every item.
const TAG_FILTER = document.currentScript?.dataset.tag ?? null;

// Optional "In use" filter, set via <script src="p.js" data-inuse="true"></script>.
// When present, only items whose "In use" field is "true" are shown.
const INUSE_FILTER = document.currentScript?.dataset.inuse === "true";

function renderList(items) {
  const listEl = document.getElementById("list");
  if (!listEl) return;

  listEl.innerHTML = "";

  const sorted = [...items].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

  sorted.forEach(item => {
    const row = document.createElement("tr");
    const isInUse = item["In use"] === "true";

    // In use
    const inUseCell = document.createElement("td");
    inUseCell.className = "tc_inuse";
    inUseCell.textContent = isInUse ? "✓" : "";
    row.appendChild(inUseCell);

    // Name (with link out to the product page)
    const nameCell = document.createElement("td");
    nameCell.className = "tc_name";
    const link = document.createElement("a");
    link.href = item.href ?? "#";
    link.textContent = (item.name ?? "(unnamed product)");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    nameCell.appendChild(link);
    row.appendChild(nameCell);

    // Brand
    const brandCell = document.createElement("td");
    brandCell.className = "tc_brand";
    brandCell.textContent = item.brand ?? "";
    row.appendChild(brandCell);

    // Type (the "tag" field)
    const typeCell = document.createElement("td");
    typeCell.className = "tc_type";
    typeCell.textContent = item.tag ?? "";
    row.appendChild(typeCell);

    listEl.appendChild(row);
  });
}

async function loadData() {
  const statusEl = document.getElementById("status"); // optional, may be null

  try {
    const response = await fetch(JSON_URL);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected JSON to be an array");
    }

    let items = data;
    if (TAG_FILTER) {
      items = items.filter(item => item.tag === TAG_FILTER);
    }
    if (INUSE_FILTER) {
      items = items.filter(item => item["In use"] === "true");
    }

    renderList(items);

  } catch (err) {
    if (statusEl) {
      statusEl.textContent = "Failed to load data: " + err.message;
    } else {
      console.error("Failed to load data:", err);
    }
  }
}

loadData();