import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateEnterForm from '../components/CreateEnterForm'
import { getGroups, getOwners, getDepartments } from '../actions/getGroups-action'
import filterObject from '../config/filterObject'
import { fetchPage } from '../actions/getData-action'
import { deleteProduct } from '../actions/updateProduct'
import { getToken } from '../config/token'
import getMarks from '../actions/getMarks-action'

class CreateEnter extends Component {



    componentDidMount() {
        filterObject.id = ''
        this.props.deleteProduct('')
        this.props.getGroups('stocks')
        const { match } = this.props
        if (match.params.id != '') {
            filterObject.id = match.params.id
            this.props.fetchPage('enters')
        }
    }


    render() {
        const { match } = this.props
        return (
            <CreateEnterForm fromdoc={this.props.location.state ? this.props.location.state : ''} id={match.params.id ? match.params.id : ''} fetching={match.params.id ? this.props.state.datas.fetchingEdit : false} owners={this.props.state.owdep.owners} departments={this.props.state.owdep.departments} />
        )
    }
}

const mapStateToProps = (state, props) => ({
    state,
})
const mapDispatchToProps = {
    getGroups, fetchPage, deleteProduct, getOwners, getDepartments, getMarks
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEnter)
