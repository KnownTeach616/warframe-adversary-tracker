const weaponInput = document.getElementById('weaponInput');
const weaponList = document.getElementById('weaponList');

function loadWeapons() {
  const saved = JSON.parse(localStorage.getItem('weapons')) || [];
  saved.forEach(addWeaponToDOM);
}

function addWeapon() {
  const name = weaponInput.value.trim();
  if (name === '') return;

  const weapon = { name, completed: false };
  const weapons = JSON.parse(localStorage.getItem('weapons')) || [];
  weapons.push(weapon);
  localStorage.setItem('weapons', JSON.stringify(weapons));
  addWeaponToDOM(weapon);

  weaponInput.value = '';
}

function addWeaponToDOM(weapon) {
  const li = document.createElement('li');
  li.textContent = weapon.name;
  li.className = weapon.completed ? 'completed' : '';
  li.addEventListener('click', () => toggleWeapon(weapon.name));
  weaponList.appendChild(li);
}

function toggleWeapon(name) {
  const weapons = JSON.parse(localStorage.getItem('weapons')) || [];
  const updated = weapons.map(w => w.name === name ? { ...w, completed: !w.completed } : w);
  localStorage.setItem('weapons', JSON.stringify(updated));
  weaponList.innerHTML = '';
  updated.forEach(addWeaponToDOM);
}

document.addEventListener('DOMContentLoaded', loadWeapons);
