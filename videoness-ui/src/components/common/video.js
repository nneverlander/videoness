import React from 'react';
import Video from 'react-html5video';
import fbApp from './fbApp';

require('react-html5video/dist/ReactHtml5Video.css');
require('./video.css');

//todo intermittent video cannot be played in browser

var VideoInst = React.createClass({
  getInitialState() {
    return {
      vidId: this.props.vidId.split('.')[0], //todo filename exension crap
      isFav: this.props.isFav,
      isAddedToTimeline: this.props.isAddedToTimeline
    }
  },
  toggleAddToTimeline() {
    var uid = fbApp.auth().currentUser.uid;
    if (this.state.isAddedToTimeline) {
      fbApp.database().ref('userProfiles/' + uid + '/videos/' + this.props.vidAuthor + ':::' + this.state.vidId).remove().then(() => {
          this.setState({isAddedToTimeline: false});
        })
        .catch(function (error) {
          console.log('removing video from timeline failed' + error);
        });
    } else {
      var addVid = {"addedAt": Date.now()};
      fbApp.database().ref('userProfiles/' + uid + '/videos/' + this.props.vidAuthor + ':::' + this.state.vidId).set(addVid).then(() => {
          this.setState({isAddedToTimeline: true});
        })
        .catch(function (error) {
          console.log('adding video to timeline failed' + error);
        });
    }
  },
  toggleFav() {
    var uid = fbApp.auth().currentUser.uid;
    if (this.state.isFav) {
      fbApp.database().ref('userProfiles/' + uid + '/favs/' + this.props.vidAuthor + ':::' + this.state.vidId).remove().then(() => {
          this.setState({isFav: false});
        })
        .catch(function (error) {
          console.log('removing video from fav failed' + error);
        });
    } else {
      fbApp.database().ref('userProfiles/' + uid + '/favs/' + this.props.vidAuthor + ':::' + this.state.vidId).set(true).then(() => {
          this.setState({isFav: true});
        })
        .catch(function (error) {
          console.log('adding video to fav failed' + error);
        });
    }
  },
  shareOnTwitter(url) {
    var width = screen.width / 3;
    var height = screen.height / 3;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);
    var popup = window.open("https://twitter.com/share?url=https://videoness-68f59.firebaseapp.com&text=This is awesome!", "", "width=" + width + ", height=" + height + ", top=" + top + ", left=" + left);
    if (window.focus) {
      popup.focus();
    }
  },
  shareOnFB(url) {
    FB.ui({
      method: 'share',
      display: 'popup',
      href: 'https://videoness-68f59.firebaseapp.com/'
    }, function (response) {
    });
  },
  render() {
    return (
      <div className="vid-video-inst-container">
        <Video className="vid-video-inst" controls loop onPlay={this.props.onPlay}>
          <source src={this.props.src}/>
        </Video>
        <div className="vid-overlay-sidebar">
          <img data-toggle="tooltip" data-placement="left" title="share on facebook"
               className="vid-overlay-sidebar-button" src="/img/fb.png" onClick={this.shareOnFB}/>
          <img data-toggle="tooltip" data-placement="left" title="share on twitter"
               className="vid-overlay-sidebar-button" src="/img/twitter.png" onClick={this.shareOnTwitter}/>
          <i data-toggle="tooltip" data-placement="left" title={this.state.isFav ? "remove from favs" : "add to favs"}
             onClick={this.toggleFav}
             className={this.state.isFav ? "glyphicon glyphicon-heart vid-sidebar-faved-icon" : "glyphicon glyphicon-heart vid-sidebar-fav-icon"}></i>
          <i data-toggle="tooltip" data-placement="left"
             title={this.state.isAddedToTimeline ? "remove from timeline" : "add to timeline"}
             onClick={this.toggleAddToTimeline}
             className={this.props.isOwn ? "vid-hidden" : this.state.isAddedToTimeline ? "glyphicon glyphicon-minus vid-sidebar-minus-icon" : "glyphicon glyphicon-plus vid-sidebar-plus-icon"}></i>
        </div>
      </div>
    );
  }
});

module.exports = VideoInst;
