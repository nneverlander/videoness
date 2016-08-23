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
    this.userVidRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/videos/' + this.props.vidAuthor + CONSTANTS.SEPARATOR + this.props.vidId.split('.')[0]);
    this.favRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/favs/' + this.props.vidAuthor + CONSTANTS.SEPARATOR + this.props.vidId.split('.')[0]);
    this.settingsRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/settings');
    this.vidMetadataRef = fbApp.database().ref(CONSTANTS.VID_METADATA_REF + '/' + this.props.vidAuthor + '/' + this.props.vidId.split('.')[0] + '/a');
    return {
      src: '',
      hide: false,
      isFav: false,
      isAddedToTimeline: false,
      isOwn: false,
      privacy: CONSTANTS.PRIVACY_ME
    }
  },
  componentDidMount() {
    this.userVidRef.child('addedAt').on('value', (snapshot) => {
      this.setState({isAddedToTimeline: snapshot.val()});
    });
    this.favRef.on('value', (snapshot) => {
      this.setState({isFav: snapshot.val()});
    });
    this.userVidRef.child('privacy').on('value', (snapshot) => {
      this.setState({privacy: snapshot.val()});
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
    this.userVidRef.child('addedAt').off();
    this.userVidRef.child('privacy').off();
    this.favRef.off();
  },
  changePrivacy() {
    if (this.state.privacy === CONSTANTS.PRIVACY_ME) {
      this.userVidRef.child('privacy').set(CONSTANTS.PRIVACY_FRIENDS);
      //todo: can explicitly set state in case server does not respond; this.setState({privacy: CONSTANTS.PRIVACY_FRIENDS});
    } else if (this.state.privacy === CONSTANTS.PRIVACY_FRIENDS) {
      this.userVidRef.child('privacy').set(CONSTANTS.PRIVACY_ALL);
    } else {
      this.userVidRef.child('privacy').set(CONSTANTS.PRIVACY_ME);
    }
  },
  toggleAddToTimeline() {
    if (this.state.isAddedToTimeline) {
      this.userVidRef.remove();
      this.vidMetadataRef.child('timelineAdds').once('value', (timelineAdds) => {
        this.vidMetadataRef.child('timelineAdds').set(timelineAdds.val() - 1);
      });
      if (this.props.parent === 'timeline') { //this check is needed because timeline remove could happen from any page (like places). In that case we don't need to hide it.
        this.setState({hide: true});
      }
    } else {
      this.settingsRef.child('defaultPrivacy').once('value', (privacy) => {
        this.userVidRef.set({
          "addedAt": -1 * Date.now(),
          "privacy": privacy.val()
        });
      });
      this.vidMetadataRef.child('timelineAdds').once('value', (timelineAdds) => {
        this.vidMetadataRef.child('timelineAdds').set(timelineAdds.val() + 1);
      });
    }
  },
  toggleFav() {
    if (this.state.isFav) {
      this.favRef.remove();
      this.vidMetadataRef.child('favs').once('value', (favs) => {
        this.vidMetadataRef.child('favs').set(favs.val() - 1);
      });
      if (this.props.parent === 'favs') { //this check is needed because fav remove could happen from any page (like places). In that case we don't need to hide it.
        this.setState({hide: true});
      }
    } else {
      this.favRef.set({"addedAt": -1 * Date.now()});
      this.vidMetadataRef.child('favs').once('value', (favs) => {
        this.vidMetadataRef.child('favs').set(favs.val() + 1);
      });
    }
  },
  shareOnTwitter() { //todo not updating metadata on twitter share from web since twitter has no support for callbacks on web
    var width = screen.width / 3;
    var height = screen.height / 3;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);
    var hashtags = 'videoness,awesome';
    var popup = window.open("https://twitter.com/share?hashtags=" + hashtags + "&url=" + this.state.src + "&text=This is awesome! ", "", "width=" + width + ", height=" + height + ", top=" + top + ", left=" + left);
    if (window.focus) {
      popup.focus();
    }
  },
  shareOnFB() {
    FB.ui({
      method: 'share',
      display: 'popup',
      quote: 'This is awesome!',
      hashtag: '#videoness',
      href: this.state.src
    }, (response) => {
      if (response && !response.error_code) {
        this.vidMetadataRef.child('fbShares').once('value', (fbShares) => {
          this.vidMetadataRef.child('fbShares').set(fbShares.val() + 1);
        });
      }
    });
  },
  handlePlay() {
    this.props.onPlay();
    this.vidMetadataRef.child('plays').once('value', (plays) => {
      this.vidMetadataRef.child('plays').set(plays.val() + 1);
    });
  },
  render() { //todo timeline adds check original privacy for fb and twitter share
    var src = this.state.src === '' ? this.props.src : this.state.src;
    return (
      <div className={this.state.hide ? "vid-hidden" : "vid-video-inst-container"}>
        <Video key={src} className="vid-video-inst" controls loop onPlay={this.handlePlay}>
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
          <i data-toggle="tooltip" data-placement="left"
             title={this.state.privacy == "me" ? "only you can see this" : this.state.privacy == 'friends' ? "shared with friends" : "shared with everyone"}
             onClick={this.changePrivacy}
             className={this.state.privacy == "me" ? "glyphicon glyphicon-lock vid-sidebar-privacy-icon" : this.state.privacy == 'friends' ? "vid-glyphicon vid-glyphicon-group vid-sidebar-privacy-icon" : "glyphicon glyphicon-globe vid-sidebar-privacy-icon"}></i>
        </div>
      </div>
    );
  }
});

module.exports = VideoInst;
