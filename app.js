// At the top of your app.js
const urlParams = new URLSearchParams(window.location.search);
const currentSection = urlParams.get('section') || 'A'; // Default to Section A if none specified

// You can then use currentSection throughout your app
console.log(`Currently viewing: Section ${currentSection}`);

// app.js - Main application logic with DSA implementations

// Chart instance variable
let performanceChartInstance = null;

// Data structure to store students (using Hash Table concept)
class StudentHashTable {
    constructor(size = 100) {
        this.size = size;
        this.students = new Array(size).fill(null).map(() => []);
    }

    // Hash function
    _hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i) * i) % this.size;
        }
        return hash;
    }

    // Add student
    set(student) {
        const index = this._hash(student.id.toString());
        this.students[index].push(student);
    }

    // Get student by ID
    get(id) {
        const index = this._hash(id.toString());
        const bucket = this.students[index];
        for (let student of bucket) {
            if (student.id === id) return student;
        }
        return null;
    }

    // Get all students
    getAll() {
        let allStudents = [];
        for (let bucket of this.students) {
            allStudents.push(...bucket);
        }
        return allStudents;
    }
}

// Student class
class Student {
    constructor(id, name, marks, attendance) {
        this.id = id;
        this.name = name;
        this.marks = marks;
        this.attendance = attendance;
        this.grade = this.calculateGrade();
    }

    calculateGrade() {
        if (this.marks >= 90) return 'A';
        if (this.marks >= 80) return 'B';
        if (this.marks >= 70) return 'C';
        if (this.marks >= 60) return 'D';
        return 'F';
    }
}

// Initialize the student database
const studentDB = new StudentHashTable();

// Sample data
const sampleStudents = [
    new Student(1, 'Alice Johnson', 85, 92),
    new Student(2, 'Bob Smith', 72, 88),
    new Student(3, 'Charlie Brown', 91, 95),
    new Student(4, 'Diana Prince', 68, 76),
    new Student(5, 'Ethan Hunt', 79, 82)
];

// Add sample data to the database
sampleStudents.forEach(student => studentDB.set(student));

// DOM elements
const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
const statsDiv = document.getElementById('stats');
const performanceChartCtx = document.getElementById('performanceChart').getContext('2d');

// Render students table
function renderStudents(students = studentDB.getAll()) {
    studentTable.innerHTML = '';
    students.forEach(student => {
        const row = studentTable.insertRow();
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.marks}</td>
            <td>${student.attendance}%</td>
            <td>${student.grade}</td>
            <td>
                <button onclick="editStudent(${student.id})">Edit</button>
                <button onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
    });
}

// Render statistics
function renderStats() {
    const students = studentDB.getAll();
    const totalStudents = students.length;
    const avgMarks = students.reduce((sum, student) => sum + student.marks, 0) / totalStudents;
    const avgAttendance = students.reduce((sum, student) => sum + student.attendance, 0) / totalStudents;
    
    statsDiv.innerHTML = `
        <p>Total Students: ${totalStudents}</p>
        <p>Average Marks: ${avgMarks.toFixed(2)}</p>
        <p>Average Attendance: ${avgAttendance.toFixed(2)}%</p>
    `;
}

// Render performance chart
function renderChart() {
    const students = studentDB.getAll();
    const labels = students.map(student => student.name);
    const marksData = students.map(student => student.marks);
    const attendanceData = students.map(student => student.attendance);
    
    // Destroy previous chart if it exists
    if (performanceChartInstance) {
        performanceChartInstance.destroy();
    }
    
    // Create new chart
    performanceChartInstance = new Chart(performanceChartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Marks',
                    data: marksData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Attendance (%)',
                    data: attendanceData,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Search student using binary search (requires sorted array)
function searchStudent() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) {
        renderStudents();
        return;
    }
    
    // Get all students and sort by name for binary search
    let students = studentDB.getAll();
    students.sort((a, b) => a.name.localeCompare(b.name));
    
    // Binary search implementation
    let left = 0;
    let right = students.length - 1;
    let results = [];
    
    // While loop for binary search
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const studentName = students[mid].name.toLowerCase();
        
        if (studentName.includes(query)) {
            // Found a match, now check neighboring elements
            results.push(students[mid]);
            
            // Check left side
            let i = mid - 1;
            while (i >= 0 && students[i].name.toLowerCase().includes(query)) {
                results.push(students[i]);
                i--;
            }
            
            // Check right side
            i = mid + 1;
            while (i < students.length && students[i].name.toLowerCase().includes(query)) {
                results.push(students[i]);
                i++;
            }
            
            break;
        } else if (studentName < query) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    renderStudents(results.length > 0 ? results : []);
}

// Sort students using merge sort algorithm
function sortStudents() {
    const option = document.getElementById('sortOption').value;
    let students = studentDB.getAll();
    
    function mergeSort(arr) {
        if (arr.length <= 1) return arr;
        
        const mid = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, mid));
        const right = mergeSort(arr.slice(mid));
        
        return merge(left, right);
    }
    
    function merge(left, right) {
        let result = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            let comparison;
            switch (option) {
                case 'name':
                    comparison = left[i].name.localeCompare(right[j].name);
                    break;
                case 'marks':
                    comparison = right[j].marks - left[i].marks; // Descending
                    break;
                case 'attendance':
                    comparison = right[j].attendance - left[i].attendance; // Descending
                    break;
                default:
                    comparison = left[i].name.localeCompare(right[j].name);
            }
            
            if (comparison < 0) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }
        
        return result.concat(left.slice(i)).concat(right.slice(j));
    }
    
    const sortedStudents = mergeSort(students);
    renderStudents(sortedStudents);
}

// Add new student
function addStudent() {
    const name = document.getElementById('newStudentName').value;
    const marks = parseInt(document.getElementById('newStudentMarks').value);
    const attendance = parseInt(document.getElementById('newStudentAttendance').value);
    
    if (!name || isNaN(marks) || isNaN(attendance)) {
        alert('Please fill all fields with valid data');
        return;
    }
    
    // Generate ID (in a real app, this would come from a database)
    const newId = studentDB.getAll().length > 0 ? 
        Math.max(...studentDB.getAll().map(s => s.id)) + 1 : 1;
    
    const newStudent = new Student(newId, name, marks, attendance);
    studentDB.set(newStudent);
    
    // Clear inputs
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentMarks').value = '';
    document.getElementById('newStudentAttendance').value = '';
    
    // Refresh UI
    renderStudents();
    renderStats();
    renderChart(); // This will now properly update the chart

    updateDashboardCards();
animateCardUpdate('totalStudents');
}

// Edit student (simplified for demo)
function editStudent(id) {
    const student = studentDB.get(id);
    if (!student) return;
    
    const newName = prompt("Enter new name:", student.name);
    const newMarks = prompt("Enter new marks:", student.marks);
    const newAttendance = prompt("Enter new attendance:", student.attendance);
    
    if (newName !== null && newMarks !== null && newAttendance !== null) {
        student.name = newName;
        student.marks = parseInt(newMarks);
        student.attendance = parseInt(newAttendance);
        student.grade = student.calculateGrade();
        
        renderStudents();
        renderStats();
        renderChart(); // Update the chart after editing
    }

    updateDashboardCards();
animateCardUpdate('avgMarks');
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        // In a real hash table implementation, we would remove from the bucket
        // For this demo, we'll create a new array without the student
        const allStudents = studentDB.getAll();
        const updatedStudents = allStudents.filter(student => student.id !== id);
        
        // Clear and rebuild the hash table
        studentDB.students = new Array(studentDB.size).fill(null).map(() => []);
        updatedStudents.forEach(student => studentDB.set(student));
        
        renderStudents();
        renderStats();
        renderChart(); // Update the chart after deletion
    }

    updateDashboardCards();
animateCardUpdate('totalStudents');
}


// Update dashboard cards with current statistics
function updateDashboardCards() {
    const students = studentDB.getAll();
    const totalStudents = students.length;
    
    // Calculate average marks
    const avgMarks = students.reduce((sum, student) => sum + student.marks, 0) / totalStudents || 0;
    
    // Calculate average attendance
    const avgAttendance = students.reduce((sum, student) => sum + student.attendance, 0) / totalStudents || 0;
    
    // Find top performer
    let topStudent = "-";
    if (students.length > 0) {
        const top = students.reduce((prev, current) => 
            (prev.marks > current.marks) ? prev : current
        );
        topStudent = top.name;
    }
    
    // Update DOM elements
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('avgMarks').textContent = avgMarks.toFixed(1);
    document.getElementById('avgAttendance').textContent = `${avgAttendance.toFixed(1)}%`;
    document.getElementById('topStudent').textContent = topStudent;
}

// Add animation to cards when they update
function animateCardUpdate(cardId) {
    const card = document.getElementById(cardId).closest('.card');
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 300);
}


// Initialize the application
window.onload = function() {
    renderStudents();
    renderStats();
    renderChart();

    updateDashboardCards();
};

// Make functions available in global scope
window.searchStudent = searchStudent;
window.sortStudents = sortStudents;
window.addStudent = addStudent;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;