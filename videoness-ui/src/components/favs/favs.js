import React from 'react';
import Header from '../common/header';
import fbApp from '../common/fbApp';
import VideoInst from '../common/video';
import CONSTANTS from '../common/constants';

require('./favs.css');

var Favs = React.createClass({
  getInitialState() {
    this.uid = fbApp.auth().currentUser.uid;
    this.favRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/favs');
    this.userStorageRef = fbApp.storage().ref(this.uid);
    this.masterObj = {};
    this.masterArray = [];
    return {
      renderDataArray: []
    }
  },
  componentDidMount() {
    this.favRef.orderByChild('addedAt').limitToFirst(3).on('child_added', this.handleSnapshot);
    window.addEventListener('scroll', this.handleScroll);
  },
  componentWillUnmount() {
    this.favRef.off();
    window.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll(evt) {
    var scrollTop = evt.srcElement.body.scrollTop;
    if (Math.abs(this.lastScrollTop - scrollTop) <= 50) // sensitivity of scroll in px
      return;
    if (scrollTop > this.lastScrollTop) { //down scroll
      this.favRef.orderByChild('addedAt').startAt(this.lastRetrievedChild).limitToFirst(6).once('value', this.handleSnapshotOnScroll);
    }
    this.lastScrollTop = scrollTop;
  },
  handleSnapshot(snapshot) {
    var masterVideos = [];
    var vid = {};
    vid[snapshot.getKey()] = snapshot.val();
    this.lastRetrievedChild = snapshot.val().addedAt;
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
          addedAt: data[propName].addedAt,
          isNewlyAdded: data[propName].isNewlyAdded
        };
        var tmp = {};
        tmp[fileName] = renderDataObj;
        this.masterObj[fileName] = renderDataObj;
        this.masterArray.push(tmp);
        this.userStorageRef.child(fileName).getMetadata().then((metadata) => {
          var obj = this.masterObj[metadata.name];
          obj.src = metadata.downloadURLs[0]; //todo check if metadata has mp4 extension
          this.setState({renderDataArray: this.masterArray});
        }).catch(function (error) {
          console.log(error.stack);
        });
      });
    }
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
        <VideoInst key={vidVal.author + vidId} vidAuthor={vidVal.author} vidId={vidId} parentComp="favs"
                   addedAt={vidVal.addedAt} src={vidVal.src} onPlay={this.pauseOtherVideos.bind(this,index)}/>
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

module.exports = Favs;
