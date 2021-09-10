import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchData } from '../actions/getData-action'
import GridExampleContainer from './SupplyPage'
import ButtonsWrapper from '../components/ButtonsWrapper'
import buttonsNames from '../ButtonsNames/Supplies/buttonsNames'
import filterObject from '../config/filterObject'
import { getOwners,getDepartments } from '../actions/getGroups-action'


class Supply extends Component {


    componentDidMount() {
        filterObject.pg = 0
        filterObject.id = ''
        filterObject.gp = ''
        this.props.getDepartments('departments')
        this.props.getOwners('owners')
    }

    render() {
        return (
            <div className='table_holder'>

                <ButtonsWrapper from={'normal'} fetchFast={'supplies'} buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />
                <GridExampleContainer groups={this.props.state.groups.groups} />

            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
    fetchData,getOwners,getDepartments
}
export default connect(mapStateToProps, mapDispatchToProps)(Supply)
