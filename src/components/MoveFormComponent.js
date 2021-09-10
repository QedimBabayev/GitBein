import React, { Component } from 'react'
import { connect } from 'react-redux'
import Trans from '../usetranslation/Trans';
import { deleteResponseService } from '../actions/putAactions/deleteResponseService';
import { putLocalStates } from '../actions/modalActions/putModalInputs-action';
import { getCustomers, getCustomersFast } from '../actions/getCustomerGroups-action';
import getMarks from '../actions/getMarks-action'
import { getGroups } from '../actions/getGroups-action';
import LoaderHOC from './LoaderHOC';
import { getCustomerGroupsModal, getStocksGroupsModal, productModalFilter, getProductsModal, getProductsGroupModal } from '../actions/modalActions/getCustomerGroupsModal-action';
import CreateCustomerModal from '../modal/CreateCustomerModal';
import { getCustomersData, updateCustomerSelect } from '../actions/getCustomerGroups-action';
import CreateStockModal from '../modal/CreateStockModal';
import { poistionArray, description } from './DocTable';
import putData from '../actions/putAactions/putData-action';
import { API_BASE } from '../config/env';
import axios from 'axios';
import { getToken } from '../config/token';
import moment from 'moment';
import {
    Form, Input, message, Button, InputNumber, TreeSelect, Checkbox, Dropdown, DatePicker, Switch, Select, Spin, Tag, Divider, Menu, Col, Row, Collapse
} from 'antd';

import {
    PlusOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Null_Content } from '../config/env';
import AddStockModal from '../modal/AddStockModal';
import './ButtonsWrapper.css'
import './DocForm.css'
const { Option, OptGroup } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
var newArrStocks = []
var customCascaderStock = [];
var customCascaderCustomer = [];
var newArrStocks = []
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

class MoveFormComponent extends Component {

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
        stockFromCreate:false,
        moveFrom:false,
        createdCustomerId: '',
        createdStockId: '',
        createdFromStockId: '',
        createdCustomerName: ''

    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.state.putdatas.responseStockId.ResponseService) {
            if (nextProps.state.putdatas.responseStockId.ResponseService != this.props.state.putdatas.responseStockId.ResponseService) {
                this.setState({
                    stockCreate: true,
                    createdStockId: nextProps.state.putdatas.responseStockId.ResponseService
                }, () => {
                    this.formRef.current.setFieldsValue({
                        stocktoid: nextProps.state.docmodals.localStates.name,
                    })
                })

            }
            else {
                this.setState({
                    stockCreate: false
                })
            }
        }

        if (nextProps.state.putdatas.responseFromStockId.ResponseService) {
            if (nextProps.state.putdatas.responseFromStockId.ResponseService != this.props.state.putdatas.responseFromStockId.ResponseService) {
                this.setState({
                    stockFromCreate: true,
                    createdFromStockId: nextProps.state.putdatas.responseFromStockId.ResponseService
                }, () => {
                    this.formRef.current.setFieldsValue({
                        stockfromid: nextProps.state.docmodals.localStates.name,
                    })
                })

            }
            else {
                this.setState({
                    stockFromCreate: false
                })
            }
        }

    }
    showDrawer = () => {
        this.setState({
            visibleCustomer: true,
        });
        this.props.deleteResponseService()
        this.props.getCustomerGroupsModal()
        this.props.putLocalStates('')
    };

    showStockDrawer = (bool) => {
        console.log(bool)
        this.setState({
            visibleStock: true,
            moveFrom:bool
        });
        this.props.deleteResponseService()
        this.props.getStocksGroupsModal()
        this.props.putLocalStates('')
    };

    onClose = () => {
        this.setState({
            visibleCustomer: false,
            moveFrom:false
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
        const res = await axios.post(`${API_BASE}/moves/put.php`, object);
        return await res;
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

    onChange = (value, option) => {
        this.props.getCustomersData(value)
    }

    onFinish = (values) => {
        var sendObject = {}
        sendObject = values;
        sendObject.positions = poistionArray
        sendObject.moment = values.moment._i
        sendObject.modify = values.modify._i
        sendObject.description = description
        sendObject.token = getToken()
        this.progress(true)
        if (this.state.createdFromStockId != '') {
            delete sendObject['stockfromid'];
            sendObject.stockfromid = this.state.createdFromStockId
        }
        if (this.state.createdStockId != '') {
            delete sendObject['stocktoid'];
            sendObject.stocktoid = this.state.createdStockId
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
                            stockfromid: this.props.doc ? this.props.doc.StockFromId : '',
                            stocktoid: this.props.doc ? this.props.doc.StockToId : '',
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
                                        label={<Trans word={'Doc Number'} />}
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

                                    label={<Trans word={'StockTo Groups'} />}
                                    name='stocktoid'
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
                                <PlusOutlined onClick={() =>this.showStockDrawer(false)} className='add_elements' />


                            </div>
                        </Col>
                        <Col xs={24} md={18} xl={10}>
                            <div className='form_item_with_icon'>
                                <Form.Item

                                    label={<Trans word={'StockFrom Groups'} />}
                                    name='stockfromid'
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
                                <PlusOutlined onClick={() =>this.showStockDrawer(true)} className='add_elements' />

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
                <CreateStockModal moveFrom={this.state.moveFrom} visible={this.state.visibleStock} onClose={this.onCloseStock} />

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

export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(MoveFormComponent, 'datas'))
