import React from 'react';
import Header from '../common/header';
import VideoInst from '../common/video';
import fbApp from '../common/fbApp';
import CONSTANTS from '../common/constants';

require('./timeline.css');

var UserTimeline = React.createClass({
  getInitialState() {
    this.uid = this.props.params.user;
    this.lastRetrievedChild = Number.NEGATIVE_INFINITY;
    this.userVidRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/videos');
    this.lastScrollTop = 0; //for detecting scroll direction
    this.masterObj = {};
    return {
      areFriends: false,
      renderDataObj: {}
    }
  },
  handleSnapshot(snapshot) {
    var data = snapshot.val();
    var propNames = Object.getOwnPropertyNames(data);
    // sorting so that latest data is on top
    propNames.sort((a, b) => {
      return data[a].addedAt - data[b].addedAt;
    });
    propNames.forEach((propName, index) => {
      if (index == propNames.length - 1) {
        this.lastRetrievedChild = data[propName].addedAt;
      }
      //check privacy
      this.userVidRef.child(propName).child('privacy').once('value', (privacy) => {
        if (privacy.val() === CONSTANTS.PRIVACY_ME) {
          return;
        } else if (privacy.val() === CONSTANTS.PRIVACY_FRIENDS && !this.state.areFriends) {
          return;
        }
        var vid = {};
        vid[propName] = data[propName];
        this.getVideoFromStorage(vid);
      });
    });
  },
  getVideoFromStorage(vid) {
    Object.getOwnPropertyNames(vid).forEach((propName) => { //there will only be one prop name - vidAuthor:::vidId
      var vidAuthor = propName.split(CONSTANTS.SEPARATOR)[0];
      var vidId = propName.split(CONSTANTS.SEPARATOR)[1];
      var fileName = vidId + '.mp4';//todo remove mp4 extension
      if (this.masterObj[fileName] != null) {
        return; //already exists
      }
      this.masterObj[fileName] = {
        author: vidAuthor,
        addedAt: vid[propName].addedAt
      };
      fbApp.storage().ref(vidAuthor).child(fileName).getMetadata().then((metadata) => {
        this.masterObj[metadata.name].src = metadata.downloadURLs[0]; //todo check if metadata has mp4 extension
        this.setState({renderDataObj: this.masterObj});
      }).catch(function (error) {
        console.log(error.stack);
      });
    });
  },
  componentDidMount() {
    // check if friends
    fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + fbApp.auth().currentUser.uid + '/friends/' + this.uid).once('value', (snapshot) => {
      if (snapshot.val() != null) {
        this.setState({areFriends: true});
      }
    });
    this.userVidRef.orderByChild('addedAt').limitToFirst(3).once('value', this.handleSnapshot);
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
      this.userVidRef.orderByChild('addedAt').startAt(this.lastRetrievedChild).limitToFirst(6).once('value', this.handleSnapshot);
    }
    this.lastScrollTop = scrollTop;
  },
  pauseOtherVideos(index) {
    var allVideos = document.getElementsByTagName('video');
    for (var i = 0; i < allVideos.length; i++) {
      if (i == index) continue;
      allVideos[i].pause();
    }
  },
  setCurrDate(date) {
    this.setState({currDate: date});
  },
  render() {
    var propNames = Object.getOwnPropertyNames(this.state.renderDataObj);
    // sorting so that latest data is on top
    propNames.sort((a, b) => {
      return this.state.renderDataObj[a].addedAt - this.state.renderDataObj[b].addedAt;
    });
    var videos = propNames.map((propName, index) => {
      var vidId = propName;
      var vidVal = this.state.renderDataObj[propName];
      var addedAt = new Date(-1*vidVal.addedAt).customFormat('#MMM# #DD# #YYYY#');
      return (
        <VideoInst key={vidVal.author + vidId} vidAuthor={vidVal.author} vidId={vidId} parentComp="userTimeline"
                   addedAt={vidVal.addedAt} src={vidVal.src} onPlay={this.pauseOtherVideos.bind(this, index)}
                   setCurrDate={this.setCurrDate.bind(this, addedAt)}/>
      );
    });
    return (
      <div>
        <Header/>
        <div className="vid-date-box">
          <p>{this.state.currDate}</p>
        </div>
        {videos}
      </div>
    );
  }
});

module.exports = UserTimeline;
