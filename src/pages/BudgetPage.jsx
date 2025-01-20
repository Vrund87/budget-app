import { useLoaderData } from "react-router-dom";
import { createExpense, deleteItem, getAllMatchingItems } from "../helpers";
import BudgetItem from "../components/BudgetItem";
import AddExpenseForm from "../components/AddExpenseForm";
import Table from "../components/Table";
import { toast } from "react-toastify";

export async function budgetLoader({ params }) {
  const budget = getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: params.id,
  })[0];

  const expenses = getAllMatchingItems({
    category: "expenses",
    key: "budgetID",
    value: params.id,
  });

  if (!budget) {
    throw new Error("The budget you're trying to find doesn't exist");
  }

  return { budget, expenses };
}

export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetID: values.newExpenseBudget,
      });
      return toast.success(`Expense ${values.newExpense} added!`);
    } catch (error) {
      throw new Error("Failed to add expense");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success(`Expense ${values.newExpense} deleted!`);
    } catch (error) {
      throw new Error("Failed to delete expense");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();

  return (
  <div
    className="grid-lg"
    style={{
      "--accent": budget.color,
    }}
  >
    <h1 className="h2">
      <span className="accent">{budget.name}</span>{" "}
      Overview
    </h1>
    <div className="flex-lg">
      <BudgetItem budget={budget} showDelete={true} />
      <AddExpenseForm budgets={[budget]} />
    </div>
    {expenses && expenses.length > 0 && (
      <div className="grid-md">
        <h2>
          <span className="accent">{budget.name} </span>
          Expenses
        </h2>
        <Table expenses={expenses} showBudget={false} />
      </div>
    )}
  </div>
  )
};

export default BudgetPage;
