import 'antd/dist/antd.css';
import './App.css'
import { Trans, useTranslation } from "react-i18next";
import Product from './pages/Product';
import Customer from './pages/Customer';
import Enter from './pages/Enter';
import Download from './pages/Download';
import Settlement from './pages/Settlements';
import Supply from './pages/Supply';
import Demand from './pages/Demand';
import SalePoint from './pages/SalePoint'
import Loss from './pages/Loss';
import CreateStock from './pages/CreateStock';
import Move from './pages/Move';
import Transaction from './pages/Transaction';
import CreatePaymentOut from './pages/CreatePaymentOut';
import CreatePaymentIn from './pages/CreatePaymentIn';
import bc from './Check.js/bc';
import Sale from './pages/Sales';
import check80 from './Check.js/check80';
import EditSale from './pages/EditSale'
import Cashin from './pages/Cashins';
import Cashout from './pages/Cashouts';
import Profile from './pages/Profile';
import Return from './pages/Returns';
import DemandReturn from './pages/DemandReturn';
import Login from './pages/Login'
import StockBalance from './pages/StockBalance';
import CreateProduct from './pages/CreateProduct';
import CreateCustomer from './pages/CreateCustomer';
import CreateEnter from './pages/CreateEnter'
import CreateSupply from './pages/CreateSupply'
import CreateDemand from './pages/CreateDemand'
import CreateDemandReturn from './pages/CreateDemandReturn'
import CreateLoss from './pages/CreateLoss'
import CreateMove from './pages/CreateMove'
import Document from './pages/Document';
import Settings from './pages/Settings';
import Profit from './pages/Profit';
import { persistConfig } from './reducers/rootReducer';
import SaleReport from './pages/SaleReport'
import Cashes from './pages/Cashes';
import CreateProductGroup from './pages/CreateProductGroup';
import CreateCustomerGroup from './pages/CreateCustomerGroup';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import Navbar from './pages/Navbar'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { updateLanguage } from './actions/getLang-action'
import { history } from './helpers/history'
import CreateTransaction from './pages/CreateTransaction';
import Dashboard from './pages/Dashboard';
import { getToken } from './config/token';

function App(props) {
  const { t, i18n } = useTranslation();
  const changeLanguage = (language) => {
    props.updateLanguage(language)
    i18n.changeLanguage(language);
  };





  return (

    <div className='mainDiv'>
     
      {
        getToken() ? <Navbar /> : <Redirect to="/login" />
      }
      <Switch>
        <Route exact path="/p=dashboard" component={Dashboard} />
        <Route exact path="/p=documents" component={Document} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/check80" component={check80} />
        <Route exact path="/bc" component={bc} />

        <Route exact path="/settings" component={Settings} />
        <Route exact path="/createStock" component={CreateStock} />
        <Route exact path="/editStock/:id" component={CreateStock} />
        <Route exact path="/p=product" component={Product} />
        <Route exact path="/createProducts/" component={CreateProduct} />
        <Route exact path="/editProduct/:id" component={CreateProduct} />
        <Route exact path="/createGroup" component={CreateProductGroup} />
        <Route exact path="/editGroup/:id" component={CreateProductGroup} />
        <Route exact path="/p=customer" component={Customer} />
        <Route exact path="/createCustomers/" component={CreateCustomer} />
        <Route exact path="/editCustomer/:id" component={CreateCustomer} />
        <Route exact path="/createCustomerGroup" component={CreateCustomerGroup} />

        <Route path="/p=enter" component={Enter} />
        <Route exact path="/createEnter/" component={CreateEnter} />
        <Route exact path="/editEnter/:id" component={CreateEnter} />

        <Route path="/p=loss" component={Loss} />
        <Route exact path="/createLoss/" component={CreateLoss} />
        <Route exact path="/editLoss/:id" component={CreateLoss} />

        <Route path="/p=move" component={Move} />
        <Route exact path="/createMove/" component={CreateMove} />
        <Route exact path="/editMove/:id" component={CreateMove} />

        <Route path="/p=supply" component={Supply} />
        <Route exact path="/createSupply/" component={CreateSupply} />
        <Route exact path="/editSupply/:id" component={CreateSupply} />

        <Route path="/p=demand"
          render={() => (
            <Demand setting={props.state.settings.setting} menu={props.state.navbar.fetching} />
          )}
        />
        <Route exact path="/createDemand/" component={CreateDemand} />
        <Route exact path="/editDemand/:id" component={CreateDemand} />



        <Route path="/p=demandreturns"
          render={() => (
            <DemandReturn setting={props.state.settings.setting} menu={props.state.navbar.fetching} />
          )}
        />
        <Route exact path="/createDemandReturn/" component={CreateDemandReturn} />
        <Route exact path="/editDemandReturn/:id" component={CreateDemandReturn} />

        <Route exact path="/createPaymentOut/" component={CreatePaymentOut} />
        <Route exact path="/editPaymentOut/:id" component={CreatePaymentOut} />


        <Route exact path="/createPaymentIn/" component={CreatePaymentIn} />
        <Route exact path="/editPaymentIn/:id" component={CreatePaymentIn} />

        <Route path="/p=settlements" component={Settlement} />
        <Route path="/p=salereports" component={SaleReport} />
        <Route path="/p=sales" component={Sale} />
        <Route exact path="/editSale/:id" component={EditSale} />

        <Route path="/p=returns" component={Return} />
        <Route path="/p=cashins" component={Cashin} />
        <Route path="/p=cashouts" component={Cashout} />
        <Route path="/p=stockbalance" component={StockBalance} />
        <Route path="/p=transactions" component={Transaction} />
        <Route exact path="/createTransaction/" component={CreateTransaction} />
        <Route exact path="/editTransaction/:id" component={CreateTransaction} />
        <Route path="/p=salepoints" component={SalePoint} />
        <Route path="/p=profit" component={Profit} />
        <Route path="/p=cashes" component={Cashes} />
        <Route path="/p=download" component={Download} />

      </Switch>

      {/* 
      <button onClick={() => changeLanguage("en")}>EN</button>
      <button onClick={() => changeLanguage("aze")}>aze</button>
      <button onClick={() => changeLanguage("ru")}>rus</button> */}
    </div>
  );
}

const mapStateToProps = (state) => ({
  state
})
const mapDispatchToProps = {
  updateLanguage
}
export default connect(mapStateToProps, mapDispatchToProps)(App)



