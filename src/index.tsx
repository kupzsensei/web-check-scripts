// import React, { createContext } from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const MyContext = createContext<object | undefined>()

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
  
//   <React.StrictMode>
//     <MyContext.Provider value={}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//     </MyContext.Provider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// index.tsx or index.jsx (with TypeScript)
import React, { createContext, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Define the type of your context data
type MyContextType = {
  data: Array<object>;
  setData: React.Dispatch<React.SetStateAction<object[]>>;
};


// Create the context with default undefined for safety
export const MyContext = createContext<MyContextType | undefined>(undefined);

// Provider component
const MyProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Array<object>>([]);

  return (
    <MyContext.Provider value={{ data, setData }}>
      {children}
    </MyContext.Provider>
  );
};

// Main render
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MyProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MyProvider>
  </React.StrictMode>
);

// Web vitals
reportWebVitals();
