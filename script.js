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

function populateWeaponDropdown() {
  const weaponSelect = document.getElementById("weaponSelect");
  const allWeapons = [...kuvaWeapons, ...tenetWeapons, ...codaWeapons];
  allWeapons.forEach(weapon => {
    const option = document.createElement("option");
    option.value = weapon;
    option.textContent = weapon;
    weaponSelect.appendChild(option);
  });
}

function loadWeapons() {
  const saved = JSON.parse(localStorage.getItem("weapons")) || [];
  saved.forEach(addWeaponToDOM);
  updateProgress(saved);
}

function addWeapon() {
  const weaponSelect = document.getElementById("weaponSelect");
  const name = weaponSelect.value;

  if (!name) return;

  const weapons = JSON.parse(localStorage.getItem("weapons")) || [];
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

function addWeaponToDOM(weapon) {
  const li = document.createElement("li");

  const name = document.createElement("strong");
  name.textContent = weapon.name;
  name.style.cursor = "pointer";
  name.addEventListener("click", () => toggleWeapon(weapon.name));
  if (weapon.completed) name.classList.add("completed");

  // Bonus % selector
  const bonusInput = document.createElement("select");
  for (let i = 25; i <= 60; i += 5) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i + "%";
    if (weapon.bonus === i) option.selected = true;
    bonusInput.appendChild(option);
  }
  bonusInput.addEventListener("change", () => updateField(weapon.name, "bonus", parseInt(bonusInput.value)));

  // Vice checkbox
  const viceInput = document.createElement("input");
  viceInput.type = "checkbox";
  viceInput.checked = weapon.vice;
  viceInput.addEventListener("change", () => updateField(weapon.name, "vice", viceInput.checked));

  // Remarks
  const remarksInput = document.createElement("input");
  remarksInput.type = "text";
  remarksInput.placeholder = "Remarks...";
  remarksInput.value = weapon.remarks;
  remarksInput.addEventListener("input", () => updateField(weapon.name, "remarks", remarksInput.value));

  // Delete
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => deleteWeapon(weapon.name));

  li.append(name, bonusInput, viceInput, remarksInput, deleteBtn);
  document.getElementById("weaponList").appendChild(li);
}

function toggleWeapon(name) {
  let weapons = JSON.parse(localStorage.getItem("weapons")) || [];
  weapons = weapons.map(w => w.name === name ? { ...w, completed: !w.completed } : w);
  localStorage.setItem("weapons", JSON.stringify(weapons));
  refreshList(weapons);
}

function updateField(name, field, value) {
  let weapons = JSON.parse(localStorage.getItem("weapons")) || [];
  weapons = weapons.map(w => w.name === name ? { ...w, [field]: value } : w);
  localStorage.setItem("weapons", JSON.stringify(weapons));
  updateProgress(weapons);
}

function deleteWeapon(name) {
  let weapons = JSON.parse(localStorage.getItem("weapons")) || [];
  weapons = weapons.filter(w => w.name !== name);
  localStorage.setItem("weapons", JSON.stringify(weapons));
  refreshList(weapons);
}

function refreshList(weapons) {
  const list = document.getElementById("weaponList");
  list.innerHTML = "";
  weapons.forEach(addWeaponToDOM);
  updateProgress(weapons);
}

function updateProgress(weapons) {
  const total = 20;
  const collected = weapons.length;
  const maxPercent = weapons.filter(w => w.bonus === 60).length;
  const withVice = weapons.filter(w => w.vice).length;

  document.getElementById("progressStatus").innerHTML = `
    <p>Weapons Collected: ${collected}/${total}</p>
    <p>Max Percent: ${maxPercent}/${total}</p>
    <p>Installed Vice: ${withVice}/${total}</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  populateWeaponDropdown();
  loadWeapons();
});
