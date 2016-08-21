import React from 'react';
import Header from '../common/header';
import fbApp from '../common/fbApp';

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
  getInitialState() {
    this.uid = fbApp.auth().currentUser.uid;
    this.friendsRef = fbApp.database().ref('userProfiles/' + this.uid + '/friends');
    this.allFriendsObj = {};
    this.allFriendsArray = [];
    return {
      friendsArray: []
    }
  },
  componentWillMount() {
    this.friendsRef.once('value', (snapshot) => { //todo pagination? if the friends list is too large
      var data = snapshot.val();
      var propNames = Object.getOwnPropertyNames(data);
      // sorting so that latest added friend is on top
      propNames.sort((a, b) => {
        return data[a].addedAt - data[b].addedAt;
      });
      propNames.forEach((propName) => {
        var friend = {
          addedAt: data[propName].addedAt
        };
        var tmp = {};
        tmp[propName] = friend;
        this.allFriendsObj[propName] = friend;
        this.allFriendsArray.push(tmp);
        var friendProfileRef =fbApp.database().ref('userProfiles/' + propName);
        var friendEmail = '';
        friendProfileRef.child('email').once('value', (email) => {
          console.log(email.parent);
          friendEmail = email.val();
        });
        var friendName = '';
        friendProfileRef.child('name').once('value', (name) => {
          friendName = name.val();
        });
        var friendPhotoUrl = '';
        friendProfileRef.child('photoUrl').once('value', (photoUrl) => {
          friendPhotoUrl = photoUrl.val();
        });
      });
      this.setState({friendsArray: this.allFriendsArray});
    });
  },
  showFriendsTimeline(obj) {
    alert(obj);
  },
  render() {
    var friends = this.state.friendsArray.map((videoInst, index) => {
      var vidId = '';
      var vidVal = {};
      Object.getOwnPropertyNames(videoInst).forEach((propName) => {
        vidId = propName;
        vidVal = videoInst[propName];
      });
      return (
        <VideoInst key={vidVal.author + vidId} vidAuthor={vidVal.author} vidId={vidId} parent="timeline"
                   addedAt={vidVal.addedAt} src={vidVal.src} onPlay={this.pauseOtherVideos.bind(this, index)}/>
      );
    });
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
