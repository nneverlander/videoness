import React from 'react';
import Video from 'react-html5video';
import fbApp from './fbApp';
import CONSTANTS from './constants';

require('react-html5video/dist/ReactHtml5Video.css');
require('./video.css');

var VideoInst = React.createClass({
  getInitialState() {
    this.uid = fbApp.auth().currentUser.uid;
    //todo filename exension crap and split
    this.vidRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/videos/' + this.props.vidAuthor + CONSTANTS.SEPARATOR + this.props.vidId.split('.')[0]);
    this.favRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/favs/' + this.props.vidAuthor + CONSTANTS.SEPARATOR + this.props.vidId.split('.')[0]);
    this.settingsRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/settings');
    return {
      src: '',
      hide: false,
      isFav: false,
      isAddedToTimeline: false,
      isOwn: false
    }
  },
  componentDidMount() {
    this.vidRef.on('value', (snapshot) => {
      this.setState({isAddedToTimeline: snapshot.val()});
    });
    this.favRef.on('value', (snapshot) => {
      this.setState({isFav: snapshot.val()});
    });
    this.setState({isOwn: (this.uid === this.props.vidAuthor)});
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.src != null && this.state.src !== nextProps.src) {
      this.setState({
        src: nextProps.src
      });
    }
  },
  componentWillUnmount() {
    this.vidRef.off();
    this.favRef.off();
  },
  toggleAddToTimeline() { //todo updte metadata on add fav and add timeline and fb share and twitter share etc...
    if (this.state.isAddedToTimeline) {
      this.vidRef.remove();
      if (this.props.parent === 'timeline') { //this check is needed because timeline remove could happen from any page (like places). In that case we don't need to hide it.
        this.setState({hide: true});
      }
    } else {
      this.settingsRef.child('defaultPrivacy').once('value', (privacy) => {
        this.vidRef.set({
          "addedAt": -1 * Date.now(),
          "privacy": privacy.val()
        });
      });
    }
  },
  toggleFav() {
    if (this.state.isFav) {
      this.favRef.remove();
      if (this.props.parent === 'favs') { //this check is needed because fav remove could happen from any page (like places). In that case we don't need to hide it.
        this.setState({hide: true});
      }
    } else {
      this.favRef.set({"addedAt": -1 * Date.now()});
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
    var src = this.state.src === '' ? this.props.src : this.state.src;
    return (
      <div className={this.state.hide ? "vid-hidden" : "vid-video-inst-container"}>
        <Video key={src} className="vid-video-inst" controls loop onPlay={this.props.onPlay}>
          <source src={src}/>
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
             className={this.state.isOwn ? "vid-hidden" : this.state.isAddedToTimeline ? "glyphicon glyphicon-minus vid-sidebar-minus-icon" : "glyphicon glyphicon-plus vid-sidebar-plus-icon"}></i>
        </div>
      </div>
    );
  }
});

module.exports = VideoInst;
