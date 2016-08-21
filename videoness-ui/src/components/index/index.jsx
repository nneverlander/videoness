/**
 * Created by adi on 7/9/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Video from 'react-html5video';
import Login from '../login/login';
import fbApp from '../common/fbApp';
import routes from '../common/routes';
import {Router, browserHistory} from 'react-router';

require('react-html5video/dist/ReactHtml5Video.css');
require('./index.css');

var Header = React.createClass({
  render() {
    return (
      <nav className="navbar navbar-fixed-top vid-sticky-header">
        <a className="navbar-brand vid-title" href="#">let this day have a beautiful page in history</a>
        <a data-toggle="modal" href="#loginModal" className="navbar-brand vid-login"><span
          className="glyphicon glyphicon-user"></span> login</a>
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
          videoness helps you record your life in videos and makes it searchable. think snapchat stories on steroids.
          never forget what happened on July 22 2004. let everyday of your life have a page in history.
        </p>
        <br/>
      </div>
    );
  }
});

var Ask = React.createClass({
  /*setVolume() {
   this.scottySire.setVolume(0.5);
   },*/
  render() {
    return (
      <div>
        <p className="vid-subtitle">to ask your friends do funny stuff</p>
        <p>
          you like watching videos shared by your friends. but you don't know what they will share. with videoness, you
          can
          ask them to do something that you want to see. like this:
        </p>
        <div className="row">
          <div className="col-md-5">
            <Video className="vid-video" ref={(v) => this.scottySire = v} onLoadStart={this.setVolume} controls loop>
              <source
                src="https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=bdea9c98-80f6-4825-82db-45cb9f503fcd"/>
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
          and reactions to be rich and fun. i want everything in video. i want a social profile of a new kind - one that
          has only video.
        </p>
      </div>
    );
  }
});

var Index = React.createClass({
  render() {
    return (
      <div>
        <Header/>
        <Login/>
        <p className="vid-main-title">why did i build videoness?</p>
        <Remlife/>
        <Ask/>
        <Selfexp/>
      </div>

    );
  }
});

function initApp() {
  fbApp.auth().onAuthStateChanged((user) => {
    if (user) {
      ReactDOM.render(
        <Router history={browserHistory} routes={routes}/>,
        document.getElementById('container')
      );
    } else {
      ReactDOM.render(
        <Index/>,
        document.getElementById('container')
      );
    }
  });
}

window.onload = function () {
  initApp();
  $('[data-toggle="tooltip"]').tooltip();
};

module.exports = Index;

