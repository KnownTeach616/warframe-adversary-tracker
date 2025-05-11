const weaponSelect = document.getElementById('weaponSelect');
const weaponList = document.getElementById('weaponList');

document.addEventListener('DOMContentLoaded', () => {
  const bonusSelect = document.getElementById('bonusSelect');
  for (let i = 25; i <= 60; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i}%`;
    bonusSelect.appendChild(option);
  }

  loadWeapons();
});

function loadWeapons() {
  const saved = JSON.parse(localStorage.getItem('weapons')) || [];
  saved.forEach(addWeaponToDOM);
}

function addWeapon() {
  const name = weaponSelect.value;
  if (!name) return;

  const weapons = JSON.parse(localStorage.getItem('weapons')) || [];

  if (weapons.some(w => w.name === name)) {
    alert(`${name} is already in your list.`);
    return;
  }

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

  weapons.push(weapon);
  localStorage.setItem('weapons', JSON.stringify(weapons));
  addWeaponToDOM(weapon);

  weaponSelect.selectedIndex = 0;
  document.getElementById('remarksInput').value = '';
  document.getElementById('viceCheckbox').checked = false;
  document.getElementById('bonusSelect').selectedIndex = 0;
}

function addWeaponToDOM(weapon) {
  const li = document.createElement('li');
  li.className = weapon.completed ? 'completed' : '';

  const details = `
    <strong>${weapon.name}</strong> 
    [${weapon.element}, ${weapon.bonus}%, Vice: ${weapon.vice ? 'Yes' : 'No'}]
    ${weapon.remarks ? `<br><em>${weapon.remarks}</em>` : ''}
  `;
  li.innerHTML = details;
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
