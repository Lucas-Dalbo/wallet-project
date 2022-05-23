import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

class Table extends React.Component {
  findName = (name) => {
    const coinName = name.split('/');
    return coinName[0];
  };

  render() {
    const { expensesToTable, onClickDelete, onClickEdit } = this.props;
    return (
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tag</th>
            <th>Método de pagamento</th>
            <th>Valor</th>
            <th>Moeda</th>
            <th>Câmbio utilizado</th>
            <th>Valor convertido</th>
            <th>Moeda de conversão</th>
            <th>Editar/ Excluir</th>
          </tr>
        </thead>
        {
          expensesToTable.map((exp) => (
            <tbody key={ exp.id }>
              <tr>
                <td>{ exp.description }</td>
                <td>{ exp.tag }</td>
                <td>{ exp.method }</td>
                <td>{ parseFloat(exp.value).toFixed(2) }</td>
                <td>Real</td>
                <td>
                  { parseFloat(exp.exchangeRates[exp.currency].ask).toFixed(2)}
                </td>
                <td>
                  {
                    parseFloat(exp.value * exp.exchangeRates[exp.currency].ask).toFixed(2)
                  }
                </td>
                <td>
                  {
                    this.findName(exp.exchangeRates[exp.currency].name)
                  }
                </td>
                <td>
                  <button
                    type="button"
                    name="edit-btn"
                    value={ exp.id }
                    data-testid="edit-btn"
                    onClick={ onClickEdit }
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    name="delete-btn"
                    value={ exp.id }
                    data-testid="delete-btn"
                    onClick={ onClickDelete }
                  >
                    ✖
                  </button>
                </td>
              </tr>
            </tbody>
          ))
        }
      </table>
    );
  }
}

Table.propTypes = {
  expensesToTable: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired,
};

export default Table;
