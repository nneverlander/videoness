import React from 'react';
import Header from '../common/header';
import VideoInst from '../common/video';
import fbApp from '../common/fbApp';


var Main = React.createClass({
  pauseOtherVideos(index) {
    var allVideos = document.getElementsByTagName('video');
    for (var i = 0; i < allVideos.length; i++) {
      if (i == index) continue;
      allVideos[i].pause();
    }
  },
  render() {
    return (
      <div>
        <Header date="13 Aug 2016"/>
        <VideoInst isOwn={true} isFav={false} isAddedToTimeline={false} id="id1"
                   onPlay={this.pauseOtherVideos.bind(this, 0)}
                   src="https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=bdea9c98-80f6-4825-82db-45cb9f503fcd"/>
        <VideoInst isOwn={false} isFav={false} isAddedToTimeline={false} id="id2"
                   onPlay={this.pauseOtherVideos.bind(this, 1)}
                   src="https://firebasestorage.googleapis.com/v0/b/videoness-68f59.appspot.com/o/scottySire.mp4?alt=media&token=bdea9c98-80f6-4825-82db-45cb9f503fcd"/>
      </div>
    );
  }
});

module.exports = Main;

