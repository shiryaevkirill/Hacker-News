import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import MainPage from './components/MainPage';
import NewsPage from './components/NewsPage';
import './index.css';
import MainLayout from './components/MainLayout';
import Store from './stores/Store';

const appStore = new Store();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout content={<MainPage store={appStore}/>}/>}/>
        <Route path='/news-page/:id' element={<MainLayout content={<NewsPage store={appStore}/>}/>}/>
        <Route path='*' element={<MainLayout content={<MainPage store={appStore}/>}/>}/>
      </Routes>
  </BrowserRouter>
);


reportWebVitals();
