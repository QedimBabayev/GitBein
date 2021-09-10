import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { List } from 'semantic-ui-react'
import LoaderHOC from '../components/LoaderHOC'
import { connect } from 'react-redux'
import { updateUpperheader } from '../actions/getNavbar-action'
import { updateButton } from '../actions/getButtons-action'
import { updateChangePage } from '../actions/getData-action'
import { updateSearchInput } from '../actions/getData-action';
import queryString from 'query-string';
class SubmenuList extends Component {
  state = { activeItem: this.props.activeItem}

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    this.props.updateUpperheader(name)
    this.props.updateButton(name)
    this.props.updateSearchInput('')
    this.props.state.datas.changePage == false ? console.log('changepage falsedi') : this.props.updateChangePage(true)
  }
  render() {

    var data = this.props.submenu.navbar
    var i = 0;
    var id = this.props.submenu.id
    const { activeItem } = this.state

    const menuList = (

      <List className='d-flex' >

          {
            data.filter(d => d.ParentId === id).map(d =>
              <List.Item
                key={i++}
                as={Link}
                to={`/${d.Url}`}
                active={activeItem === d.Name}
                name={d.Name}
                onClick={this.handleItemClick}
                className='sub_header_items'
              >
                {d.Name}
              </List.Item>
            )
          }
      </List >
    )
    return (
      menuList
    )
  }
}

const mapStateToProps = (state) => {
  return {
    state
  }
}

const mapDispatchToProps = {
  updateUpperheader, updateButton, updateChangePage,updateSearchInput
}


export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(SubmenuList, 'submenu'))
