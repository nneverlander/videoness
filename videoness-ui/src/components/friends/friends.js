import React from 'react';
import Header from '../common/header';

require('./friends.css');

var Friends = React.createClass({
  render() {
    return (
      <div>
        <Header/>
        friends
      </div>
    );
  }
});

module.exports = Friends;
