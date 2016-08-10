import React from 'react';
import Header from '../common/header';

require('./friends.css');

var Friend = React.createClass({
  render() {
    return (
      <div onClick={this.props.showFriendsTimeline} className="vid-friend-box row">
        <div className="vid-friend-img-div col-xs-4">
          <img className="vid-friend-img" src="/img/profile.jpg"/>
        </div>
        <div className="col-xs-8">
          <p>name</p>
          <p>other stuff</p>
        </div>
      </div>
    );
  }
});

var Friends = React.createClass({
  showFriendsTimeline(obj) {
    alert(obj);
  },
  render() {
    return (
      <div>
        <Header/>
        <div className="vid-all-friends-box row">
          <div className="col-md-4">
            <Friend showFriendsTimeline={this.showFriendsTimeline.bind(this,"yoyo")}/>
            <Friend/>
            <Friend/>
          </div>
          <div className="col-md-4">
            <Friend/>
            <Friend/>
            <Friend/>
          </div>
          <div className="col-md-4">
            <Friend/>
            <Friend/>
            <Friend/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Friends;
