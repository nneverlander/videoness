import {Route} from 'react-router';
import React from 'react';
import Main from '../main/main';
import Timeline from '../timeline/timeline';
import Places from '../places/places';
import Favs from '../favs/favs';
import Friends from '../friends/friends';
import UserTimeline from '../timeline/userTimeline';

const routes = (
  <div>
    <Route path="/timeline" component={Timeline}/>
    <Route path="/places" component={Places}/>
    <Route path="/favs" component={Favs}/>
    <Route path="/friends" component={Friends}/>
    <Route path="/:user" component={UserTimeline}/>
    <Route path="*" component={Main}/>
  </div>
);

export default routes
