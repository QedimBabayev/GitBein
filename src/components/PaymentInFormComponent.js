import React, { Component } from 'react'
import { connect } from 'react-redux'
import Trans from '../usetranslation/Trans';
import { deleteResponseService } from '../actions/putAactions/deleteResponseService';
import { putLocalStates } from '../actions/modalActions/putModalInputs-action';
import { getCustomers, getCustomersFast } from '../actions/getCustomerGroups-action';
import getMarks from '../actions/getMarks-action'
import { getGroups } from '../actions/getGroups-action';
import { getCustomerGroupsModal, getStocksGroupsModal, productModalFilter, getProductsModal, getProductsGroupModal } from '../actions/modalActions/getCustomerGroupsModal-action';
import CreateCustomerModal from '../modal/CreateCustomerModal';
import CreateStockModal from '../modal/CreateStockModal';
import filterObject from '../config/filterObject';
import { poistionArray, description } from './DocTable';
import LoaderDocHOC from './LoaderDocHOC';
import putData from '../actions/putAactions/putData-action';


import moment from 'moment';
import {
    Form, Input, Button, InputNumber, TreeSelect, Checkbox, Dropdown, DatePicker, Switch, Select, Spin, Tag, Divider, Menu, Col, Row, Collapse
} from 'antd';

import {
    PrinterOutlined,
    UserAddOutlined,
    PlusOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Null_Content } from '../config/env';
import AddStockModal from '../modal/AddStockModal';
import './ButtonsWrapper.css'
import './DocForm.css'
const { Option, OptGroup } = Select;

var customCascaderStock = [];
var customCascaderCustomer = [];
var newArrCustomers = []
var lowerCaseMarks = []
var lowerCaseCustomers = []


class PaymentInFormComponent extends Component {
    formRef = React.createRef();
    state = {
        visibleCustomer: false,
        visibleStock: false,
        visibleCatalog: false,

    }
    showDrawer = () => {
        this.setState({
            visibleCustomer: true,
        });
        this.props.deleteResponseService()
        this.props.getCustomerGroupsModal()
        this.props.putLocalStates('')
    };

    showStockDrawer = () => {
        this.setState({
            visibleStock: true,
        });
        this.props.deleteResponseService()
        this.props.getStocksGroupsModal()
        this.props.putLocalStates('')
    };

    onClose = () => {
        this.setState({
            visibleCustomer: false,
        });
        this.props.getCustomers()
    };


    onCloseStock = () => {
        this.setState({
            visibleStock: false,
        });
        this.props.getGroups('stocks')
    };

    showChildrenDrawer = () => {
        this.setState({
            childrenDrawer: true,
        });
    };

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: false,
        });
        this.props.getCustomerGroupsModal()
    };



    doSearch = (value) => {
        this.props.getCustomersFast(value)
    }

    onChange = (value, option) => {
        console.log(value)
        if (value === '00000000-0000-0000-0000-000000000000') {
            this.formRef.current.setFieldsValue({
                spenditem: this.props.state.spenditems.spendItems.find(s => s.StaticName === 'correct').Id
            })
        }
        else {
            this.formRef.current.setFieldsValue({
                spenditem: this.props.state.spenditems.spendItems.find(s => s.StaticName === 'buyproduct').Id
            })
        }

    }
    getMark = () => {
        lowerCaseMarks = []
        this.props.getMarks()
    }

    onFinish = (values) => {
        var sendObject = {}
        sendObject = values;
        sendObject.moment = values.moment._i
        sendObject.modify = values.modify._i
        console.log(sendObject)

        this.props.putData('paymentins', values)
    };

    render() {

        lowerCaseMarks = []
        Object.values(this.props.state.marks.marks).map(m => {
            lowerCaseMarks.push({
                label: m.Name,
                value: m.Id,
                color: m.Color
            })
        })

        lowerCaseMarks.push({
            label: 'Status yarat',
            value: 'createStatus',
        })
        console.log(this.props.doc)
        console.log(this.props.doc.Status)
        newArrCustomers = []
        customCascaderCustomer = []
        const spendOptions =
            Object.values(this.props.state.spenditems.spendItems).filter(item => item.StaticName === 'buyproduct').map(item =>
                <Option key={item.Id} text={item.Name} staticname={item.StaticName} value={item.Id}>
                    {item.Name}
                </Option>
            )

        const customerOptions = Object.values(this.props.state.groups.customers).map(customer =>
            <Option key={customer.Id} disabled={customer.Id === "00000000-0000-0000-0000-000000000000" ? true : false} value={customer.Id}>{customer.Name}</Option>
        )
        return (

            <>
                <Form id='myForm' className='doc_forms' ref={this.formRef}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    name="basic"
                    initialValues={
                        {
                            name: this.props.doc ? this.props.doc.Name : '',
                            customerid: Object.keys(this.props.doc).length > 0 ? this.props.doc.CustomerId
                                : this.props.state.putdatas.responseCustomerId ? this.props.state.putdatas.responseCustomerId.ResponseService
                                    : Object.keys(this.props.saledoc).length > 0 ? this.props.saledoc.CustomerId : '',
                            status:  this.props.doc.Status ? this.props.doc.Status  : true,
                            spenditem:this.props.state.spenditems.spendItems.find(s => s.StaticName === 'buyproduct').Id ,
                            amount: Object.keys(this.props.doc).length > 0 ? this.props.doc.Amount : Object.keys(this.props.saledoc).length > 0 ? this.props.saledoc.Amount : '',
                            modify: this.props.doc ? moment(this.props.doc.Modify) : '',
                            moment: this.props.doc ? moment(this.props.doc.Moment) : '',
                            id: this.props.doc ? this.props.doc.Id : '',
                            linkid: Object.keys(this.props.saledoc).length > 0 ? this.props.saledoc.Id : '',

                        }
                    }
                    layout="horizontal"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >


                    <Row className='doc_form_field_wrapper'>
                        <Col xs={24} md={18} xl={8}>
                            <Row>
                                <Col xs={24} md={18} xl={12}>
                                    <Form.Item
                                        label={<Trans word={'PaymentIn Number'} />}
                                        name="name"
                                    >
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                <Col className='doc_status_formitem_wrapper_col' xs={24} md={18} xl={12}>
                                    <Form.Item
                                        label=''
                                        name='spenditem'
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Xərc maddələri"
                                            filterOption={(input, option) =>
                                                option.text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            notFoundContent={<span>{Null_Content}</span>}
                                            loading={this.props.state.spenditems.fetching}
                                        >
                                            {spendOptions}
                                        </Select>


                                    </Form.Item>
                                </Col>
                            </Row>


                        </Col>
                        <Col xs={24} md={18} xl={10}>

                            <div className='form_item_with_icon'>
                                <Form.Item
                                    label={'Müştəri'}
                                    name="customerid"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Zəhmət olmasa, müştəri seçin',
                                        },
                                    ]}
                                >

                                    <Select
                                        showSearch
                                        placeholder=""
                                        onSearch={this.doSearch}
                                        onChange={this.onChange}
                                        filterOption={false}
                                        notFoundContent={<span>{Null_Content}</span>}
                                        loading={this.props.state.groups.fastFetching ? <Spin size="small" /> : ''}
                                    >

                                        {customerOptions}
                                    </Select>
                                </Form.Item>
                                <PlusOutlined onClick={this.showDrawer} className='add_elements' />

                            </div>




                        </Col>
                        <Col xs={24} md={18} xl={4}>
                            <Form.Item label="Keçirilib" name='status' valuePropName="checked">
                                <Checkbox  ></Checkbox>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={18} xl={8}>
                            <Form.Item
                                label={<Trans word={'Created Moment'} />}
                                name="moment"
                            >
                                <DatePicker showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={18} xl={10}>
                            <Form.Item
                                label={<Trans word={'Amount'} />}
                                name="amount"
                            >
                                <Input type='number' allowClear />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={18} xl={4}></Col>
                        <Col style={{ display: this.props.docid != '' ? 'block' : 'none' }} xs={24} md={18} xl={8}>
                            <Form.Item
                                label="Dəyişmə tarixi"
                                name="modify"

                            >
                                <DatePicker showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={18} xl={10}></Col>
                        <Col xs={24} md={18} xl={4}></Col>
                    </Row>
                    <Form.Item hidden={true}
                        label="id"
                        name="id"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item hidden={true}
                        label="linkid"
                        name="linkid"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </>



        )
    }
}

const mapStateToProps = (state) => ({
    state

})

const mapDispatchToProps = {
    putData, getMarks, deleteResponseService, getProductsModal, getProductsGroupModal, getGroups, getStocksGroupsModal, getCustomers, getCustomersFast, putLocalStates, getCustomerGroupsModal
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderDocHOC(PaymentInFormComponent, 'fetching'))
