// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrfPbwwfiopkPNQZEBfoi-Qdng1ZjGU_M",
  authDomain: "messager-4abd8.firebaseapp.com",
  databaseURL: "https://messager-4abd8.firebaseio.com",
  projectId: "messager-4abd8",
  storageBucket: "messager-4abd8.appspot.com",
  messagingSenderId: "650985879545",
  appId: "1:650985879545:web:66192d0f2b0f0acd40af28",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const studentsRef = ref(db, "students");

// Add Student
document.getElementById("addStudentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const userClass = document.getElementById("class").value;

  push(studentsRef, { Name: name, Phone: phone, Class: userClass }).then(() => {
    alert("Student added successfully!");
    e.target.reset();
  });
});

// Fetch and Display Students
onValue(studentsRef, (snapshot) => {
  const studentsTable = document.getElementById("studentsTable");
  studentsTable.innerHTML = "";
  let index = 1;

  snapshot.forEach((childSnapshot) => {
    const student = childSnapshot.val();
    const key = childSnapshot.key;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index++}</td>
      <td>${student.Name}</td>
      <td>${student.Phone}</td>
      <td>${student.Class}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn" data-id="${key}">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${key}">Delete</button>
      </td>
    `;
    studentsTable.appendChild(tr);
  });

  // Handle Edit
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-id");
      const student = snapshot.child(key).val();

      document.getElementById("editKey").value = key;
      document.getElementById("editName").value = student.Name;
      document.getElementById("editPhone").value = student.Phone;
      document.getElementById("editClass").value = student.Class;

      new bootstrap.Modal(document.getElementById("editModal")).show();
    });
  });

  // Handle Delete
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this student?")) {
        remove(ref(db, `students/${key}`));
      }
    });
  });
});

// Update Student
document.getElementById("editStudentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const key = document.getElementById("editKey").value;
  const name = document.getElementById("editName").value;
  const phone = document.getElementById("editPhone").value;
  const userClass = document.getElementById("editClass").value;

  update(ref(db, `students/${key}`), { Name: name, Phone: phone, Class: userClass }).then(() => {
    alert("Student updated successfully!");
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
  });
});

// Add Search Functionality
document.getElementById("searchBar").addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  const studentsTable = document.getElementById("studentsTable");
  const rows = studentsTable.getElementsByTagName("tr");

  Array.from(rows).forEach((row) => {
    const nameCell = row.getElementsByTagName("td")[1]; // Name column
    if (nameCell) {
      const nameText = nameCell.textContent || nameCell.innerText;
      if (nameText.toLowerCase().includes(searchValue)) {
        row.style.display = ""; // Show row
      } else {
        row.style.display = "none"; // Hide row
      }
    }
  });
});
