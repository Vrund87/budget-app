import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { format } from "date-fns";

const BudgetCharts = ({ budgets, expenses }) => {
  const expensesByBudget = budgets.map((budget) => {
    const budgetExpenses = expenses.filter((exp) => exp.budgetID === budget.id);
    const totalSpent = budgetExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (totalSpent <= budget.amount) {
      return {
        name: budget.name,
        Spent: totalSpent,
        Remaining: budget.amount - totalSpent,
        Overspent: 0,
      };
    } else {
      return {
        name: budget.name,
        Spent: budget.amount,
        Remaining: 0,
        Overspent: totalSpent - budget.amount,
      };
    }
  });

  // Group expenses by date
  const expensesByDateMap = {};
  expenses.forEach((exp) => {
    const date = format(new Date(exp.createAt), "yyyy-MM-dd");
    if (!expensesByDateMap[date]) {
      expensesByDateMap[date] = 0;
    }
    expensesByDateMap[date] += exp.amount;
  });

  const expensesByDate = Object.entries(expensesByDateMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="grid-md">
      <h2>Budget Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={expensesByBudget}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Spent" stackId="a" fill="#82ca9d" name="Spent" />
          <Bar dataKey="Remaining" stackId="a" fill="#eee" name="Remaining" />
          <Bar
            dataKey="Overspent"
            stackId="a"
            fill="#ff4d4f"
            name="Overspent"
          />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="mt-4">Expenses Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={expensesByDate}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetCharts;
