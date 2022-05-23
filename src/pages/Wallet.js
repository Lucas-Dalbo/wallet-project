import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteOrEditExpense, getCurrencies, sendExpense } from '../actions';
import Button from '../components/Button';
import Table from '../components/Table';
import './Wallet.css';

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = {
      total: 0,
      positionEdit: null,
      editID: null,
      exchange: null,
      expenseId: 0,
      moeda: 'BRL',
      value: '',
      currency: 'USD',
      description: '',
      method: 'Dinheiro',
      tag: 'Alimentação',
    };
  }

  componentDidMount() {
    this.fecthCurrencies();
    this.handleTotal();
  }

  fecthCurrencies = async () => {
    const { getCurrencieList } = this.props;
    return getCurrencieList();
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  handleTotal = () => {
    const { expensesList } = this.props;
    const newTotal = expensesList.reduce((acc, crr) => {
      const exchange = crr.value * crr.exchangeRates[crr.currency].ask;
      return acc + exchange;
    }, 0);
    this.setState({ total: newTotal });
  }

  saveNewExpense = async () => {
    const { sendNewExpense } = this.props;
    const {
      value, currency, description, positionEdit,
      method, tag, expenseId, editID, exchange,
    } = this.state;
    const exchangeRates = await this.fecthCurrencies();
    const newExpense = {
      id: editID !== null ? editID : expenseId,
      value: value === '' ? 0 : value,
      description,
      currency,
      method,
      tag,
      exchangeRates: editID !== null ? exchange : exchangeRates,
    };
    if (editID === null) {
      sendNewExpense(newExpense);
    } else {
      this.sendEditExpensive(newExpense, positionEdit);
    }
    this.setState((prevState) => ({
      value: '',
      description: '',
      expenseId: prevState.expenseId + 1,
    }), () => {
      this.handleTotal();
    });
  }

  deleteClickExpense = async ({ target: { value } }) => {
    const { dispDeleteExpense, expensesList } = this.props;
    const newList = expensesList.filter((exp) => exp.id !== Number(value));
    dispDeleteExpense(newList, () => {});
    this.setState(({}), () => {
      this.handleTotal();
    });
  };

  editClickExpense = ({ target: { value } }) => {
    const { expensesList } = this.props;
    const expenseToEdit = expensesList.find((exp) => exp.id === Number(value));
    const position = expensesList.indexOf(expenseToEdit);
    this.setState({
      value: expenseToEdit.value,
      currency: expenseToEdit.currency,
      description: expenseToEdit.description,
      method: expenseToEdit.method,
      tag: expenseToEdit.tag,
      editID: expenseToEdit.id,
      positionEdit: position,
      exchange: expenseToEdit.exchangeRates,
    });
  }

  sendEditExpensive = (edit, position) => {
    const { expensesList, dispDeleteExpense } = this.props;
    expensesList[position] = edit;
    dispDeleteExpense(expensesList);
    this.setState(({ editID: null, positionEdit: null, exchange: null }), () => {
      this.handleTotal();
    });
  }

  render() {
    const { userEmail, currenciesList, expensesList } = this.props;
    const { total, moeda, value, currency, description, method, tag,
      editID } = this.state;
    return (
      <div className="wallet-container">
        <header className="wallet-header">
          <p className="email" data-testid="email-field">{ userEmail }</p>
          <h3>Trybe Wallet</h3>
          <div className="wallet-cost">
            <p data-testid="total-field">{ parseFloat(total).toFixed(2) }</p>
            <p data-testid="header-currency-field">{ moeda }</p>
          </div>
        </header>
        <div className="wallet-form">
          <label htmlFor="value">
            Despesa
            <input
              type="number"
              name="value"
              id="value"
              value={ value }
              onChange={ this.handleChange }
              data-testid="value-input"
            />
          </label>
          <label htmlFor="currency">
            Moeda
            <select
              id="currency"
              name="currency"
              value={ currency }
              onChange={ this.handleChange }
              data-testid="currency-input"
            >
              {currenciesList.map((coin) => (
                <option key={ coin }>
                  { coin }
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="description">
            Descrição
            <input
              type="text"
              name="description"
              id="description"
              value={ description }
              onChange={ this.handleChange }
              data-testid="description-input"
            />
          </label>
          <label htmlFor="method">
            Pagamento
            <select
              id="method"
              name="method"
              value={ method }
              onChange={ this.handleChange }
              data-testid="method-input"
            >
              <option>Dinheiro</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
            </select>
          </label>
          <label htmlFor="tag">
            Categoria
            <select
              id="tag"
              name="tag"
              value={ tag }
              onChange={ this.handleChange }
              data-testid="tag-input"
            >
              <option>Alimentação</option>
              <option>Lazer</option>
              <option>Trabalho</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>
          <Button
            text={ editID !== null ? 'Editar despesa' : 'Adicionar despesa' }
            disable={ false }
            onClick={ this.saveNewExpense }
          />
        </div>
        <div className="table-container">
          <Table
            expensesToTable={ expensesList }
            onClickDelete={ this.deleteClickExpense }
            onClickEdit={ this.editClickExpense }
          />
        </div>
        <footer>
          <p>TrybeWallet© by Lucas Dalbo</p>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userEmail: state.user.email,
  currenciesList: state.wallet.currencies,
  expensesList: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  getCurrencieList: () => dispatch(getCurrencies()),
  sendNewExpense: (expense) => dispatch(sendExpense(expense)),
  dispDeleteExpense: (id) => dispatch(deleteOrEditExpense(id)),
});

Wallet.propTypes = {
  userEmail: PropTypes.string.isRequired,
  currenciesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  getCurrencieList: PropTypes.func.isRequired,
  sendNewExpense: PropTypes.func.isRequired,
  dispDeleteExpense: PropTypes.func.isRequired,
  expensesList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
