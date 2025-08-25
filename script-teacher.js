document.getElementById('gradeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const student = document.getElementById('student').value;
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;

    const response = await fetch('/add-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student, subject, grade: parseInt(grade) })
    });

    if (response.ok) {
        document.getElementById('message').textContent = 'ציון הוזן בהצלחה!';
        document.getElementById('message').style.color = 'green';
    } else {
        document.getElementById('message').textContent = 'שגיאה בהזנה.';
        document.getElementById('message').style.color = 'red';
    }
});