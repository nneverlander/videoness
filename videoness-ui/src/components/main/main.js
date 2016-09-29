import React from 'react';
import Header from '../common/header';
import VideoInst from '../common/video';
import fbApp from '../common/fbApp';
import CONSTANTS from '../common/constants';

require('./main.css');

var Main = React.createClass({
  getInitialState() {
    this.uid = fbApp.auth().currentUser.uid;
    this.lastRetrievedChild = Number.NEGATIVE_INFINITY;
    this.userVidRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/videos');
    this.lastScrollTop = 0; //for detecting scroll direction
    this.masterObj = {};
    this.numNewlyAdded = 0;
    this.newVidsLastShown = 0;
    return {
      currDate: '',
      showNewVideosButton: false,
      renderDataObj: {}
    }
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
    var vidAuthor = 'lIOgT8uvUAeRRupQaAr0tzCqaWx1';
    var vidId = 'scottySire';
    var addedAt = new Date(1472343171627).customFormat('#MMM# #DD# #YYYY#');
    var src = 'https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=bdea9c98-80f6-4825-82db-45cb9f503fcd';
    return (
      <div>
        <Header/>
        <div className="vid-date-box">
          <p>{this.state.currDate}</p>
        </div>
        <VideoInst key={vidAuthor + vidId + 0} vidAuthor={vidAuthor} vidId={vidId} parentComp="main"
                   addedAt={addedAt} src={src} onPlay={this.pauseOtherVideos.bind(this, 0)}
                   setCurrDate={this.setCurrDate.bind(this, addedAt)}/>
        <VideoInst key={vidAuthor + vidId + 1} vidAuthor={vidAuthor} vidId={vidId} parentComp="main"
                   addedAt={addedAt} src={src} onPlay={this.pauseOtherVideos.bind(this, 1)}
                   setCurrDate={this.setCurrDate.bind(this, addedAt)}/>
         <VideoInst key={vidAuthor + vidId + 2} vidAuthor={vidAuthor} vidId={vidId} parentComp="main"
                   addedAt={addedAt} src={src} onPlay={this.pauseOtherVideos.bind(this, 2)}
                   setCurrDate={this.setCurrDate.bind(this, addedAt)}/>
      </div>
    );
  }
});

module.exports = Main;
