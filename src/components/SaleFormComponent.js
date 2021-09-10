import React, { Component } from 'react'
import { connect } from 'react-redux'
import Trans from '../usetranslation/Trans';
import { getCustomers, getCustomersFast, getCustomersData } from '../actions/getCustomerGroups-action';
import getMarks from '../actions/getMarks-action'
import { getGroups } from '../actions/getGroups-action';
import LoaderDocHOC from './LoaderDocHOC';

import moment from 'moment';
import {
    Form, Input, TreeSelect, Checkbox, DatePicker, Select, Spin, Col, Row,
} from 'antd';

import {
    LoadingOutlined,
} from '@ant-design/icons';
import './ButtonsWrapper.css'
import './DocForm.css'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
var newArrStocks = []
var customCascaderStock = [];
var newArrStocks = []
var newArrCustomers = []
var lowerCaseMarks = []
var pid;
var treedata = []
function convert(array) {
    var map = {}
    for (var i = 0; i < array.length; i++) {
        var obj = array[i]
        if (!(obj.id in map)) {
            map[obj.id] = obj
            map[obj.id].children = []
        }

        if (typeof map[obj.id].name == 'undefined') {
            map[obj.id].id = obj.id
            map[obj.id].name = obj.name
            map[obj.id].parent = obj.parent
            map[obj.id].value = obj.value
            map[obj.id].label = obj.label
        }

        var parent = obj.parent || '-';
        if (!(parent in map)) {
            map[parent] = {}
            map[parent].children = []
        }

        map[parent].children.push(map[obj.id])
    }
    return map['-']
}

class SaleFormComponent extends Component {

    state = {
        visibleCustomer: false,
        visibleStock: false,
        visibleCatalog: false,
        markEdit: false,
        customerEdit: false,
        stockEdit: false

    }
    doSearch = (value) => {
        this.props.getCustomersFast(value)
    }
    getMarks = () => {
        this.setState({
            markEdit: true
        })
        lowerCaseMarks = []
        this.props.getMarks()
    }
    getCustomers = () => {
        this.setState({
            customerEdit: true
        })
        newArrCustomers = []
        this.props.getCustomers()
    }
    getStocks = () => {
        this.setState({
            stockEdit: true
        })
        newArrStocks = []
        customCascaderStock = [];
        this.props.getGroups('stocks')
    }
    onChange = (value, option) => {
        this.props.getCustomersData(value)
    }
    render() {

        //#region important arrays start
        newArrCustomers = []
        lowerCaseMarks = []
        newArrStocks = []
        customCascaderStock = []
        treedata = []

        //#endregion
        //#region marks loading start here
        if (this.state.markEdit) {
            Object.values(this.props.state.marks.marks).map(mark => {
                lowerCaseMarks.push({
                    label: mark.Name,
                    value: mark.Name
                })
            })
        }
        else {

            lowerCaseMarks.push({
                label: this.props.doc.Mark,
                value: this.props.doc.Mark
            })
        }
        //#endregion marks loading ends here
        //#region customers loading starts here

        if (this.state.customerEdit) {
            Object.values(this.props.state.groups.customers).map(customer => {
                newArrCustomers.push({
                    label: customer.Name,
                    value: customer.Id,
                })
            })
        }
        else {

            newArrCustomers.push({
                label: this.props.doc.CustomerName,
                value: this.props.doc.CustomerId
            })
        }


        //#endregion customers loading ends here
        //#region stocks loading starts here
        if (this.state.stockEdit) {
            Object.values(this.props.state.groups.groups).map(d => {
                d.ParentId === '00000000-0000-0000-0000-000000000000' ? pid = '' : pid = d.ParentId
                customCascaderStock.push({
                    "id": d.Id, "name": d.Name, "parent": pid, "value": d.Id, "label": d.Name,
                })
            })
            newArrStocks = convert(customCascaderStock)
            treedata = newArrStocks.children
        }
        else {
            console.log('salam')
            customCascaderStock.push({
                children: [
                    {
                        title: this.props.doc.StockName,
                        value: this.props.doc.StockId,
                    },
                ],
            })
            newArrStocks = customCascaderStock
            treedata = newArrStocks[0].children
            console.log(treedata)


        }

        //#endregion stocks loading ends here

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
                            stockid: Object.keys(this.props.doc).length > 0 ? this.props.doc.StockId : '',
                            customerid: Object.keys(this.props.doc).length > 0 ? this.props.doc.CustomerId : '',
                            status: this.props.doc.Status ? this.props.doc.Status : true,
                            modify: this.props.doc ? moment(this.props.doc.Modify) : '',
                            moment: this.props.doc ? moment(this.props.doc.Moment) : '',
                            id: this.props.doc ? this.props.doc.Id : '',
                            mark: this.props.doc ? this.props.doc.Mark : '',
                        }
                    }
                    layout="horizontal"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >


                    <Row className='doc_form_field_wrapper'>
                        <Col xs={24} md={18} xl={9}>
                            <Row>
                                <Col xs={24} md={18} xl={12}>
                                    <Form.Item
                                        label={<Trans word={'Demand Number'} />}
                                        name="name"
                                    >
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                <Col className='doc_status_formitem_wrapper_col' xs={24} md={18} xl={12}>
                                    <Form.Item
                                        label=''
                                        name='mark'
                                    >
                                        <Select
                                            showSearch
                                            showArrow={false}
                                            filterOption={false}
                                            onFocus={this.getMarks}
                                            placeholder="Status"
                                            notFoundContent={<Spin size="small" />}
                                            loading={this.props.state.marks.markLoading ? <Spin size="small" /> : ''}
                                            options={this.props.state.marks.markLoading ? [] : lowerCaseMarks}

                                        />
                                    </Form.Item>
                                </Col>
                            </Row>


                        </Col>
                        <Col xs={24} md={18} xl={10}>

                            <div className='form_item_customer_data'>
                                <div className='form_item_with_icon'>
                                    <Form.Item
                                        label={'Müştəri'}
                                        name="customerid"
                                        style={{ margin: '0' }}
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
                                            onFocus={this.getCustomers}
                                            filterOption={false}
                                            notFoundContent={<Spin size="small" />}
                                            loading={this.props.state.groups.loading ? <Spin size="small" /> : ''}
                                            options={this.props.state.groups.loading ? [] : newArrCustomers}
                                        />

                                    </Form.Item>
                                </div>
                                <Spin className='get_data_indicator' indicator={antIcon} spinning={this.props.state.groups.fetchData}>
                                    <p style={{ marginTop: '4px' }} className='customer_data_wrapper' >Verəcək (borc) : {this.props.state.groups.customerDebt != '' ? this.props.state.groups.customerDebt : '0.00'}</p>

                                </Spin>
                            </div>


                        </Col>
                        <Col xs={24} md={18} xl={4}>
                            <Form.Item label="Keçirilib" className='docComponentStatus' name='status' valuePropName="checked">
                                <Checkbox name='status' onChange={this.handleBarcodeSelect}  ></Checkbox>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={18} xl={9}>
                            <Form.Item
                                label={<Trans word={'Created Moment'} />}
                                name="moment"
                            >
                                <DatePicker showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={18} xl={10}>
                            <div className='form_item_with_icon'>
                                <Form.Item

                                    label={<Trans word={'Stock Groups'} />}
                                    name='stockid'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Zəhmət olmasa, anbar qrupunu seçin',
                                        },
                                    ]}
                                >
                                    <TreeSelect
                                        className='doc_status_formitem_wrapper_col'
                                        allowClear
                                        onFocus={this.getStocks}
                                        notFoundContent={<Spin size="small" />}
                                        treeData={this.props.state.groups.loading ? [] : treedata}
                                    />

                                </Form.Item>

                            </div>
                        </Col>
                        <Col xs={24} md={18} xl={4}></Col>
                        <Col style={{ display: this.props.docid != '' ? 'block' : 'none' }} xs={24} md={18} xl={9}>
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

                </Form>
            </>



        )
    }
}

const mapStateToProps = (state) => ({
    state

})

const mapDispatchToProps = {
    getMarks, getCustomersData, getGroups, getCustomers, getCustomersFast
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderDocHOC(SaleFormComponent, 'fetching'))
