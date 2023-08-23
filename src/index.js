import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const initialState = {};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    // 리듀서 함수
    default:
      return state;
  }
}
const store = configureStore({
    reducer: rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </Provider>
);

reportWebVitals();