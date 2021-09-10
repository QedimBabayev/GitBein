import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreatePaymentOutForm from '../components/CreatePaymentOutForm'
import { getGroups, getOwners, getDepartments } from '../actions/getGroups-action'
import filterObject from '../config/filterObject'
import { fetchPage, fetchData } from '../actions/getData-action'
import { getSpendItems } from '../actions/getSpendItems-action'
import { getCustomers } from '../actions/getCustomerGroups-action'
class CreatePaymentOut extends Component {

    componentWillMount() {
        this.props.getSpendItems()
        this.props.getCustomers()
    }
    componentDidMount() {
        filterObject.id = ''
        this.props.getOwners('owners')
        this.props.getDepartments('departments')
       
    

        const { match } = this.props
        if (match.params.id != '') {
            filterObject.id = match.params.id
            this.props.fetchPage('paymentouts')
        }
    }




    render() {
        const { match } = this.props
        const returnElementId = (
            match.params.id ?
                this.props.state.datas.fetchingEdit ? <div>Loading...</div> :
                    <div>
                        <CreatePaymentOutForm datas={this.props.state.spenditems.spendItems} owners={this.props.state.owdep.owners} departments={this.props.state.owdep.departments} selectedDoc={this.props.state.datas.pagePositions} />
                    </div>
                :
                <div>
                    <CreatePaymentOutForm datas={this.props.state.spenditems.spendItems} owners={this.props.state.owdep.owners} departments={this.props.state.owdep.departments} fromDoc = {this.props.location.state ? this.props.location.state.fromdoc : ''} saledoc={ this.props.location.state ? this.props.location.state.doc : ''} />
                </div>

        )

        return (
            returnElementId

        )
    }
}
const mapStateToProps = (state, props) => ({
    state,
})
const mapDispatchToProps = {
    getGroups, fetchPage, getCustomers, getOwners, getDepartments, fetchData, getSpendItems
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePaymentOut)
