
const registrationForm = document.getElementById("registrationForm");
const resultForm = document.getElementById("resultForm");

const formMessage = document.getElementById("formMessage");
const resultMessage = document.getElementById("resultMessage");
const resultsBody = document.getElementById("resultsBody");

// Read saved data from this browser
function readData(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Save data in this browser
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

// Student registration
registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const student = {
    name: document.getElementById("studentName").value.trim(),
    rollNumber: document.getElementById("rollNumber").value.trim(),
    department: document.getElementById("department").value,
    year: document.getElementById("year").value,
    email: document.getElementById("email").value.trim(),
    competition: document.getElementById("competition").value
  };

  if (Object.values(student).some(value => !value)) {
    formMessage.textContent = "Please fill in all fields.";
    return;
  }

  const registrations = readData("contestRegistrations");

  const alreadyRegistered = registrations.some(
    item => item.rollNumber.toLowerCase() ===
            student.rollNumber.toLowerCase()
  );

  if (alreadyRegistered) {
    formMessage.textContent =
      "This register number has already been registered.";
    return;
  }

  registrations.push(student);

  if (!saveData("contestRegistrations", registrations)) {
    formMessage.textContent =
      "Unable to save. Please check your browser storage.";
    return;
  }

  formMessage.textContent =
    "Registration successful! Welcome, " + student.name + ".";

  registrationForm.reset();
});

// Display published results
function displayResults() {
  const results = readData("contestResults");
  resultsBody.replaceChildren();

  if (results.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 3;
    cell.textContent = "Results have not been published yet.";
    row.appendChild(cell);
    resultsBody.appendChild(row);
    return;
  }

  results.forEach(result => {
    const row = document.createElement("tr");

    [result.competition, result.winner, result.department]
      .forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

    resultsBody.appendChild(row);
  });
}

// Organizer publishes a winner
resultForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const competition =
    document.getElementById("resultCompetition").value;
  const winner =
    document.getElementById("winnerName").value.trim();
  const department =
    document.getElementById("winnerDepartment").value.trim();

  if (!competition || !winner || !department) {
    resultMessage.textContent = "Please fill in all fields.";
    return;
  }

  const results = readData("contestResults");

  const existingIndex = results.findIndex(
    item => item.competition === competition
  );

  const newResult = {
    competition: competition,
    winner: winner,
    department: department
  };

  if (existingIndex >= 0) {
    results[existingIndex] = newResult;
  } else {
    results.push(newResult);
  }

  if (!saveData("contestResults", results)) {
    resultMessage.textContent =
      "Unable to save the result. Please try again.";
    return;
  }

  displayResults();

  resultMessage.textContent =
    competition + " result published successfully!";

  resultForm.reset();
});

// Load results when the page opens
displayResults();