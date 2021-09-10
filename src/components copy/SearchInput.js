
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'semantic-ui-react'
import { fetchData, fetchDataFast } from '../actions/getData-action'

import filterObject from '../config/filterObject'
class SearchInput extends Component {

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {

            if (e.target.value != '') {
                if (this.props.from === 'fast' || this.props.from === 'modal') {
                    filterObject.fast = e.target.value
                    this.props.fetchDataFast(this.props.fetchFast)

                }
                else{
                    filterObject.nm = e.target.value
                    this.props.fetchData(this.props.fetchFast)
                }
                e.target.value = ''

            }
            else {
                filterObject.fast = ''
                filterObject.nm = ''
                this.props.fetchData(this.props.fetchFast)
            }

        }
    }
    render() {


        return (
            <Input
                icon={{ name: 'search', circular: true, link: true }}
                placeholder='Axtarış...'
                loading={this.props.state.datas.loading}
                onChange={this.onChange}
                onKeyPress={this.handleKeyPress}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    fetchData, fetchDataFast
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput)