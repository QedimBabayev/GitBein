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
import { getCustomersData, updateCustomerSelect } from '../actions/getCustomerGroups-action';
import CreateStockModal from '../modal/CreateStockModal';
import filterObject from '../config/filterObject';
import LoaderHOC from './LoaderHOC';
import { poistionArray, description } from './DocTable';
import putData from '../actions/putAactions/putData-action';
import { API_BASE } from '../config/env';
import axios from 'axios';
import moment from 'moment';
import {
    Form, Input, message, Button, InputNumber, TreeSelect, Checkbox, Dropdown, DatePicker, Switch, Select, Spin, Tag, Divider, Menu, Col, Row, Collapse
} from 'antd';

import {
    PrinterOutlined,
    UserAddOutlined,
    PlusOutlined,
    LoadingOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Null_Content } from '../config/env';
import AddStockModal from '../modal/AddStockModal';
import './ButtonsWrapper.css'
import './DocForm.css'
import { getToken } from '../config/token';
const { Option, OptGroup } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
var newArrStocks = []
var customCascaderStock = [];
var customCascaderCustomer = [];
var newArrCustomers = []
var lowerCaseMarks = []
var lowerCaseCustomers = []
var pid;
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






class DemandFormComponent extends Component {
    formRef = React.createRef();

    state = {
        visibleCustomer: false,
        visibleStock: false,
        visibleCatalog: false,
        markEdit: false,
        customerEdit: false,
        stockEdit: false,
        customerCreate: false,
        stockCreate: false,
        createdCustomerId: '',
        createdStockId: '',
        createdCustomerName: ''

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.state.putdatas.responseCustomerId.ResponseService) {
            if (nextProps.state.putdatas.responseCustomerId.ResponseService != this.props.state.putdatas.responseCustomerId.ResponseService) {
                this.setState({
                    customerCreate: true,
                    createdCustomerId: nextProps.state.putdatas.responseCustomerId.ResponseService
                }, () => {
                    console.log('salam')
                    this.formRef.current.setFieldsValue({
                        customerid: nextProps.state.docmodals.localStates.name,

                    })
                })

            }
            else {
                this.setState({
                    customerCreate: false
                })
            }
        }

        if (nextProps.state.putdatas.responseStockId.ResponseService) {
            if (nextProps.state.putdatas.responseStockId.ResponseService != this.props.state.putdatas.responseStockId.ResponseService) {
                this.setState({
                    stockCreate: true,
                    createdStockId: nextProps.state.putdatas.responseStockId.ResponseService
                }, () => {
                    this.formRef.current.setFieldsValue({
                        stockid: nextProps.state.docmodals.localStates.name,
                    })
                })

            }
            else {
                this.setState({
                    stockCreate: false
                })
            }
        }

    }


    showDrawer = () => {
        this.setState({
            visibleCustomer: true,
        });
        this.props.getCustomerGroupsModal()
        this.props.deleteResponseService()
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
    };
    onCloseStock = () => {
        this.setState({
            visibleStock: false,
        });
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
    getMarks = () => {
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
    async putDoc(object) {
        const res = await axios.post(`${API_BASE}/demands/put.php`, object);
        return await res;
    }
    onChange = (value, option) => {
        this.props.getCustomersData(value)
        console.log(this.formRef.current.getFieldsValue(['customerid']))
    }
    progress = (fetching, status, mess) => {
        console.log(fetching)
        if (fetching) {
            message.loading('Yüklənir...')
        }
        else if (fetching === 'error') {
            console.log('errora girdi')
            message.destroy()
            message.error(`Saxlanılmadı.. ${mess}`)

        }
        else {

            message.destroy()
            if (status === '0') {
                message.success('Saxlanıldı')
                this.setState({
                    editId: mess.responseService
                })
            }
            else {
                message.error(`Saxlanılmadı.. ${mess}`)
            }
        }
    };
    onFinish = (values) => {
        var sendObject = {}
        sendObject = values;
        sendObject.positions = poistionArray
        sendObject.moment = values.moment._i
        sendObject.modify = values.modify._i
        sendObject.description = description
        sendObject.token = getToken()
        this.progress(true)
        if (this.state.createdCustomerId != '') {
            delete sendObject['customerid'];
            sendObject.customerid = this.state.createdCustomerId
        }
        if (this.state.createdStockId != '') {
            delete sendObject['stockid'];
            sendObject.stockid = this.state.createdStockId
        }
        this.putDoc(sendObject).then(res => this.progress(false, res.data.Body.ResponseStatus, res.data.Body))
    };
    render() {
        //#region important arrays start
        lowerCaseMarks = []
        newArrStocks = []
        customCascaderStock = []

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


        Object.values(this.props.state.groups.groups).map(d => {
            d.ParentId === '00000000-0000-0000-0000-000000000000' ? pid = '' : pid = d.ParentId
            customCascaderStock.push({
                "id": d.Id, "name": d.Name, "parent": pid, "value": d.Id, "label": d.Name,
            })
        })
        newArrStocks = convert(customCascaderStock)


        const customerOption = (

            Object.keys(this.props.state.groups.customers).length > 0 && this.state.customerCreate ?
                Object.values(this.props.state.groups.customers).map(c =>
                    <Option key={c.Id}>{c.Name}</Option>
                ) : Object.keys(this.props.state.groups.customers).length === 0 && this.state.customerCreate == false ? <Option key={this.props.doc.CustomerId}>{this.props.doc.CustomerName}</Option> : ''
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
                            stockid: this.props.doc ? this.props.doc.StockId : '',
                            customerid: this.props.doc ? this.props.doc.CustomerId : '',
                            status: this.props.doc.Status ? this.props.doc.Status : true,
                            modify: this.props.doc ? moment(this.props.doc.Modify) : '',
                            moment: this.props.doc ? moment(this.props.doc.Moment) : '',
                            id: this.props.doc ? this.props.doc.Id : this.state.editid ? this.state.editid : '',
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
                                        >

                                            {this.props.state.groups.loading ? '' : customerOption}

                                        </Select>

                                    </Form.Item>
                                    <PlusOutlined style={{ margin: '0' }} onClick={this.showDrawer} className='add_elements' />
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
                                        treeData={newArrStocks.children}
                                    />

                                </Form.Item>
                                <PlusOutlined onClick={this.showStockDrawer} className='add_elements' />

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
                <CreateCustomerModal from='createDemand' visible={this.state.visibleCustomer} childrenDrawer={this.state.childrenDrawer} onClose={this.onClose} showChildrenDrawer={this.showChildrenDrawer} onChildrenDrawerClose={this.onChildrenDrawerClose} />
                <CreateStockModal visible={this.state.visibleStock} onClose={this.onCloseStock} />

            </>



        )
    }
}

const mapStateToProps = (state) => ({
    state

})

const mapDispatchToProps = {
    putData, getMarks, getCustomersData, updateCustomerSelect, deleteResponseService, getProductsModal, getProductsGroupModal, getGroups, getStocksGroupsModal, getCustomers, getCustomersFast, putLocalStates, getCustomerGroupsModal
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(DemandFormComponent, 'datas'))
