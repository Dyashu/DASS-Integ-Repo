import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AdminConfigPage from './UserPage';
import reportWebVitals from './reportWebVitals';
import Navbar from './Navbar2';
import RightSideContainer from './AddNew'
import NavBar from './Navbar3'
import DisplaySavePage from './DisplaySavePage'
import { BrowserRouter, Routes ,Route, Link } from 'react-router-dom';
import DisplayPublishPage from './DisplayPublishPage';
import ParallaxScroll from './parallax'
import NewsPage from './news'
import EventsPage from './EditEvents'
// import EventsPage from './events'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/admin-config' element={<AdminConfigPage/>}/>
      <Route path='/user-end' element={<ParallaxScroll/>}/>
      <Route path='/add-new/' element={<RightSideContainer/>}/>
      <Route path='/display-publish/:pageid' element={<DisplayPublishPage/>}/>
      <Route path='/display-save/:pageid' element={<DisplaySavePage/>}/>
      <Route path='/display-parallax' element={<ParallaxScroll/>}/>
      <Route path='/view-all-news' element={<NewsPage/>}/>
      <Route path='/view-all-events' element={<EventsPage/>}/>

      {/* Default route */}
      <Route path='/' element={<AdminConfigPage/>}/>
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();