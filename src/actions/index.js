// Coloque aqui suas actions
export const LOGIN = 'LOGIN';
export const GET_CURRENCIES = 'GET_CURRENCIES';
export const SEND_EXPENSE = 'SEND_EXPENSE';
export const DELETE_EDIT_EXPENSE = 'DELETE_EDIT_EXPENSE';
export const EDIT_EXPENSE = 'EDIT_EXPENSE';

export const loginAction = (login) => ({
  type: LOGIN,
  email: login,
});

const showCurrencies = (currencies) => ({
  type: GET_CURRENCIES,
  currencies,
});

export function getCurrencies() {
  return async (dispatch) => {
    try {
      const fetchAPI = await fetch('https://economia.awesomeapi.com.br/json/all');
      const result = await fetchAPI.json();
      delete result.USDT;
      dispatch(showCurrencies(result));
      return result;
    } catch (e) {
      console.log(e);
    }
  };
}

export const sendExpense = (expense) => ({
  type: SEND_EXPENSE,
  expense,
});

export const deleteOrEditExpense = (expenses) => ({
  type: DELETE_EDIT_EXPENSE,
  expenses,
});

export const editExpense = (expenses) => ({
  type: EDIT_EXPENSE,
  expenses,
});
