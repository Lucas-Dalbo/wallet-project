import React from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginAction } from '../actions';
import Button from '../components/Button';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      btnIsLocked: true,
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, () => this.buttonHandler());
  }

  emailHandler = (email) => {
    const position = email.search('@') + 1;
    const subEmail = email.substring(position, email.length);
    const arroba = email.replace(/[^@]/gi, '');
    if (
      email.length > 0
      && email.includes('@')
      && email.includes('.com')
      && subEmail.length > 0
      && arroba.length === 1
    ) {
      return true;
    }
    return false;
  }

  passwordHandler = (password) => (password.length >= Number('6'));

  buttonHandler = () => {
    const { email, password } = this.state;
    let isAvaliable = false;
    if (this.emailHandler(email) && this.passwordHandler(password)) isAvaliable = true;
    this.setState({
      btnIsLocked: !isAvaliable,
    });
  }

  clickBtnLogin = (email) => {
    const { userLogin, history } = this.props;
    userLogin(email);
    history.push('/carteira');
  }

  render() {
    const { email, password, btnIsLocked } = this.state;
    return (
      <main className="login-container">
        <header className="login-title">
          <h1>Trybe Wallet</h1>
          <h4>Organizando e contabilizando suas finanças</h4>
        </header>
        <div className="login-box">
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              id="email"
              value={ email }
              onChange={ this.handleChange }
              data-testid="email-input"
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              id="password"
              value={ password }
              onChange={ this.handleChange }
              data-testid="password-input"
            />
          </label>
          <Button
            text="Entrar"
            disable={ btnIsLocked }
            onClick={ () => this.clickBtnLogin(email) }
          />
        </div>
        <footer>
          <p>TrybeWallet© by Lucas Dalbo</p>
        </footer>
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  userLogin: (email) => dispatch(loginAction(email)),
});

Login.propTypes = {
  userLogin: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
