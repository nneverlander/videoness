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
import CONSTANTS from '../common/constants';

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

var PullBased = React.createClass({
  render() {
    return (
      <div>
        <p className="vid-subtitle">because we think the opposite</p>
        <p>
          with videoness we are turning the prevalent way of watching video on its head - instead of watching the content 'pushed' to you, you would be 'pulling' the content you want to watch on demand. we are creating a whole new category of video consumption on the internet - one that is pull-based. two possible products in this category:
        </p>
        <br/>
      </div>
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
          videoness helps you record your life in videos and makes it searchable. think snapchat memories on steroids.
          never forget what happened on July 22 2004. let everyday of your life have a page in history.
        </p>
        <br/>
      </div>
    );
  }
});

var LocVideo = React.createClass({
  render() {
    return (
      <div>
        <p className="vid-subtitle">see what's going on at any place on demand</p>
        <p>
          you want to know how your favorite bar is looking right now. just send out a request using the app. your request will be sent to people who are currently at that location asking them to shoot a short video for you.
        </p>
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
        <p className="vid-subtitle">ask/dare your friends do funny stuff</p>
        <p>
          you like watching videos shared by your friends. but you don't know what they will share. with videoness, you can
          ask them to do something that you want to see. like this:
        </p>
        <div className="row">
          <div className="col-md-12">
            <Video className="vid-video" ref={(v) => this.scottySire = v} onLoadStart={this.setVolume} controls loop>
              <source
                src="https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=bdea9c98-80f6-4825-82db-45cb9f503fcd"/>
            </Video>
          </div>
        </div>
        <br/>
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
        <p className="vid-main-title">why did we build videoness?</p>
        <PullBased/>
        <LocVideo/>
        <Ask/>
      </div>

    );
  }
});

function initApp() {
  fbApp.auth().onAuthStateChanged((user) => {
    if (user) {
      var name = user.displayName;
      var email = user.email;
      var uid = user.uid;
      var photoUrl = user.photoURL;
      fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + uid + '/email').once('value', ((snapshot) => {
        if (snapshot.val() == null) { //user profile doesn't exist
          fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/'  + uid).set({"name": name, "email": email, "photoUrl": photoUrl});
        }
      }));
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
};

module.exports = Index;
