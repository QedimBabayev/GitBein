import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateProductForm from '../components/CreateProductForm'
import { deleteBarcode } from '../actions/getBarcode-action'
import { getGroups, getOwners, getDepartments } from '../actions/getGroups-action'
import filterObject from '../config/filterObject'
import { fetchData } from '../actions/getData-action'
import { fetchAttributes, fetchRefList } from '../actions/getAttributes-action'
import { getCheckPage } from '../actions/check/check-action'
var inputsNameArray = []

class CreateProduct extends Component {
    componentWillMount() {
        this.props.getGroups('productfolders')
    }
    componentDidMount() {
        this.props.deleteBarcode()
        this.props.getCheckPage(false)
   
        this.props.fetchAttributes('attributes','product')
        const { match } = this.props
        if (!this.props.product && match.params.id) {
            filterObject.id = match.params.id
            this.props.fetchData('products')
        }
   
    }


    render() {
        const { match } = this.props
        inputsNameArray = []
        Object.values(this.props.state.attributes.attributes).map(c => {
            inputsNameArray.push({
                name: 'col_' + c.Name,
                label: c.Title,
                isrequired: c.IsRequired,
                referencetypeid: c.ReferenceTypeId,
                valuetype: c.ValueType,
                entitytype: c.EntityType,
                isfilter: c.IsFilter,
                id: c.Id
            })
        })
        const returnElementId = (
            this.props.product ?
                <div>
                    <CreateProductForm   attrInputs = {inputsNameArray} datas={this.props.state.groups.groups} owners={this.props.state.owdep.owners} departments={this.props.state.owdep.departments} selectedProduct={this.props.product} />
                </div>
                : <div>Loading..</div>
        )
        const returnElement = (
            <div>
                <CreateProductForm  attrInputs = {inputsNameArray}  datas={this.props.state.groups.groups} owners={this.props.state.owdep.owners} departments={this.props.state.owdep.departments} selectedProduct={this.props.product} />
            </div>

        )

        return (
            match.params.id ? returnElementId : returnElement

        )
    }
}

const mapStateToProps = (state, props) => ({
    state,
    product: state.datas.datas.find(p => p.Id == props.match.params.id)
})
const mapDispatchToProps = {
    getGroups, fetchData, getOwners, getDepartments, fetchRefList,fetchAttributes,deleteBarcode,getCheckPage
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProduct)
