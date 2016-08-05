import React from 'react';
import {Link} from 'react-router';

require("firebase/auth");
require('./header.css');

var Header = React.createClass({
  signOut() {
    firebase.auth().signOut();
  },
  render() {
    return (
      <div>
        <nav className="navbar navbar-fixed-top vid-sticky-header">
          <div className="vid-search-input">
            <div className="input-group">
              <input type="text" className="form-control input-sm" placeholder="search..."/>
              <span className="input-group-btn">
                <button className="btn btn-info btn-sm vid-search-icon" type="button">
                  <i className="glyphicon glyphicon-search"></i>
                </button>
              </span>
            </div>
          </div>
          <div className="vid-user-settings">
            <div className="vid-menu-icon-container">
              <div className="vid-menu-icon"></div>
              <div className="vid-menu-icon"></div>
              <div className="vid-menu-icon"></div>
              <div className="vid-menu-content">
                <p/>
                <Link to="/timeline"><i className="glyphicon glyphicon-film vid-glyphicon"></i>&nbsp;timeline</Link>
                <Link to="/places"><i className="glyphicon glyphicon-globe vid-glyphicon"></i>&nbsp;places</Link>
                <Link to="/favs"><i className="glyphicon glyphicon-heart vid-glyphicon"></i>&nbsp;favorites</Link>
                <Link to="/friends"><i className="glyphicon glyphicon-user vid-glyphicon"></i>&nbsp;friends</Link>
                <a onClick={this.signOut}><i className="glyphicon glyphicon-log-out vid-glyphicon"></i>&nbsp;sign
                  out</a>
              </div>
            </div>
          </div>
        </nav>
        <p className="vid-filler"/>
      </div>
    );
  }
});

module.exports = Header;
