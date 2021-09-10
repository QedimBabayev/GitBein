import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocButtons from '../components/DocButtons'
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames'
import CreateCustomerForm from '../components/CreateCustomerForm'
import { getGroups } from '../actions/getGroups-action'
import filterObject from '../config/filterObject'
import {fetchData} from '../actions/getData-action'


class CreateCustomer extends Component {

    componentWillMount() {
        this.props.getGroups('customergroups')
    }


    componentDidMount() {
        const { match } = this.props
        if (!this.props.customer && match.params.id) {
            filterObject.id = match.params.id
            this.props.fetchData('customers')
        }
    }


    render() {
        const { match } = this.props

        const returnElementId = (
            this.props.customer ?
                <div>
                    <DocButtons buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />
                    <CreateCustomerForm datas={this.props.state.groups.groups} selectedCustomer={this.props.customer} />
                </div>
                : <div>Loading..</div>
        )
        const returnElement = (
            <div>
                <DocButtons buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />
                <CreateCustomerForm datas={this.props.state.groups.groups} selectedCustomer={this.props.customer} />
            </div>

        )

        return (
            match.params.id ? returnElementId : returnElement

        )
    }
}

const mapStateToProps = (state, props) => ({
    state,
    customer: state.datas.datas.find(p => p.Id == props.match.params.id)
})
const mapDispatchToProps = {
    getGroups, fetchData
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCustomer)
