const API_URL = "http://localhost:3000/expense";

let currentPage = 1; // Track the current page

// Function to check premium status
async function checkPremiumStatus() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/premium/user/premiumStatus",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { isPremium } = response.data;

    // Update the UI based on premium status
    const premiumButton = document.getElementById("premiumButton");
    const premiumMessage = document.createElement("p");

    if (isPremium) {
      // User is a premium member
      premiumButton.style.display = "none"; // Hide the button
      premiumMessage.textContent = "You are a premium user 🎉";
      premiumMessage.style.color = "green";
      premiumMessage.style.fontWeight = "bold";
      premiumButton.parentNode.insertBefore(
        premiumMessage,
        premiumButton.nextSibling
      );
    } else {
      // User is not a premium member
      premiumButton.style.display = "block"; // Show the button
      if (document.contains(premiumMessage)) {
        premiumMessage.remove(); // Remove the message if it exists
      }
    }
  } catch (error) {
    console.error("Error fetching premium status:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch premium status. Please try again.",
    });
  }
}

// Fetch and display expenses
async function fetchExpenses(page = 1, limit = 3) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/expense/getExpenses",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: limit,
        },
      }
    );
    const { expenses, pagination } = response.data;
    console.log("Fetched expenses:", expenses);
    console.log("Pagination metadata:", pagination);
    displayExpenses(expenses);
    updatePaginationControls(pagination);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch expenses. Please try again.",
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

// Update pagination controls
function updatePaginationControls(pagination) {
  document.getElementById("currentPage").textContent = pagination.currentPage;
  document.getElementById("totalPages").textContent = pagination.totalPages;

  // Enable/disable Previous and Next buttons based on the current page
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  prevButton.disabled = pagination.currentPage === 1;
  nextButton.disabled = pagination.currentPage === pagination.totalPages;
}

// Handle Previous button click
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchExpenses(currentPage);
  }
});

// Handle Next button click
document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = parseInt(
    document.getElementById("totalPages").textContent
  );
  if (currentPage < totalPages) {
    currentPage++;
    fetchExpenses(currentPage);
  }
});

// Initial fetch on page load

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

// Fetch expenses on page load
document.addEventListener("DOMContentLoaded", () => {
  checkPremiumStatus();
  fetchExpenses(currentPage);
});
