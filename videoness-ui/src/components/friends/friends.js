import React from 'react';
import Header from '../common/header';
import fbApp from '../common/fbApp';
import { Link } from 'react-router';
import routes from '../common/routes';
import CONSTANTS from '../common/constants';

require('../common/common');
require('./friends.css');

var Friend = React.createClass({
  render() {
    return (
      <div className="vid-friend-box row">
        <div className="vid-friend-img-div col-xs-4">
          <img className="vid-friend-img" src={this.props.photoUrl}/>
        </div>
        <div className="col-xs-8">
          <p>{this.props.name}</p>
          <p>friends since: {this.props.addedAt}</p>
        </div>
      </div>
    );
  }
});

var Friends = React.createClass({
  getInitialState() {
    this.uid = fbApp.auth().currentUser.uid;
    this.friendsRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/friends');
    this.allFriendsArray = [];
    this.lastRetrievedChild = Number.NEGATIVE_INFINITY;
    this.lastRetrievedChildId = '';
    this.lastScrollTop = 0;
    return {
      friendsArray: []
    }
  },
  componentDidMount() {
    this.friendsRef.limitToFirst(20).once('value', this.handleSnapshot);
    window.addEventListener('scroll', this.handleScroll);
  },
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll(evt) {
    var scrollTop = evt.srcElement.body.scrollTop;
    if (Math.abs(this.lastScrollTop - scrollTop) <= 50) // sensitivity of scroll in px
      return;
    if (scrollTop > this.lastScrollTop) { //down scroll
      this.friendsRef.orderByChild('addedAt').startAt(this.lastRetrievedChild).limitToFirst(20).once('value', this.handleSnapshot);
    }
    this.lastScrollTop = scrollTop;
  },
  handleSnapshot(snapshot) {
    var data = snapshot.val();
    var propNames = Object.getOwnPropertyNames(data);
    // sorting so that latest added friend is on top
    propNames.sort((a, b) => {
      return data[a].addedAt - data[b].addedAt;
    });
    propNames.forEach((propName, index) => {
      if (propName === this.lastRetrievedChildId) {
        return; // already exists
      }
      if (index == propNames.length - 1) {
        this.lastRetrievedChild = data[propName].addedAt;
        this.lastRetrievedChildId = propName;
      }
      var friend = {
        addedAt: data[propName].addedAt,
        name: data[propName].name,
        email: data[propName].email,
        photoUrl: data[propName].photoUrl
      };
      var tmp = {};
      tmp[propName] = friend;
      this.allFriendsArray.push(tmp);
    });
    this.setState({friendsArray: this.allFriendsArray});
  },
  render() {
    var friends = this.state.friendsArray.map((friend) => {
      var friendId = '';
      var friendVal = {};
      Object.getOwnPropertyNames(friend).forEach((propName) => {
        friendId = propName;
        friendVal = friend[propName];
      });
      var addedAt = new Date(friendVal.addedAt).customFormat('#MMM# #DD# #YYYY#');
      return (
        <Link key={friendId} to={'/' + friendId}><Friend parent="friends" name={friendVal.name}
                                                photoUrl={friendVal.photoUrl} addedAt={addedAt}/></Link>
      );
    });
    var col1 = [];
    var col2 = [];
    var col3 = [];
    for (var i = 0, length = friends.length; i < length; i++) {
      if (i % 3 == 0) {
        col3.push(friends[i]);
      } else if (i % 2 == 0) {
        col2.push(friends[i]);
      } else {
        col1.push(friends[i]);
      }
    }
    return (
      <div>
        <Header/>
        <div className="vid-all-friends-box row">
          <div className="col-md-4">
            {col1}
          </div>
          <div className="col-md-4">
            {col2}
          </div>
          <div className="col-md-4">
            {col3}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Friends;
