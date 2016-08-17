import React from 'react';
import Header from '../common/header';
import VideoInst from '../common/video';
import fbApp from '../common/fbApp';
import CONSTANTS from '../common/constants';

require('./timeline.css');

var Timeline = React.createClass({
  getInitialState() {
    this.uid = fbApp.auth().currentUser.uid;
    this.lastRetrievedChild = Number.NEGATIVE_INFINITY;
    this.userVidRef = fbApp.database().ref('userProfiles/' + this.uid + '/videos');
    this.lastScrollTop = 0; //for detecting scroll direction
    /*this.masterObj = new AVLTree((a, b) => { //key is in the form vidID:::addedAt, so comparing based on addedAt
     return a.split(CONSTANTS.SEPARATOR)[1] - b.split(CONSTANTS.SEPARATOR)[1];
     });*/
    this.masterObj = {};
    this.masterArray = [];
    return {
      renderDataArray: []
    }
  },
  handleSnapshot(snapshot) {
    var masterVideos = [];
    var vid = {};
    vid[snapshot.getKey()] = snapshot.val();
    // below hackery is to handle newly added data with newer timestamps
    if (snapshot.val().addedAt < this.lastRetrievedChild) {
      vid[snapshot.getKey()].newChildAdded = true;
    } else {
      this.lastRetrievedChild = snapshot.val().addedAt;
      vid[snapshot.getKey()].newChildAdded = false;
    }
    masterVideos.push(vid);
    this.getVideosFromStorage(masterVideos);
  },
  handleSnapshotOnScroll(snapshot) {
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
      var vid = {};
      vid[propName] = data[propName];
      masterVideos.push(vid);
    });
    this.getVideosFromStorage(masterVideos);
  },
  getVideosFromStorage(masterVideos) {
    var userStorageRef = fbApp.storage().ref(this.uid);
    for (var i = 0, length = masterVideos.length; i < length; i++) {
      var data = masterVideos[i];
      Object.getOwnPropertyNames(data).forEach((propName) => {
        var vidAuthor = propName.split(CONSTANTS.SEPARATOR)[0];
        var vidId = propName.split(CONSTANTS.SEPARATOR)[1];
        var renderDataObj = {
          author: vidAuthor,
          addedAt: data[propName].addedAt
        };
        var fileName = vidId + '.mp4';//todo remove mp4 extension
        var tmp = {};
        tmp[fileName] = renderDataObj;
        if (this.masterObj[fileName] != null) {
          return; //already exists
        }
        this.masterObj[fileName] = renderDataObj;
        if (data[propName].newChildAdded) {
          this.masterArray.unshift(tmp);
        } else {
          this.masterArray.push(tmp);
        }
        userStorageRef.child(fileName).getMetadata().then((metadata) => {
          this.masterObj[metadata.name].src = metadata.downloadURLs[0]; //todo check if metadata has mp4 extension
          this.setState({renderDataArray: this.masterArray});
        }).catch(function (error) {
          console.log(error.stack);
        });
      });
    }
  },
  componentDidMount() {
    this.userVidRef.orderByChild('addedAt').limitToFirst(3).on('child_added', this.handleSnapshot);
    window.addEventListener('scroll', this.handleScroll);
  },
  componentWillUnmount() {
    this.userVidRef.off();
    window.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll(evt) {
    var scrollTop = evt.srcElement.body.scrollTop;
    if (Math.abs(this.lastScrollTop - scrollTop) <= 50) // sensitivity of scroll in px
      return;
    if (scrollTop > this.lastScrollTop) {
      this.userVidRef.orderByChild('addedAt').startAt(this.lastRetrievedChild).limitToFirst(6).once('value', this.handleSnapshotOnScroll);
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
        <VideoInst key={vidVal.author + vidId} vidAuthor={vidVal.author} vidId={vidId} parent="timeline"
                   addedAt={vidVal.addedAt} src={vidVal.src} onPlay={this.pauseOtherVideos.bind(this, index)}/>
      );
    });
    return (
      <div>
        <Header date="13 Aug 2016"/>
        {videos}
      </div>
    );
  }
});

module.exports = Timeline;
