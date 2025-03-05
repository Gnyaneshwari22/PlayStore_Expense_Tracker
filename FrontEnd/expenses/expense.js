const API_URL = "http://localhost:3000/expense";

// Fetch and display expenses
async function fetchExpenses() {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    const response = await axios.get(
      "http://localhost:3000/expense/getExpenses",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      }
    );
    const expenses = response.data;
    console.log("Fetched expenses:", expenses);
    displayExpenses(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch expenses. Please try again.",
    });
  }
}

// Add a new expense
async function addExpense(expenseData) {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    const response = await axios.post(`${API_URL}/addExpense`, expenseData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
    console.log("Expense added:", response.data);

    // Show success popup
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Expense added successfully.",
    });

    fetchExpenses(); // Refresh the list
  } catch (error) {
    console.error("Error adding expense:", error);

    // Show error popup
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to add expense. Please try again.",
    });
  }
}

// Display expenses on the UI
function displayExpenses(expenses) {
  const expenseList = document.getElementById("expenseList");
  if (expenses.length > 0) {
    expenseList.innerHTML = expenses
      .map(
        (expense) => `
      <div class="expense-card">
        <p><strong>Amount:</strong> $${expense.amount}</p>
        <p><strong>Description:</strong> ${expense.description}</p>
        <p><strong>Category:</strong> ${expense.category}</p>
        <button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.id})">Delete</button>
      </div>
    `
      )
      .join("");
  } else {
    expenseList.innerHTML = "<p>No expenses found. Add your first expense!</p>";
  }
}

// Delete an expense
async function deleteExpense(id) {
  try {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    await axios.delete(`${API_URL}/deleteExpense/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
    console.log("Expense deleted:", id);

    // Show success popup
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Expense deleted successfully.",
    });

    fetchExpenses(); // Refresh the list
  } catch (error) {
    console.error("Error deleting expense:", error);

    // Show error popup
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to delete expense. Please try again.",
    });
  }
}

// Handle form submission
document.getElementById("expenseForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const expenseData = {
    amount: document.getElementById("amount").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
  };

  addExpense(expenseData);
  e.target.reset(); // Clear the form
});

document
  .getElementById("leaderBoardButton")
  .addEventListener("click", async (e) => {
    let leaderBoardResponse = await axios.get(
      "http://localhost:3000/premium/showleaderboard"
    );
  });

// Redirect to leaderboard.html when the button is clicked

// Fetch expenses on page load
document.addEventListener("DOMContentLoaded", fetchExpenses);
