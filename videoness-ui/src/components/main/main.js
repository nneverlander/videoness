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
              <a><i className="glyphicon glyphicon-film vid-glyphicon"></i>&nbsp;timeline</a>
              <a><i className="glyphicon glyphicon-globe vid-glyphicon"></i>&nbsp;places</a>
              <a><i className="glyphicon glyphicon-heart vid-glyphicon"></i>&nbsp;favorites</a>
              <a><i className="glyphicon glyphicon-user vid-glyphicon"></i>&nbsp;friends</a>
              <a onClick={this.signOut}><i className="glyphicon glyphicon-log-out vid-glyphicon"></i>&nbsp;sign out</a>
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
        <Video className="vid-video-inst" controls loop onPlay={this.props.onPlay}>
          <source src={this.props.src}/>
        </Video>
        <div className="vid-overlay-sidebar">
          <img className="vid-overlay-sidebar-button" src="img/fb.png" onClick={this.props.shareOnFB}/>
          <img className="vid-overlay-sidebar-button" src="img/twitter.png" onClick={this.props.shareOnTwitter}/>
          <i onClick={this.props.addToFavs} className="glyphicon glyphicon-heart vid-sidebar-fav-icon"></i>
        </div>
      </div>
    );
  }
});

var Main = React.createClass({
  addToFavs(id) {

  },
  shareOnTwitter(url) {
    var width = screen.width/2;
    var height = screen.height/2;
    var left = (screen.width/2)-(width/2);
    var top = (screen.height/2)-(height/2);
    var popup = window.open("https://twitter.com/share?url=https://videoness-68f59.firebaseapp.com&text=This is awesome!", "", "width="+width+", height="+height+", top="+top+", left="+left);
    if (window.focus) {
      popup.focus();
    }
  },
  shareOnFB(url) {
    FB.ui({
      method: 'share',
      display: 'popup',
      href: 'https://videoness-68f59.firebaseapp.com/'
    }, function (response) {
    });
  },
  pauseOtherVideos(index) {
    var allVideos = document.getElementsByTagName('video');
    for (var i = 0; i < allVideos.length; i++) {
      if (i == index) continue;
      allVideos[i].pause();
    }
  },
  render() {
    return (
      <div>
        <Header/>
        <p className="vid-filler"/>
        <VideoInst addToFavs={this.addToFavs.bind(this, "id")} shareOnTwitter={this.shareOnTwitter.bind(this, "url")}
                   shareOnFB={this.shareOnFB.bind(this, "url")} onPlay={this.pauseOtherVideos.bind(this, 0)}
                   src="https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=3577172d-15d5-463d-9a62-bd3f76c3e9c1"/>
        <VideoInst addToFavs={this.addToFavs.bind(this, "id")} shareOnTwitter={this.shareOnTwitter.bind(this, "url")}
                   shareOnFB={this.shareOnFB.bind(this, "url")} onPlay={this.pauseOtherVideos.bind(this, 1)}
                   src="https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=3577172d-15d5-463d-9a62-bd3f76c3e9c1"/>
      </div>
    );
  }
});

module.exports = Main;

