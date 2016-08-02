import React from 'react';
import Video from 'react-html5video';

require('react-html5video/dist/ReactHtml5Video.css');
require('./main.css')
require("firebase/auth");

var Header = React.createClass({
  signOut() {
    firebase.auth().signOut();
  },
  render() {
    return (
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
              <a><i className="glyphicon glyphicon-film vid-glyphicon"></i>timeline</a>
              <a><i className="glyphicon glyphicon-heart vid-glyphicon"></i>favorites</a>
              <a onClick={this.signOut}><i className="glyphicon glyphicon-log-out vid-glyphicon"></i>sign out</a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
});

var VideoInst = React.createClass({
  render() {
    return (
      <div className="vid-video-inst-container">
        <Video className="vid-video-inst" controls loop height="400">
          <source
            src="https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=3577172d-15d5-463d-9a62-bd3f76c3e9c1"/>
        </Video>
      </div>
    );
  }
});

var Main = React.createClass({
  render() {
    return (
      <div>
        <Header/>
        <VideoInst/>
        <VideoInst/>
      </div>

    );
  }
});

module.exports = Main;
