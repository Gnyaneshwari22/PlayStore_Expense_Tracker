// utils/convertExpensesToCSV.js

module.exports = function convertExpensesToCSV(expenses) {
  const header = "Amount,Category,Description,Created At\n";
  const rows = expenses
    .map((expense) => {
      const { amount, category, description, created_at } = expense;
      return `${amount},${category},${description},${created_at}`;
    })
    .join("\n");

  return header + rows;
};
