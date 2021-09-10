import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocButtons from '../components/DocButtons'
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames'
import CreateCustomerGroupForm from '../components/CreateCustomerGroupForm'
import { getGroups } from '../actions/getGroups-action'



class CreateCustomerGroup extends Component {

    componentWillMount() {
        this.props.getGroups('productfolders')
    }


    render() {
   
  
        return (
                        <div>
                             <DocButtons buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />
                            <CreateCustomerGroupForm datas={this.props.state.groups.groups} />
                        </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state

})
const mapDispatchToProps = {
    getGroups
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCustomerGroup)
