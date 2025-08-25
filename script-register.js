document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
    });

    const data = await response.json();
    const message = document.getElementById('message');

    if (data.success) {
        message.textContent = 'משתמש נוצר בהצלחה!';
        message.style.color = 'green';
        document.getElementById('registerForm').reset();
    } else {
        message.textContent = data.message;
        message.style.color = 'red';
    }
});