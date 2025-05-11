// Get DOM elements for tracking progress
const collectedCountElem = document.getElementById('collectedCount');
const maxPercentCountElem = document.getElementById('maxPercentCount');
const viceCountElem = document.getElementById('viceCount');

// Load saved weapons and update progress on page load
document.addEventListener('DOMContentLoaded', () => {
  loadWeapons();
  updateProgress();
});

// Load saved weapons from localStorage
function loadWeapons() {
  const saved = JSON.parse(localStorage.getItem('weapons')) || [];
  saved.forEach(addWeaponToDOM);
}

// Add a new weapon to the list and localStorage
function addWeapon() {
  const name = weaponSelect.value;
  if (!name) {
    alert('Please select a weapon!');
    return;
  }

  const weapons = JSON.parse(localStorage.getItem('weapons')) || [];

  // Prevent adding duplicate weapons
  if (weapons.some(w => w.name === name)) {
    alert(`${name} is already in your list.`);
    return;
  }

  // Get details from the form fields
  const element = document.getElementById('elementSelect').value;
  const vice = document.getElementById('viceCheckbox').checked;
  const bonus = parseInt(document.getElementById('bonusSelect').value, 10);
  const remarks = document.getElementById('remarksInput').value.trim();

  const weapon = {
    name,
    completed: false,
    element,
    vice,
    bonus,
    remarks
  };

  // Save to localStorage and update the list
  weapons.push(weapon);
  localStorage.setItem('weapons', JSON.stringify(weapons));
  addWeaponToDOM(weapon);

  // Update the progress display
  updateProgress();

  // Clear the form after adding
  resetForm();
}

// Display the weapon in the list
function addWeaponToDOM(weapon) {
  const li = document.createElement('li');
  li.className = weapon.completed ? 'completed' : '';
  li.id = weapon.name;

  const details = `
    <strong>${weapon.name}</strong> 
    [${weapon.element}, ${weapon.bonus}%, Vice: ${weapon.vice ? 'Yes' : 'No'}]
    ${weapon.remarks ? `<br><em>${weapon.remarks}</em>` : ''}
    <button onclick="editWeapon('${weapon.name}')">Edit</button>
    <button onclick="removeWeapon('${weapon.name}')">Delete</button>
  `;
  li.innerHTML = details;
  li.addEventListener('click', () => toggleWeapon(weapon.name));
  weaponList.appendChild(li);
}

// Update the progress statistics
function updateProgress() {
  const weapons = JSON.parse(localStorage.getItem('weapons')) || [];
  
  // Track total weapons, those with max percent (60%), and those with vice installed
  let collectedCount = 0;
  let maxPercentCount = 0;
  let viceCount = 0;

  weapons.forEach(weapon => {
    collectedCount++;
    if (weapon.bonus === 60) maxPercentCount++;
    if (weapon.vice) viceCount++;
  });

  // Update progress on the page
  collectedCountElem.textContent = collectedCount;
  maxPercentCountElem.textContent = maxPercentCount;
  viceCountElem.textContent = viceCount;
}

// Toggle the completion status of a weapon
function toggleWeapon(name) {
  const weapons = JSON.parse(localStorage.getItem('weapons')) || [];
  const updated = weapons.map(w => w.name === name ? { ...w, completed: !w.completed } : w);
  localStorage.setItem('weapons', JSON.stringify(updated));
  weaponList.innerHTML = '';
  updated.forEach(addWeaponToDOM);

  // Update progress after toggle
  updateProgress();
}

// Remove a weapon from the list
function removeWeapon(name) {
  let weapons = JSON.parse(localStorage.getItem('weapons')) || [];
  weapons = weapons.filter(w => w.name !== name);
  localStorage.setItem('weapons', JSON.stringify(weapons));
  weaponList.innerHTML = '';
  weapons.forEach(addWeaponToDOM);

  // Update progress after removal
  updateProgress();
}

// Edit a weapon's details
function editWeapon(name) {
  let weapons = JSON.parse(localStorage.getItem('weapons')) || [];
  const weapon = weapons.find(w => w.name === name);

  if (weapon) {
    // Pre-fill form fields with weapon's current details
    document.getElementById('weaponSelect').value = weapon.name;
    document.getElementById('elementSelect').value = weapon.element;
    document.getElementById('viceCheckbox').checked = weapon.vice;
    document.getElementById('bonusSelect').value = weapon.bonus;
    document.getElementById('remarksInput').value = weapon.remarks;

    // Remove the weapon before re-adding it
    weapons = weapons.filter(w => w.name !== name);
    localStorage.setItem('weapons', JSON.stringify(weapons));
    weaponList.innerHTML = '';
    weapons.forEach(addWeaponToDOM);
  }
}

// Reset form fields after adding a weapon
function resetForm() {
  weaponSelect.selectedIndex = 0;
  document.getElementById('remarksInput').value = '';
  document.getElementById('viceCheckbox').checked = false;
  document.getElementById('bonusSelect').selectedIndex = 0;
}
