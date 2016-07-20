/**
 * Created by adi on 7/17/16.
 */
import React from 'react';
require('./login.css')

var Login = React.createClass({
  loginClose() {
    this.props.loginClose();
  },
  getInitialState: function () {
    return {
      email: this.props.email || '',
      pass: this.props.pass || '',
      invalidEmail: false,
      invalidPass: false,
      wrongCreds: false
    };
  },
  setEmail: function (event) {
    this.setState({
      email: event.currentTarget.value
    });
  },
  setPass: function (event) {
    this.setState({
      pass: event.currentTarget.value
    });
  },
  validate() {
    var email = this.email.value;
    var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (!email_regex.test(email)) {
      this.setState({
        invalidEmail: true
      });
    }
    var pass = this.pass.value;
    if (!(pass.length > 6)) {
      this.setState({
        invalidPass: true
      });
    }
  },
  render(){
    return (
      <div id="loginModal" className="modal fade" role="dialog" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button onClick={this.loginClose} className="close" data-dismiss="modal">&times;</button>
              <button className="vid-fb-button">continue with facebook</button>
            </div>
            <div className="modal-body">
              <p className="or-login-with-email">or login with email and password</p>
              <form role="form">
                <input type="text" id="email" onChange={this.setEmail} value={this.state.email}
                       className="form-control vid-input" ref={(v) => this.email = v} placeholder="enter email"/>
                <br/><span className={this.state.invalidEmail ? '' : 'hidden'}>invalid email</span>
                <input type="password" id="pass" onChange={this.setPass} value={this.state.pass}
                       className="form-control vid-input" ref={(v) => this.pass = v}
                       placeholder="enter password (atleast 7 characters)"/>
                <br/><span
                className={this.state.invalidPass ? '' : 'hidden'}>password must contain atleast 7 characters</span>
                <button type="submit" onClick={this.validate} className="btn btn-default vid-login-btn">login</button>
              </form>
            </div>
            <div className="modal-footer">
              <p className="tos">by logging in you are agreeing to our <a target="_blank" href="tos.html">terms of
                use</a></p>
              <a className="forgot-password" href="#">forgot password?</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Login;
