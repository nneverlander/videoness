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
    this.userVidRef = fbApp.database().ref(CONSTANTS.USER_PROFILE_REF + '/' + this.uid + '/videos');
    this.lastScrollTop = 0; //for detecting scroll direction
    this.masterObj = {};
    this.numNewlyAdded = 0;
    this.newVidsLastShown = 0;
    return {
      showNewVideosButton: false,
      renderDataObj: {}
    }
  },
  handleSnapshot(snapshot) {
    var masterVideos = [];
    var vid = {};
    vid[snapshot.getKey()] = snapshot.val();
    // below hackery is to handle newly added data with newer timestamps
    if (snapshot.val().addedAt < this.lastRetrievedChild) {
      vid[snapshot.getKey()].isNewlyAdded = true;
    } else {
      this.lastRetrievedChild = snapshot.val().addedAt;
      vid[snapshot.getKey()].isNewlyAdded = false;
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
    for (var i = 0, length = masterVideos.length; i < length; i++) {
      var data = masterVideos[i];
      Object.getOwnPropertyNames(data).forEach((propName) => { //there will only be one prop name - vidAuthor:::vidId
        var vidAuthor = propName.split(CONSTANTS.SEPARATOR)[0];
        var vidId = propName.split(CONSTANTS.SEPARATOR)[1];
        var fileName = vidId + '.mp4';//todo remove mp4 extension
        if (this.masterObj[fileName] != null) {
          return; //already exists
        }
        this.masterObj[fileName] = {
          author: vidAuthor,
          addedAt: data[propName].addedAt,
          isNewlyAdded: data[propName].isNewlyAdded
        };
        if (data[propName].isNewlyAdded) {
          this.numNewlyAdded++;
        }
        fbApp.storage().ref(vidAuthor).child(fileName).getMetadata().then((metadata) => {
          var obj = this.masterObj[metadata.name];
          obj.src = metadata.downloadURLs[0]; //todo check if metadata has mp4 extension
          if (obj.isNewlyAdded) {
            if (this.numNewlyAdded > CONSTANTS.NEWLY_ADDED_COUNT &&
              (Date.now() - this.newVidsLastShown > CONSTANTS.SHOW_NEW_VIDS_LAST_SHOWN_DELAY)) { // todo maybe more intelligent criteria
              this.setState({showNewVideosButton: true}, (() => {
                this.newVidsLastShown = Date.now();
                setTimeout((() => {
                  this.setState({showNewVideosButton: false})
                }), 3000); // hide after 3 seconds
              }));
            }
          }
          else {
            this.setState({renderDataObj: this.masterObj});
          }
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
    this.setState({showNewVideosButton: false}); // on scroll show new videos button should disappear
    var scrollTop = evt.srcElement.body.scrollTop;
    if (Math.abs(this.lastScrollTop - scrollTop) <= 50) // sensitivity of scroll in px
      return;
    if (scrollTop > this.lastScrollTop) { //down scroll
      this.userVidRef.orderByChild('addedAt').startAt(this.lastRetrievedChild).limitToFirst(6).once('value', this.handleSnapshotOnScroll);
    } else if (scrollTop == 0) { //at top of page
      this.showNewVideos();
    }
    this.lastScrollTop = scrollTop;
  },
  showNewVideos() {
    this.setState({showNewVideosButton: false});
    this.numNewlyAdded = 0;
    this.setState({renderDataObj: this.masterObj});
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
    var propNames = Object.getOwnPropertyNames(this.state.renderDataObj);
    // sorting so that latest data is on top
    propNames.sort((a, b) => {
      return this.state.renderDataObj[a].addedAt - this.state.renderDataObj[b].addedAt;
    });
    var videos = propNames.map((propName, index) => {
      var vidId = propName;
      var vidVal = this.state.renderDataObj[propName];
      var addedAt = new Date(-1*vidVal.addedAt).customFormat('#MMM# #DD# #YYYY#');
      return (
        <VideoInst key={vidVal.author + vidId} vidAuthor={vidVal.author} vidId={vidId} parentComp="timeline"
                   addedAt={vidVal.addedAt} src={vidVal.src} onPlay={this.pauseOtherVideos.bind(this, index)}
                   setCurrDate={this.setCurrDate.bind(this, addedAt)}/>
      );
    });
    return (
      <div>
        <Header/>
        <div className="vid-date-box">
          <p>{this.state.currDate}</p>
        </div>
        <button onClick={this.showNewVideos}
                className={this.state.showNewVideosButton ? 'btn btn-default vid-show-new-vids-button': 'vid-hidden'}>
          new videos
        </button>
        {videos}
      </div>
    );
  }
});

module.exports = Timeline;
