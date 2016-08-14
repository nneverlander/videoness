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
      renderData: [],
      renderDataObjWithVidIds: {}
    };
  },
  getDataFromServer(index) {//todo clear videos array and renderData array?
    var numResultsToFetch;
    if (index == 0) {
      numResultsToFetch = 20;
    }
    else {
      numResultsToFetch = 20;
    }
    //first get metadata from database
    var userVidRef = fbApp.database().ref('userProfiles/' + this.state.uid + '/videos').orderByChild('addedAt').limitToLast(numResultsToFetch);
    userVidRef.on('value', (snapshot) => {
      var data = snapshot.val();
      Object.getOwnPropertyNames(data).forEach((val) => {
        this.state.videos.push("{\"" + val + "\":" + JSON.stringify(data[val]) + "}");
      });
    });
    // now get videos from storage and populate renderData array
    var userStorageRef = fbApp.storage().ref(this.state.uid);
    for (var i = this.state.videos.length; i-- > 0;) {
      var vidData = JSON.parse(this.state.videos[i]);
      Object.getOwnPropertyNames(vidData).forEach((val) => {
        var vidAuthor = val.split(':::')[0];
        var vidId = val.split(':::')[1];
        var renderDataObj = {
          "id": vidId,
          "isOwn": (vidAuthor === this.state.uid),
          "isFav": vidData[val]['isFav']
        };
        this.state.renderDataObjWithVidIds[vidId + '.mp4'] = renderDataObj;
        userStorageRef.child(vidId + '.mp4').getMetadata().then((metadata) => { //todo remove mp4 extension
          var url = metadata.downloadURLs[0];
          var renderDataObjFromMap = this.state.renderDataObjWithVidIds[metadata.name];
          renderDataObjFromMap['src'] = url;
          this.state.renderData.push(renderDataObjFromMap);
        }).catch(function (error) {
          console.log(error);
        });
      });
    }
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
    var videos = this.state.renderData.map((videoInst, index) => {
      return (
        <VideoInst key={index} isOwn={videoInst.isOwn} isFav={videoInst.isFav} isAddedToTimeline={!videoInst.isOwn}
                   id={videoInst.id} src={videoInst.src} onPlay={this.pauseOtherVideos.bind(this, index)}/>
      );
    });
    return (
      <div>
        <Header date="13 Aug 2015"/>
        {videos}
      </div>
    );
  }
});

module.exports = Timeline;
