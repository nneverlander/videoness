import React from 'react';
import Header from '../common/header';
import VideoInst from '../common/video';
import fbApp from '../common/fbApp';
import CONSTANTS from '../common/constants';

require('./timeline.css');

var Timeline = React.createClass({
  getInitialState() {
    this.uid = fbApp.auth().currentUser.uid;
    return {
      renderDataMap: new Map()
    }
  },
  getDataFromServer(index) {//todo clear videos array and renderData array?
    var numResultsToFetch;
    if (index == 0) {
      numResultsToFetch = 2;
    }
    else {
      numResultsToFetch = 20;
    }
    //first get metadata from database
    var userVidRef = fbApp.database().ref('userProfiles/' + this.uid + '/videos').orderByChild('addedAt').limitToLast(numResultsToFetch);
    userVidRef.once('value', (snapshot) => {
      console.log('called');
      var masterMap = new Map();
      var masterVideos = [];
      var data = snapshot.val();
      Object.getOwnPropertyNames(data).forEach((val) => {
        masterVideos.push("{\"" + val + "\":" + JSON.stringify(data[val]) + "}"); //todo possible perf improvement
      });
      // now get videos from storage and populate renderData array
      var userStorageRef = fbApp.storage().ref(this.uid);
      for (var i = masterVideos.length; i-- > 0;) {
        var vidData = JSON.parse(masterVideos[i]); //todo possible perf improvement; see videos.push above
        Object.getOwnPropertyNames(vidData).forEach((val) => {
          var vidAuthor = val.split(CONSTANTS.SEPARATOR)[0];
          var vidId = val.split(CONSTANTS.SEPARATOR)[1];
          var renderDataObj = new Map();
          renderDataObj.set("author", vidAuthor);
          masterMap.set(vidId + '.mp4', renderDataObj);
          userStorageRef.child(vidId + '.mp4').getMetadata().then((metadata) => { //todo remove mp4 extension
            masterMap.get(metadata.name).set('src', metadata.downloadURLs[0]); //todo check if metadata has mp4 extension
            this.setState({renderDataMap: masterMap});
          }).catch(function (error) {
            console.log(error.stack);
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
        <VideoInst key={index} vidAuthor={vidVal.get('author')} vidId={videoInst[0]} parent="timeline"
                   src={vidVal.get('src')} onPlay={this.pauseOtherVideos.bind(this, index)}/>
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
