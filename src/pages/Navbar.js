import React, { Component } from 'react'
import { connect } from 'react-redux'
import getNavbar from '../actions/getNavbar-action'
import { Segment } from 'semantic-ui-react'
import SubmenuList from './SubmenuList'
import HeaderList from './HeaderList'
import 'semantic-ui-css/semantic.min.css'
import './header.css'
import getSetting from '../actions/getSettings'
import { Redirect } from 'react-router-dom'
import { getOwners } from '../actions/getGroups-action'

var md5 = require('md5');

class Navbar extends Component {
  componentDidMount() {
    this.props.getNavbar()
    if (this.props.state.settings.getsetting) {
      this.props.getSetting(md5(JSON.stringify(this.props.state.settings.getsetting)))
    }
    else {
      this.props.getSetting('1')

    }

  }


  render() {

    return (
      <div className={'my_header'} style={{ display: this.props.state.checkPage.show ? 'none' : 'initial' }}>

        <HeaderList menus={this.props.state.navbar.navbar} activeItem={this.props.state.navbar.activeItem} />
        <Segment>
          <SubmenuList submenu={this.props.state.navbar} activeItem={this.props.state.navbar.activeSubItem} />
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    state
  }
}

const mapDispatchToProps = {
  getNavbar, getSetting, getOwners
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)







