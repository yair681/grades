const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = 'grades.json';
const USERS_FILE = 'users.json';

let grades = [];
if (fs.existsSync(DATA_FILE)) {
    grades = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

let users = [];
if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, role: user.role }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'שם משתמש או סיסמה שגויים.' }));
            }
        });
    } else if (pathname === '/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password, role } = JSON.parse(body);
            if (users.find(u => u.username === username)) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'שם משתמש כבר קיים.' }));
                return;
            }
            users.push({ username, password, role });
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
    } else if (pathname === '/add-grade' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            grades.push(data);
            fs.writeFileSync(DATA_FILE, JSON.stringify(grades, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
    } else if (pathname.startsWith('/get-grades') && req.method === 'GET') {
        const studentName = parsedUrl.query.name;
        const studentGrades = grades.filter(g => g.student.toLowerCase() === studentName.toLowerCase());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(studentGrades));
    } else {
        let filePath;
        if (pathname === '/') {
            filePath = path.join(__dirname, 'login.html');
        } else if (pathname === '/teacher.html') {
            filePath = path.join(__dirname, 'teacher.html');
        } else if (pathname === '/student.html') {
            filePath = path.join(__dirname, 'student.html');
        } else if (pathname === '/register.html') {
            filePath = path.join(__dirname, 'register.html');
        } else if (pathname === '/styles.css') {
            filePath = path.join(__dirname, 'styles.css');
        } else if (pathname === '/script-teacher.js') {
            filePath = path.join(__dirname, 'script-teacher.js');
        } else if (pathname === '/script-student.js') {
            filePath = path.join(__dirname, 'script-student.js');
        } else if (pathname === '/script-login.js') {
            filePath = path.join(__dirname, 'script-login.js');
        } else if (pathname === '/script-register.js') {
            filePath = path.join(__dirname, 'script-register.js');
        } else {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }

        const contentType = pathname.endsWith('.css') ? 'text/css' :
                           pathname.endsWith('.js') ? 'application/javascript' :
                           'text/html';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});