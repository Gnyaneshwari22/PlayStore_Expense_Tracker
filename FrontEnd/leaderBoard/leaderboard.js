async function fetchLeaderboardData() {
  try {
    const response = await axios.get(
      "http://65.0.105.253:3000/premium/showleaderboard"
    );
    console.log("API Response:", response.data);
    if (response.status !== 200) {
      throw new Error("Failed to fetch leaderboard data");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
}

// Render leaderboard data in the table
function renderLeaderboard(data) {
  const leaderboardBody = document.getElementById("leaderboardBody");
  leaderboardBody.innerHTML = ""; // Clear existing content

  // Add rows to the table
  data.forEach((item) => {
    const row = document.createElement("tr");
    const totalExpense = parseFloat(item.totalExpense) || 0; // Convert string to number
    row.innerHTML = `
      <td>${item.rank}</td>
      <td>${item.username}</td>
      <td>₹${totalExpense.toFixed(2)}</td> <!-- Format amount as currency -->
    `;
    leaderboardBody.appendChild(row);
  });
}

// Fetch and render leaderboard data when the page loads
window.onload = async () => {
  const leaderboardData = await fetchLeaderboardData();
  renderLeaderboard(leaderboardData);
};
