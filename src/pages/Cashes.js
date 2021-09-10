import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProfit } from '../actions/getData-action'
import GridExampleContainer from './CashesPage'
import ButtonsWrapper from '../components/ButtonsWrapper'
import buttonsNames from '../ButtonsNames/Cashes/buttonsNames'
import filterObject from '../config/filterObject'
import { getToken } from '../config/token'
import { fetchData } from '../actions/getData-action'
import { getSpendItems } from '../actions/getSpendItems-action'
class Cashes extends Component {
    componentDidMount() {
        var cashesFilter = {}
        cashesFilter.token = getToken()
        if (getToken) {
            this.props.fetchData('cashes',cashesFilter)
        }
    }
    render() {
        return (
            <div className='table_holder'>
                <ButtonsWrapper from={'normal'} fetchFast={'profit'} buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />
                <GridExampleContainer datas={this.props.state.datas.datas} />
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
    fetchProfit, getSpendItems, fetchData
}
export default connect(mapStateToProps, mapDispatchToProps)(Cashes)
