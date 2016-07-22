/**
 * Created by adi on 7/17/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../main/main';

require('../common/spinner.css');
require('./login.css');

var firebase = require('firebase/app');

var Login = React.createClass({
  getInitialState() {
    return {
      email: '',
      pass: '',
      invalidEmail: false,
      invalidPass: false,
      emailPassMatch: true,
      showForgotPasswordBox: false,
      showLoginBox: true,
      resetEmail: '',
      invalidResetEmail: false,
      showResetEmailSent: false,
      resetEmailNotFound: false
    };
  },
  componentDidMount: function () {
    $("#loginModal").on('hidden.bs.modal', this.handleHidden);
  },
  handleHidden() {
    this.setState({
      showResetEmailSent: false,
      showForgotPasswordBox: false,
      showLoginBox: true
    });
  },
  setResetEmail(event) {
    this.setState({
      resetEmail: event.currentTarget.value,
      invalidResetEmail: false
    });
  },
  setEmail(event) {
    this.setState({
      email: event.currentTarget.value,
      invalidEmail: false,
      emailPassMatch: true
    });
  },
  setPass(event) {
    this.setState({
      pass: event.currentTarget.value,
      invalidPass: false,
      emailPassMatch: true
    });
  },
  validateResetEmail(e) {
    e.preventDefault();
    var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (!email_regex.test(this.resetEmail.value)) {
      this.setState({
        invalidResetEmail: true,
        resetEmailNotFound: false
      });
    } else {
      this.setState({
        invalidResetEmail: false
      }, this.sendPasswordResetEmail);
    }
  },
  sendPasswordResetEmail() {
    $(".vid-spinner-bg").show();
    firebase.auth().sendPasswordResetEmail(this.state.resetEmail).then(() => {
      $(".vid-spinner-bg").hide();
      this.setState({
        showResetEmailSent: true,
        resetEmailNotFound: false
      });
    }, (error) => {
      $(".vid-spinner-bg").hide();
      if (error.code === 'auth/user-not-found') {
        this.setState({
          resetEmailNotFound: true
        });
      }
    });
  },
  validate(e) {
    e.preventDefault();
    var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (!email_regex.test(this.email.value)) {
      this.email.focus();
      this.setState({
        invalidEmail: true
      });
    } else {
      this.setState({
        invalidEmail: false
      });
    }
    if (!(this.pass.value.length > 6)) {
      this.setState({
        invalidPass: true
      });
    } else {
      this.setState({
        invalidPass: false
      }, this.loginWithEmail);
    }
  },
  loginWithEmail() {
    if (!this.state.invalidEmail) { // no need to check invalidPass since pass is gauranteed to be valid here
      $(".vid-spinner-bg").show();
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass).then((result) => {
        Login.renderMainPage(result)
      }).catch((error) => {
        var errorCode = error.code;
        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email') {
          this.setState({
            emailPassMatch: false
          });
        } else if (errorCode === 'auth/user-not-found') {
          firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass).then((result) => {
            Login.renderMainPage(result)
          }).catch((error) => {
            console.error(error);
          });
        } else if (error.code === 'auth/account-exists-with-different-credential') {
          swal({
            title: "", text: error.message + " Email used is: <span style='color:#B40101'>" + error.email + "</span>",
            html: true
          });
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
      });
    }
  },
  loginWithFb() {
    var provider = new firebase.auth.FacebookAuthProvider();
    // provider.addScope('user_birthday'); todo more scopes like birthday
    firebase.auth().signInWithPopup(provider).then((result) => {
      Login.renderMainPage(result)
    }).catch((error) => {
      if (error.code === 'auth/account-exists-with-different-credential') {
        swal({
          title: "", text: error.message + " Email used is: <span style='color:#B40101'>" + error.email + "</span>",
          html: true
        });
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
    });
  },
  showForgotPasswordBox() {
    this.setState({
      showForgotPasswordBox: true,
      showLoginBox: false,
      showResetEmailSent: false
    });
  },
  showLoginBox(e) {
    e.preventDefault();
    this.setState({
      showLoginBox: true,
      showForgotPasswordBox: false,
      showResetEmailSent: false
    });
  },
  statics: {
    renderMainPage(result) {
      window.user = result;
      $("#loginModal").modal("hide");
      ReactDOM.render(
        <Main/>,
        document.getElementById('container')
      );
    }
  },
  render(){
    return (
      <div id="loginModal" className="modal fade" role="dialog" tabIndex="-1">
        <div className="modal-dialog">
          <div className="vid-spinner-bg">
            <div id="circularG">
              <div id="circularG_1" className="circularG"></div>
              <div id="circularG_2" className="circularG"></div>
              <div id="circularG_3" className="circularG"></div>
              <div id="circularG_4" className="circularG"></div>
              <div id="circularG_5" className="circularG"></div>
              <div id="circularG_6" className="circularG"></div>
              <div id="circularG_7" className="circularG"></div>
              <div id="circularG_8" className="circularG"></div>
            </div>
          </div>
          <div className={this.state.showForgotPasswordBox ? "modal-content vid-forgot-password-modal" : "vid-hidden"}>
            <div className="modal-header">
              <button className="close vid-login-close-btn" data-dismiss="modal">&times;</button>
              <p className={this.state.showResetEmailSent ? "vid-hidden" : ""}>enter your account email</p>
              <p className={this.state.showResetEmailSent ? "" : "vid-hidden"}>success</p>
            </div>
            <div className="modal-body">
              <div className={this.state.showResetEmailSent ? "" : "vid-hidden"}>
                <p className="vid-reset-email-sent">a reset password email has been sent to {this.state.resetEmail}</p>
                <button onClick={this.sendPasswordResetEmail} className="btn btn-default vid-login-btn">send again
                </button>
                <button onClick={this.showLoginBox} className="btn btn-default vid-login-btn">login</button>
              </div>
              <form role="form" className={this.state.showResetEmailSent ? "vid-hidden" : ""}>
                <input type="text" onChange={this.setResetEmail} value={this.state.resetEmail}
                       className="form-control vid-input" ref={(v) => this.resetEmail = v} placeholder="email"/>
                <span className={this.state.invalidResetEmail ? 'vid-invalid-input' : 'vid-hidden'}>invalid email</span>
                <span className={this.state.resetEmailNotFound ? "vid-invalid-input" : "vid-hidden"}>email not found</span>
                <br/>
                <button onClick={this.validateResetEmail} className="btn btn-default vid-login-btn">reset
                  password
                </button>
                <button onClick={this.showLoginBox} className="btn btn-default vid-login-btn">cancel</button>
              </form>
            </div>
          </div>
          <div className={this.state.showLoginBox ? "modal-content" : "vid-hidden"}>
            <div className="modal-header">
              <button className="close vid-login-close-btn" data-dismiss="modal">&times;</button>
              <button onClick={this.loginWithFb} className="vid-fb-button">continue with facebook</button>
            </div>
            <div className="modal-body">
              <p className="vid-or-login-with-email">or login with email and password</p>
              <form role="form">
                <input type="text" onChange={this.setEmail} value={this.state.email}
                       className="form-control vid-input" ref={(v) => this.email = v} placeholder="email"/>
                <span className={this.state.invalidEmail ? 'vid-invalid-input' : 'vid-hidden'}>invalid email</span>
                <br/>
                <input type="password" onChange={this.setPass} value={this.state.pass}
                       className="form-control vid-input" ref={(v) => this.pass = v}
                       placeholder="password (atleast 7 characters)"/>
                <span className={this.state.invalidPass ? 'vid-invalid-input' : 'vid-hidden'}>password has fewer than 7 chars</span>
                <br/>
                <button onClick={this.validate} className="btn btn-default vid-login-btn">login</button>
                <span className={this.state.emailPassMatch ? "vid-hidden" : "vid-email-pass-match-error"}>email and password do not match</span>
              </form>
            </div>
            <div className="modal-footer">
              <p className="vid-tos">by logging in you are agreeing to our <a target="_blank" href="tos.html">terms of
                use</a></p>
              <a className="vid-forgot-password" onClick={this.showForgotPasswordBox}>forgot password?</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Login;
