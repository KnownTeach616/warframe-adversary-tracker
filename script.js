// Define weapon categories
const kuvaWeapons = [
  "Ayanga", "Brakk", "Bramma", "Chakkurr", "Drakgoon", "Grattler", "Hek",
  "Hind", "Karak", "Kohm", "Kraken", "Nukor", "Ogris", "Quartakk",
  "Seer", "Shildeg", "Sobek", "Tonkor", "Twin Stubba", "Zarr"
];

const tenetWeapons = [
  "Arca Plasmor", "Cycron", "Detron", "Diplos", "Envoy", "Flux Rifle", "Glaxion",
  "Plinx", "Spirex", "Tetra", "Agendus", "Exec", "Ferrox", "Grigori", "Livia"
];

const codaWeapons = [
  "Catabolyst", "Dual Torxica", "Hema", "Mire", "Motovore", "Pox", "Sporothrix",
  "Bassocyst", "Caustacyst", "Hirudo", "Pathocyst", "Synapse", "Tysis"
];

// Populate weapon dropdown with the three categories
function populateWeaponDropdown() {
  const weaponSelect = document.getElementById("weaponSelect");

  // Add category headings
  const categories = [
    { name: "Kuva Weapons", weapons: kuvaWeapons },
    { name: "Tenet Weapons", weapons: tenetWeapons },
    { name: "Coda Weapons", weapons: codaWeapons }
  ];

  categories.forEach(category => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = category.name;

    category.weapons.forEach(weapon => {
      const option = document.createElement("option");
      option.value = weapon;
      option.textContent = weapon;
      optgroup.appendChild(option);
    });

    weaponSelect.appendChild(optgroup);
  });
}

// Load saved weapons from localStorage and categorize them
function loadWeapons() {
  const saved = JSON.parse(localStorage.getItem("weapons")) || [];
  saved.forEach(addWeaponToDOM);
  updateProgress(saved);
}

// Add new weapon from dropdown
function addWeapon() {
  const weaponSelect = document.getElementById("weaponSelect");
  const name = weaponSelect.value;

  if (!name) return;

  const weapons = JSON.parse(localStorage.getItem("weapons")) || [];

  // Prevent adding duplicates
  if (weapons.some(w => w.name === name)) return;

  const weapon = {
    name,
    completed: false,
    bonus: 25,
    vice: false,
    remarks: ""
  };

  weapons.push(weapon);
  localStorage.setItem("weapons", JSON.stringify(weapons));
  addWeaponToDOM(weapon);
  updateProgress(weapons);
}

// Render weapon entry in appropriate category list
function addWeaponToDOM(weapon) {
  const weaponListId = getWeaponCategoryListId(weapon.name);
  const weaponList = document.getElementById(weaponListId);
  const li = document.createElement("li");

  // Weapon name clickable to toggle "completed" status
  const name = document.createElement("strong");
  name.textContent = weapon.name;
  name.style.cursor = "pointer";
  name.addEventListener("click", () => toggleWeapon(weapon.name));
  if (weapon.completed) name.classList.add("completed");

  // Weapon bonus dropdown (25–60%)
  const bonusInput = document.createElement("select");
  for (let i = 25; i <= 60; i += 5) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${i}%`;
    if (weapon.bonus === i) option.selected = true;
    bonusInput.appendChild(option);
  }
  bonusInput.addEventListener("change", () =>
    updateField(weapon.name, "bonus", parseInt(bonusInput.value))
  );

  // Vice checkbox
  const viceInput = document.createElement("input");
  viceInput.type = "checkbox";
  viceInput.checked = weapon.vice;
  viceInput.addEventListener("change", () =>
    updateField(weapon.name, "vice", viceInput.checked)
  );

  // Remarks input
  const remarksInput = document.createElement("input");
  remarksInput.type = "text";
  remarksInput.placeholder = "Remarks...";
  remarksInput.value = weapon.remarks;
  remarksInput.addEventListener("input", () =>
    updateField(weapon.name, "remarks", remarksInput.value)
  );

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => deleteWeapon(weapon.name));

  li.append(name, bonusInput, viceInput, remarksInput, deleteBtn);
  weaponList.appendChild(li);
}

// Get the category of the weapon and return its corresponding list ID
function getWeaponCategoryListId(weaponName) {
  if (kuvaWeapons.includes(weaponName)) return "kuvaWeaponList";
  if (tenetWeapons.includes(weaponName)) return "tenetWeaponList";
  return "codaWeaponList";
}

// Update weapon field (bonus, vice, remarks)
function updateField(name, field, value) {
  let weapons = JSON.parse(localStorage.getItem("weapons")) || [];
  weapons = weapons.map(w =>
    w.name === name ? { ...w, [field]: value } : w
  );
  localStorage.setItem("weapons", JSON.stringify(weapons));
  updateProgress(weapons);
}

// Toggle completed status
function toggleWeapon(name) {
  let weapons = JSON.parse(localStorage.getItem("weapons")) || [];
  weapons = weapons.map(w =>
    w.name === name ? { ...w, completed: !w.completed } : w
  );
  localStorage.setItem("weapons", JSON.stringify(weapons));
  refreshList(weapons);
}

// Delete weapon entry
function deleteWeapon(name) {
  let weapons = JSON.parse(localStorage.getItem("weapons")) || [];
  weapons = weapons.filter(w => w.name !== name);
  localStorage.setItem("weapons", JSON.stringify(weapons));
  refreshList(weapons);
}

// Clear and re-render all weapon entries
function refreshList(weapons) {
  const allWeaponLists = ["kuvaWeaponList", "tenetWeaponList", "codaWeaponList"];
  allWeaponLists.forEach(listId => {
    document.getElementById(listId).innerHTML = "";
  });
  weapons.forEach(addWeaponToDOM);
  updateProgress(weapons);
}

// Update progress stats (total weapons, max bonus, installed vice)
function updateProgress(weapons) {
  const total = 20; // Hard-coded weapon total
  const collected = weapons.length;
  const maxPercent = weapons.filter(w => w.bonus === 60).length;
  const withVice = weapons.filter(w => w.vice).length;

  document.getElementById("progressStatus").innerHTML = `
    <p>Weapons Collected: ${collected}/${total}</p>
    <p>Max Percent: ${maxPercent}/${total}</p>
    <p>Installed Vice: ${withVice}/${total}</p>
  `;
}

// Initialize everything when page is loaded
document.addEventListener("DOMContentLoaded", () => {
  populateWeaponDropdown();
  loadWeapons();
});
