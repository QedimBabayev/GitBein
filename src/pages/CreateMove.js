import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocButtons from '../components/DocButtons'
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames'
import CreateMoveForm from '../components/CreateMoveForm'
import { getGroups, getOwners, getDepartments } from '../actions/getGroups-action'
import filterObject from '../config/filterObject'
import { fetchPage } from '../actions/getData-action'
import { deleteProduct } from '../actions/updateProduct'
import getMarks from '../actions/getMarks-action'
class CreateMove extends Component {



    componentDidMount() {
        filterObject.id = ''
        this.props.deleteProduct('')
        this.props.getGroups('stocks')
        const { match } = this.props
        if (match.params.id != '') {
            filterObject.id = match.params.id
            this.props.fetchPage('moves')
        }
    }






    render() {
        const { match } = this.props
        return (
            <CreateMoveForm fromdoc={this.props.location.state ? this.props.location.state : ''} id={match.params.id ? match.params.id : ''} fetching={match.params.id ? this.props.state.datas.fetchingEdit : false} owners={this.props.state.owdep.owners} departments={this.props.state.owdep.departments} />
        )
    }
}

const mapStateToProps = (state, props) => ({
    state,
})
const mapDispatchToProps = {
    getGroups, fetchPage, deleteProduct, getOwners, getDepartments, getMarks

}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMove)
