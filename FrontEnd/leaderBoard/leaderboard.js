// Fetch leaderboard data from the API using Axios
async function fetchLeaderboardData() {
  try {
    const response = await axios.get(
      "http://localhost:3000/premium/showleaderboard"
    );
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
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.username}</td>
      <td>₹${item.totalAmount.toFixed(
        2
      )}</td> <!-- Format amount as currency -->
    `;
    leaderboardBody.appendChild(row);
  });
}

// Fetch and render leaderboard data when the page loads
window.onload = async () => {
  const leaderboardData = await fetchLeaderboardData();
  renderLeaderboard(leaderboardData);
};
