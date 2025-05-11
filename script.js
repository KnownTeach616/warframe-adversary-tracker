// Weapon categories
const kuvaWeapons = [
  "Ayanga", "Brakk", "Bramma", "Chakkurr", "Drakgoon", "Grattler", "Hek", "Hind", "Karak", "Kohm",
  "Kraken", "Nukor", "Ogris", "Quartakk", "Seer", "Shildeg", "Sobek", "Tonkor", "Twin Stubba", "Zarr"
];
const tenetWeapons = [
  "Arca Plasmor", "Cycron", "Detron", "Diplos", "Envoy", "Flux Rifle", "Glaxion", "Plinx", "Spirex",
  "Tetra", "Agendus", "Exec", "Ferrox", "Grigori", "Livia"
];
const codaWeapons = [
  "Catabolyst", "Dual Torxica", "Hema", "Mire", "Motovore", "Pox", "Sporothrix", "Bassocyst",
  "Caustacyst", "Hirudo", "Pathocyst", "Synapse", "Tysis"
];

// Initialize selectors
const weaponSelect = document.getElementById("weaponSelect");
const elementSelect = document.getElementById("elementSelect");
const viceCheckbox = document.getElementById("viceCheckbox");
const bonusPercent = document.getElementById("bonusPercent");
const remarksInput = document.getElementById("remarksInput");

// Populate dropdown
[...kuvaWeapons, ...tenetWeapons, ...codaWeapons].forEach(weapon => {
  const option = document.createElement("option");
  option.value = weapon;
  option.textContent = weapon;
  weaponSelect.appendChild(option);
});

// Load weapons from localStorage
function loadWeapons() {
  const stored = JSON.parse(localStorage.getItem("weapons")) || [];
  stored.forEach(addWeaponToTable);
  updateProgress(stored);
}

// Add weapon entry
function addWeapon() {
  const name = weaponSelect.value;
  const element = elementSelect.value;
  const vice = viceCheckbox.checked;
  const bonus = parseInt(bonusPercent.value);
  const remarks = remarksInput.value.trim();

  if (!name || !element || isNaN(bonus)) return;

  const newWeapon = { name, element, vice, bonus, remarks };
  const stored = JSON.parse(localStorage.getItem("weapons")) || [];
  stored.push(newWeapon);
  localStorage.setItem("weapons", JSON.stringify(stored));

  addWeaponToTable(newWeapon);
  updateProgress(stored);

  // Clear form
  weaponSelect.selectedIndex = 0;
  elementSelect.selectedIndex = 0;
  viceCheckbox.checked = false;
  bonusPercent.value = "";
  remarksInput.value = "";
}

// Determine category for the weapon
function getCategoryTable(name) {
  if (kuvaWeapons.includes(name)) return document.querySelector("#kuvaTable tbody");
  if (tenetWeapons.includes(name)) return document.querySelector("#tenetTable tbody");
  if (codaWeapons.includes(name)) return document.querySelector("#codaTable tbody");
  return null;
}

// Render weapon row in the right category
function addWeaponToTable(weapon) {
  const tableBody = getCategoryTable(weapon.name);
  if (!tableBody) return;

  const row = document.createElement("tr");

  // Create editable fields
  row.innerHTML = `
    <td contenteditable="true">${weapon.name}</td>
    <td contenteditable="true">${weapon.element}</td>
    <td><input type="checkbox" ${weapon.vice ? "checked" : ""}></td>
    <td><input type="number" value="${weapon.bonus}" min="25" max="60" style="width: 60px;"></td>
    <td><input type="text" value="${weapon.remarks || ""}" /></td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  const deleteBtn = row.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    row.remove();
    removeWeapon(weapon.name);
  });

  // On any field change, update storage
  const inputs = row.querySelectorAll("td input, td[contenteditable]");
  inputs.forEach(input => {
    input.addEventListener("input", () => updateFromTables());
  });

  tableBody.appendChild(row);
}

// Remove weapon by name
function removeWeapon(name) {
  const stored = JSON.parse(localStorage.getItem("weapons")) || [];
  const updated = stored.filter(w => w.name !== name);
  localStorage.setItem("weapons", JSON.stringify(updated));
  updateProgress(updated);
}

// Reconstruct data from tables and save
function updateFromTables() {
  const allRows = document.querySelectorAll("table tbody tr");
  const data = Array.from(allRows).map(row => {
    const cells = row.querySelectorAll("td");
    return {
      name: cells[0].innerText.trim(),
      element: cells[1].innerText.trim(),
      vice: cells[2].querySelector("input").checked,
      bonus: parseInt(cells[3].querySelector("input").value),
      remarks: cells[4].querySelector("input").value.trim()
    };
  });
  localStorage.setItem("weapons", JSON.stringify(data));
  updateProgress(data);
}

// Update progress stats
function updateProgress(data) {
  const collected = data.length;
  const maxed = data.filter(w => w.bonus === 60).length;
  const withVice = data.filter(w => w.vice).length;

  const progressStatus = document.getElementById("progressStatus");
  progressStatus.innerHTML = `
    <p>Weapons Collected: ${collected}/20</p>
    <p>Max Percent: ${maxed}/20</p>
    <p>Installed Vice: ${withVice}/20</p>
  `;
}

document.addEventListener("DOMContentLoaded", loadWeapons);
