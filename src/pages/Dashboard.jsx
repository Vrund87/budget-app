// rrd imports
import { Link, useLoaderData } from "react-router-dom";

//  helper functions
import { createBudget, createExpense, deleteItem, fetchData, waait } from "../helpers";
import Intro from "../components/Intro";
import { toast } from "react-toastify";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

// loader
export function dashboardLoader() {
  const userName = fetchData("userName");
  const budgets = fetchData("budgets");
  const expenses = fetchData("expenses");
  return { userName, budgets, expenses };
}

// action
export async function dashboardAction({ request }) {
  await waait();
  const data = await request.formData();
  const { _action, ...formData } = Object.fromEntries(data);

  if (_action === "newUser") {
    try {
      localStorage.setItem("userName", JSON.stringify(formData.userName));
      return toast.success(`Welcome ${formData.userName}!`);
    } catch (error) {
      throw new Error("Failed to create account");
    }
  }

  if (_action === "createBudget") {
    try {
      createBudget({
        name: formData.newBudget,
        amount: formData.newBudgetAmount,
      });
      return toast.success(`Budget ${formData.newBudget} created!`);
    } catch (error) {
      throw new Error("Failed to create budget");
    }
  }

  if (_action === "createExpense") {
    try {
      createExpense({
        name: formData.newExpense,
        amount: formData.newExpenseAmount,
        budgetID: formData.newExpenseBudget,
      });
      return toast.success(`Expense ${formData.newExpense} added!`);
    } catch (error) {
      throw new Error("Failed to add expense");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: formData.expenseId,
      });
      return toast.success(`Expense ${formData.removeExpense} deleted!`);
    } catch (error) {
      throw new Error("Failed to delete expense");
    }
  }
}

const Dashboard = () => {
  const { userName, budgets, expenses } = useLoaderData();

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1>
            Wekcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2>Existing Budgets</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses.sort(
                        (a, b) => b.createAt - a.createAt
                      ).slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link to="/expenses" className="btn btn--dark">
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Personal budgeting is the secret to financial freedom.</p>
                <p>Create a budget to get started!</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};
export default Dashboard;
