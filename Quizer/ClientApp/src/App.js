import React, { Component } from 'react';
import Authorization from './components/AdminPage/Authorization/Authorization';
import AdminLayout from "./components/AdminPage/AdminLayout/AdminLayout";
import {Route, Router, Routes, Switch} from "react-router-dom";
import Registration from "./components/AdminPage/Registration/Registration";
import UserPage from "./components/AdminPage/UserPage/UserPage"

export default class App extends Component {

  render() {
      return (
          <AdminLayout>
              <Switch>
                  <Route path="/register" component={Registration} />
                  <Route path="/UserPage/Index" component={UserPage} />
                  <Route path="/" component={Authorization} />
              </Switch>
          </AdminLayout>
    );
  }
}
