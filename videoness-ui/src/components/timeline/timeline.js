import React from 'react';
import Header from '../common/header';
import VideoInst from '../common/video';
import fbApp from '../common/fbApp';

require('./timeline.css');

var Timeline = React.createClass({
  getInitialState() {
    return {
      uid: fbApp.auth().currentUser.uid,
      videos: [],
      renderDataMap: new Map()
    }
  },
  getDataFromServer(index) {//todo clear videos array and renderData array?
    var masterMap = new Map();
    var numResultsToFetch;
    if (index == 0) {
      numResultsToFetch = 2;
    }
    else {
      numResultsToFetch = 20;
    }
    //first get metadata from database
    var userVidRef = fbApp.database().ref('userProfiles/' + this.state.uid + '/videos').orderByChild('addedAt').limitToLast(numResultsToFetch);
    userVidRef.on('value', (snapshot) => {
      var data = snapshot.val();
      Object.getOwnPropertyNames(data).forEach((val) => {
        this.state.videos.push("{\"" + val + "\":" + JSON.stringify(data[val]) + "}"); //todo possible perf improvement
      });
      // now get videos from storage and populate renderData array
      var userStorageRef = fbApp.storage().ref(this.state.uid);
      for (var i = this.state.videos.length; i-- > 0;) {
        var vidData = JSON.parse(this.state.videos[i]); //todo possible perf improvement; see videos.push above
        Object.getOwnPropertyNames(vidData).forEach((val) => {
          var vidAuthor = val.split(':::')[0];
          var vidId = val.split(':::')[1];
          var renderDataObj = new Map();
          renderDataObj.set("isOwn", (vidAuthor === this.state.uid));
          renderDataObj.set("isFav", vidData[val]['isFav']);
          renderDataObj.set("author", vidAuthor);
          masterMap.set(vidId + '.mp4', renderDataObj);
          userStorageRef.child(vidId + '.mp4').getMetadata().then((metadata) => { //todo remove mp4 extension
            masterMap.get(metadata.name).set('src', metadata.downloadURLs[0]); //todo check if metadata has mp4 extension
            this.setState({renderDataMap: masterMap});
          }).catch(function (error) {
            console.log(error);
          });
        });
      }
    });
  },
  componentWillMount() {
    this.getDataFromServer(0);
  },
  componentDidMount() {

  },
  pauseOtherVideos(index) {
    var allVideos = document.getElementsByTagName('video');
    for (var i = 0; i < allVideos.length; i++) {
      if (i == index) continue;
      allVideos[i].pause();
    }
  },
  render() {
    var videos = [...this.state.renderDataMap.entries()].map((videoInst, index) => {
      var vidVal = videoInst[1];
      return (
        <VideoInst key={index} isOwn={vidVal.get('isOwn')} isFav={vidVal.get('isFav')}
                   vidAuthor={vidVal.get('author')} isAddedToTimeline={!vidVal.get('isOwn')}
                   vidId={videoInst[0]} src={vidVal.get('src')} onPlay={this.pauseOtherVideos.bind(this, index)}/>
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
