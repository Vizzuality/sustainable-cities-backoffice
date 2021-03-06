import React from 'react';
import PropTypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { Input, Button, Form } from 'components/form/Form';
import Spinner from 'components/ui/Spinner';
import { login } from 'modules/user';
import { Autobind } from 'es-decorators';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';
import capitalize from 'lodash/capitalize';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
  }

  /* Lifecycle */
  componentWillReceiveProps(newProps) {
    if (newProps.user.error && !isEqual(this.props.user.error, newProps.user.error)) {
      toastr.error(capitalize(newProps.user.error.errors[0].title));
    }
  }

  /* Methods  */
  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    // Login user
    dispatch(login(this.form));
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  render() {
    return (
      <section className="c-form -login">
        <Form className="login-form" onSubmit={this.onSubmit}>
          <h3>Login</h3>
          <Input
            type="email"
            onChange={this.onInputChange}
            name="email"
            value=""
            placeholder="Email"
            validations={['required', 'email']}
          />
          <Input
            type="password"
            onChange={this.onInputChange}
            name="password"
            value=""
            placeholder="Password"
            validations={['required']}
          />
          <Button className="button">Login</Button>
          <Spinner isLoading={this.props.user.loading} />
        </Form>
      </section>
    );
  }
}

Login.propTypes = {
  user: PropTypes.object
};
