import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchData } from '../actions/getData-action'
import { getGroups } from '../actions/getGroups-action'
import Trans from '../usetranslation/Trans'
import GridExampleContainer from './CustomerPage'
import ButtonsWrapper from '../components/ButtonsWrapper'
import buttonsNames from '../ButtonsNames/Customers/buttonsNames'
import filterObject from '../config/filterObject'
import { getToken } from '../config/token'


class Customer extends Component {


    componentDidMount() {

        filterObject.pg = 0
        filterObject.id = ''
        filterObject.gp = ''

        if (getToken) {
            this.props.getGroups('customergroups')
            this.props.fetchData('customers')
        }

    }


    render() {
        return (
            <div className='table_holder'>

                <ButtonsWrapper from={'fast'} fetchFast={'customers'} buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />
                <GridExampleContainer groups={this.props.state.groups.groups} />

            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
    fetchData, getGroups
}
export default connect(mapStateToProps, mapDispatchToProps)(Customer)
