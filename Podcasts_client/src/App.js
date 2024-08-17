import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import AppRouter from './routes/client/router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthProviderClient } from './pages/client/login/AuthContext';
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    font-family: 'Roboto', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    width: 100%;
  }

  code {
    font-family: 'Courier New', monospace;
  }
`;

function App() {
  return (

      <BrowserRouter>
        <GlobalStyle />
        <div className="App">
          <Routes>
        
                <Route
            path="/*"
            element={
              <AuthProviderClient>
                <AppRouter />
              </AuthProviderClient>
            }
          />
          </Routes>
        </div>
      </BrowserRouter>

  );
}

export default App;
