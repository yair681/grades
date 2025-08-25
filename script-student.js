document.getElementById('viewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const student = localStorage.getItem('username');
    const tableBody = document.querySelector('#gradesTable tbody');
    tableBody.innerHTML = '';

    const response = await fetch(`/get-grades?name=${encodeURIComponent(student)}`);
    const grades = await response.json();

    if (grades.length === 0) {
        document.getElementById('message').textContent = 'אין ציונים זמינים.';
        document.getElementById('message').style.color = 'orange';
    } else {
        grades.forEach(g => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${g.subject}</td><td>${g.grade}</td>`;
            tableBody.appendChild(row);
        });
        document.getElementById('message').textContent = '';
    }
});