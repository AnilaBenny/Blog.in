import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import App from './App';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import { PrivateRoute, PublicRoute } from './PrivateRoute/PrivateRoute';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';
import AccountDetailPage from './pages/AccountDetailPage';
import CreateBLogPage from './components/WriteBlog/BlogForm';
import SingleBlogPage from './pages/SingleBlogPage';

const allRoutes = (
  <Route path='/' element={<App />}>
    <Route element={<PublicRoute />}>
    <Route index={true} element={<LoginPage/>}></Route>
    <Route path='/register' element={<RegistrationPage/>}/>
    </Route>
    <Route element={<PrivateRoute/>}>
    <Route path='/home' element={<HomePage/>}/>
    <Route path='/account' element={<AccountDetailPage/>}/>
    <Route path='/write' element={<CreateBLogPage/>}/>
    <Route path='/blog' element={<SingleBlogPage/>}/>
    
    </Route>
  </Route>)
  const router = createBrowserRouter(createRoutesFromElements(allRoutes))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);