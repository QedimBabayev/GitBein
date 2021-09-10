import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocButtons from '../components/DocButtons'
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames'
import CreateProductGroupForm from '../components/CreateProductGroupForm'
import { getGroups } from '../actions/getGroups-action'
import { fetchData } from '../actions/getData-action'
import filterObject from '../config/filterObject'
import { getToken } from '../config/token'



class CreateProductGroup extends Component {


    componentDidMount() {

        const { match } = this.props
        if (!this.props.progr && match.params.id) {
            filterObject.id = match.params.id
            this.props.fetchData('productfolders')
        }
        if (getToken()) {
            this.props.getGroups('productfolders')
        }
    }

    render() {
        const { match } = this.props

        const returnElementId = (
            this.props.progr ?
                <div>
                    <CreateProductGroupForm datas={this.props.state.groups.groups} selectedProGr={this.props.progr} />

                </div>
                : <div>Loading..</div>
        )
        const returnElement = (
            <div>
                <CreateProductGroupForm datas={this.props.state.groups.groups} selectedProGr={this.props.progr} />

            </div>

        )
        return (
            <div>
                {
                    match.params.id ? returnElementId : returnElement
                }
            </div>
        )
    }
}

const mapStateToProps = (state,props) => ({
    state,
    progr:Object.values(state.groups.groups).find(p => p.Id == props.match.params.id)

})
const mapDispatchToProps = {
    getGroups,fetchData
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductGroup)
