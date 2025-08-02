
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Profile from './components/Profile';
import SignUp from './components/Signup';
import Feed from './components/Feed';
import ReceivedRequests from './components/ReceivedRequests';
import Connections from './components/Connections';
import { Provider } from 'react-redux';
import appStore from './components/utils/appStore';

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Feed />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
          <Route path="connections" element={<Connections />} />
          <Route path="ReceivedRequests" element={<ReceivedRequests />} />
                    <Route path="SignUp" element={<SignUp />} />


 
           </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
