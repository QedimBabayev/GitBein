
import React, { useState } from 'react'
import { Modal, Button } from 'antd';
import { connect } from 'react-redux'
import { getGroups } from '../actions/getGroups-action';
import filterObject from '../config/filterObject';
import ProductForDoc from '../modal/ProductForDoc'
import { updateStatesCreate } from '../actions/updateStates-action';
import { fetchAttributes } from '../actions/getAttributes-action';
import { openModal, openProductGroupModal, updateSelectProductMultiConfirm } from '../actions/updateStates-action';
import './modal.css';


 const CreateProductAndProductGroup = (props) => {
    return (
        <div>

            <Modal
                title=""
                visible={props.visible}
                onOk={props.closeCtalaog}
                onCancel={props.closeCtalaogGancel}

            >
                <ProductForDoc  fetching={props.state.docmodals.fetching} />
            </Modal>
        </div>
    )
}

const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
    getGroups, updateStatesCreate, openModal, openProductGroupModal, updateSelectProductMultiConfirm, fetchAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductAndProductGroup)
