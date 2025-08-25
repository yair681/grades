document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    const message = document.getElementById('message');

    if (data.success) {
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('username', username);
        if (data.role === 'teacher') {
            window.location.href = '/teacher.html';
        } else if (data.role === 'student') {
            window.location.href = '/student.html';
        }
    } else {
        message.textContent = data.message;
        message.style.color = 'red';
    }
});