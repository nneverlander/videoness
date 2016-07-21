import React from 'react';

require('./main.css')
require("firebase/auth");

var Main = React.createClass({
  signOut() {
    firebase.auth().signOut();
  },
  render() {
    return (
      <div>
        <p className="vid-main-title">let this day have a page in history</p>
        <button type="submit" onClick={this.signOut} className="btn btn-default vid-logout-btn">logout</button>
      </div>

    );
  }
});

module.exports = Main;
