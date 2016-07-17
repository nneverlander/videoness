/**
 * Created by adi on 7/9/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Video from 'react-html5video';

require('react-html5video/dist/ReactHtml5Video.css');
require('./index.css');

var Header = React.createClass({
  render() {
    return (
      <nav className="navbar navbar-fixed-top vid-sticky-header">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand vid-title" href="#">welcome to videoness</a>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#" className="vid-sign-up-login"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
              <li><a href="#" className="vid-sign-up-login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

var Remlife = React.createClass({
  render() {
    return (
      <div>
        <p className="vid-subtitle">to vividly remember life</p>
        <p>
          what were you doing three years ago on this day? right, nobody remembers. but what if you could?
          videoness helps you record your life and makes it searchable. never forget what happened on July 22 2004.
        </p>
        <br/>
      </div>
    );
  }
});

var Ask = React.createClass({
  /*setVolume() {
   this.refs.video.setVolume(0.5);
   },*/
  render() {
    var coolPlace = "<cool place>";
    return (
      <div>
        <p className="vid-subtitle">to see what everyone is upto</p>
        <p>
          bored? curious? need info? see what friends are doing, see what is going on at {coolPlace},
          ask friends to do something that you want to see. like this:
        </p>
        <div className="row">
          <div className="col-md-5">
            <Video ref="video" onLoadStart={this.setVolume} controls loop>
              <source
                src="https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=3577172d-15d5-463d-9a62-bd3f76c3e9c1"/>
            </Video>
          </div>
          <p className="vid-btwText col-md-2">and videoness turns it into awesomeness:</p>
          <div className="jon col-md-5">
            ----Jon Seaton's eyes only----<br/> <br/>
            Jon, the "artified" video should look like this:
            <a target="_blank" href="https://vimeo.com/2810744">vincent van gogh effect</a>
          </div>
        </div>
        <br/>
      </div>
    );
  }
});

var Selfexp = React.createClass({
  render() {
    return (
      <div>
        <p className="vid-subtitle">to express better</p>
        <p>
          i don't like typing (can't even touch type), text is a poor form of self expression. i want my status updates
          and reactions to
          be rich and fun. i want everything in video. i want a social profile of a new kind - one that has only video.
        </p>
      </div>
    );
  }
});

var Main = React.createClass({
  render() {
    return (
      <div>
        <Header/>
        <p className="vid-main-title">why did i build videoness?</p>
        <Remlife/>
        <Ask/>
        <Selfexp/>
      </div>

    );
  }
});

module.exports = Main;

ReactDOM.render(
  <Main/>,
  document.getElementById('container')
);

