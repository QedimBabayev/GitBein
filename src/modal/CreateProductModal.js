import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Drawer, Button } from 'antd';
import CreateProductFormModal from './CreateProductFormModal ';
import CreateProductGroupForm from '../components/CreateProductGroupForm';
import CreateProductGroupFormModal from './CreateProductGroupFormModal';
export const CreateProductModal = (props) => {
    console.log(props)
    return (
        <div>
            <Drawer
                title="Məhsul"
                width={600}
                closable={false}
                onClose={props.onClose}
                destroyOnClose={true}
                visible={props.visible}
            >

                <CreateProductFormModal  attrInputs = {props.attrInputs}  openSecondModal={props.showChildrenDrawer} fetching={props.state.docmodals.fetching} datas={props.productGr} />
                <Drawer
                    title="Məhsul qrupu"
                    width={400}
                    closable={false}
                    destroyOnClose={true}
                    onClose={props.onChildrenDrawerClose}
                    visible={props.childrenDrawer}
                >
                    <CreateProductGroupFormModal fetching={props.state.docmodals.fetching} />
                </Drawer>
            </Drawer>
        </div>
    )
}

const mapStateToProps = (state) => ({
    state,
    productGr: state.docmodals.productGroups

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductModal)
