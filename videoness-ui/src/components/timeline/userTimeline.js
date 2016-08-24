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
    this.userStorageRef = fbApp.storage().ref(this.uid);
    this.lastScrollTop = 0; //for detecting scroll direction
    this.masterArray = [];
    this.masterObj = {};
    return {
      areFriends: false,
      renderDataArray: []
    }
  },
  handleSnapshot(snapshot) {
    var masterVideos = [];
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
      var privacy = this.userVidRef.child('privacy');
      if (privacy === CONSTANTS.PRIVACY_ME) {
        return;
      } else if (privacy === CONSTANTS.PRIVACY_FRIENDS && !this.state.areFriends) {
        return;
      }
      var vid = {};
      vid[propName] = data[propName];
      masterVideos.push(vid);
    });
    this.getVideosFromStorage(masterVideos);
  },
  getVideosFromStorage(masterVideos) {
    for (var i = 0, length = masterVideos.length; i < length; i++) {
      var data = masterVideos[i];
      Object.getOwnPropertyNames(data).forEach((propName) => { //there will only be one prop name - vidAuthor:::vidId
        var vidAuthor = propName.split(CONSTANTS.SEPARATOR)[0];
        var vidId = propName.split(CONSTANTS.SEPARATOR)[1];
        var fileName = vidId + '.mp4';//todo remove mp4 extension
        if (this.masterObj[fileName] != null) {
          return; //already exists
        }
        var renderDataObj = {
          author: vidAuthor,
          addedAt: data[propName].addedAt
        };
        var tmp = {};
        tmp[fileName] = renderDataObj;
        this.masterObj[fileName] = renderDataObj;
        this.masterArray.push(tmp);
        this.userStorageRef.child(fileName).getMetadata().then((metadata) => {
          this.masterObj[metadata.name].src = metadata.downloadURLs[0]; //todo check if metadata has mp4 extension
          this.setState({renderDataArray: this.masterArray});
        }).catch(function (error) {
          console.log(error.stack);
        });
      });
    }
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
  render() {
    var videos = this.state.renderDataArray.map((videoInst, index) => {
      var vidId = '';
      var vidVal = {};
      Object.getOwnPropertyNames(videoInst).forEach((propName) => {
        vidId = propName;
        vidVal = videoInst[propName];
      });
      return (
        <VideoInst key={vidVal.author + vidId} vidAuthor={vidVal.author} vidId={vidId} parentComp="userTimeline"
                   addedAt={vidVal.addedAt} src={vidVal.src} onPlay={this.pauseOtherVideos.bind(this, index)}/>
      );
    });
    return (
      <div>
        <Header/>
        <div className="vid-date-box">
          <p>13 aug 2016</p>
        </div>
        {videos}
      </div>
    );
  }
});

module.exports = UserTimeline;
