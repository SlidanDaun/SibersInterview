let usersData = []; // Data for sorting
let currentSort = { field: null, asc: true }; 

async function loadUsers() {
  const resp = await fetch("/api/users");
  usersData = await resp.json();
  renderTable(usersData);
}

function renderTable(data) {
  const tbody = document.getElementById("user-list");
  tbody.innerHTML = "";

  data.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.first_name || ""}</td>
      <td>${u.last_name || ""}</td>
      <td>${u.birthdate || ""}</td> 
      <td>
        <a href="/user/${u.username}">Подробнее</a> |
        <a href="/add?edit=${u.username}">Редактировать</a> |
        <button onclick="deleteUser('${u.username}')">Удалить</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteUser(username) {
  if (!confirm(`Удалить пользователя ${username}?`)) return;
  await fetch(`/api/users/${username}`, { method: "DELETE" });
  await loadUsers();
}

function sortUsers(field) {
  if (currentSort.field === field) {
    currentSort.asc = !currentSort.asc; // Switching the order
  } else {
    currentSort.field = field;
    currentSort.asc = true;
  }

  usersData.sort((a, b) => {
    let valA = (a[field] || "").toLowerCase();
    let valB = (b[field] || "").toLowerCase();

    if (valA < valB) return currentSort.asc ? -1 : 1;
    if (valA > valB) return currentSort.asc ? 1 : -1;
    return 0;
  });

  renderTable(usersData);
}

if (document.getElementById("user-list")) { // Load data from the start
  loadUsers();
}