export const waait = () => new Promise(res => setTimeout(res, Math.random() * 800));

const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetLength * 34}, 65%, 50%`
};

// Local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] == value);
}

export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key);
  if(id){
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
}

export const createBudget = ({ name, amount }) => {
  const newBudget = {
    id: crypto.randomUUID(),
    name,
    createAt: Date.now(),
    amount: +amount,
    color: generateRandomColor()
  };
  const budgets = fetchData("budgets") ?? [];
  return localStorage.setItem("budgets", JSON.stringify([...budgets, newBudget]));
}

export const createExpense = ({ name, amount, budgetID }) => {
  const newExpense = {
    id: crypto.randomUUID(),
    name,
    createAt: Date.now(),
    amount: +amount,
    budgetID
  };
  const expenses = fetchData("expenses") ?? [];
  return localStorage.setItem("expenses", JSON.stringify([...expenses, newExpense]));
}

export const calculateSpentByBudget = (budgetID) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    if (expense.budgetID !== budgetID) return acc;

    return acc + expense.amount;
  }, 0);
  return budgetSpent;
}

export const formatDateToLocaleString = (epoch) => new Date(epoch).toLocaleDateString();

export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0
  })
}

export const formatCurrency = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "INR"
  })
}