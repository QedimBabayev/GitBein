import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Menu, Dropdown, Popconfirm, Form, Space, Typography, Switch, Checkbox, Statistic, Select, Row, Col } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { updateSelectProductMultiConfirm } from '../actions/updateStates-action';
import { getCustomerGroupsModal, getStocksGroupsModal, productModalFilter, getProductsModal, getProductsGroupModal } from '../actions/modalActions/getCustomerGroupsModal-action';
import CreateProductAndProductGroup from '../modal/CreateProductAndProductGroup';
import CreateProductFormModal from '../modal/CreateProductModal'
import { putAddedPoisitons } from '../actions/putAactions/putAddedPoisitons';
import { deleteResponseService } from '../actions/putAactions/deleteResponseService';
import { putLocalStates } from '../actions/modalActions/putModalInputs-action';
import { updateSelectedRows } from '../actions/updateStates-action';
import Demo from './AddProductInput'
import { updatePositions } from '../actions/updateProduct';
import { fetchAttributes } from '../actions/getAttributes-action';
import { Tab } from 'semantic-ui-react'
import OrgChartLinkedDocs from './OrgChartLinkedDocs';
import getLinks from '../actions/getLinks-action';
import Trans from '../usetranslation/Trans';
import './DocTable.css'

import {
    PlusOutlined,
    SettingOutlined,
    DeleteOutlined,
    PoweroffOutlined,
    CheckSquareOutlined
} from '@ant-design/icons';
import AddProInput from './AddProInput';
import { parse } from 'query-string';
import CreateProductModal from '../modal/CreateProductModal';
import { filter } from 'dom-helpers';
import { replace } from 'lodash';
import { ConvertDecimal } from '../Function/convertNumberDecimal';
const EditableContext = React.createContext(null);
const { Option } = Select;
const { TextArea } = Input;

export var poistionArray = []
export var description;
var inputsNameArray = []


function PositionArray(arr) {
    poistionArray = arr
}
const onChangeDescription = e => {
    description = e.target.value
};
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
function AddRepeatProduct(prevdatasource, i, newdata) {
    var quantity = parseFloat(prevdatasource[i].Quantity)
    const item = prevdatasource[i];
    quantity++;
    var totalprice = quantity * parseFloat(prevdatasource[i].SellPrice)
    var totalcostprice = quantity * parseFloat(prevdatasource[i].CostPrice)
    newdata.ShowPacket = false
    newdata.Quantity = quantity
    newdata.TotalPrice = totalprice
    newdata.CostPriceTotal = totalcostprice
    newdata.Price = prevdatasource[i].SellPrice
    prevdatasource.splice(i, 1);
    prevdatasource.unshift(newdata)
    return prevdatasource
}

var columnsPassed = []

export const addNewRow = (fromInput) => {
    return fromInput

}
const EditableCell = ({
    title,
    editable,
    switchable,
    children,
    dataIndex,
    record,
    handleSave,
    handlePacket,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);


    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };



    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });

        } catch (errInfo) {
        }
    };


    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

var switchcase = false
var linkedArray = []
var customPositions = []
var changedPositions = []
export var arrPosition = []
var headerColumns = []



function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
}


class DocTable extends React.Component {

    constructor(props) {
        super(props);
        customPositions = []
        props.datasource ? Object.values(this.props.datasource).map(d => customPositions.push(d)) : console.log('')
        // customposition array add key and totaolprice datas
        customPositions.map(c =>
            c.key = c.ProductId,
        )
        customPositions.map(c =>
            c.TotalPrice = parseFloat(c.Price) * parseFloat(c.Quantity)
        )

        customPositions.map(c =>
            c.CostPriceTotal = parseFloat(c.CostPrice) * parseFloat(c.Quantity)
        )
   


        this.state = {
            searchText: '',
            searchedColumn: '',
            selectedRowKeys: [],
            customDatas: customPositions,
            dataSource: customPositions,
            addSource: customPositions,
            showpacket: false,
            defaultPacket: 'pc',
            showDrawerProduct: false,
            showDrawerProductGroup: false,
            selectedrow: [],
            selectedid: [],
            columns: [],
            initialCols: [],
            visibleMenuSettings: false,


        };
        columnsPassed = this.columns

    }


    showDrawer = () => {
        this.setState({
            showDrawerProduct: true,
        });
        productModalFilter.id = ''
        productModalFilter.gp = ''
        this.props.updatePositions(true, '')
        this.props.deleteResponseService()
        this.props.getProductsGroupModal(productModalFilter)
        this.props.fetchAttributes('attributes', 'product')
        this.props.putLocalStates('')
    };


    showChildrenDrawer = () => {
        this.setState({
            showDrawerProductGroup: true,
        });
        productModalFilter.id = ''
        productModalFilter.gp = ''
        this.props.getProductsGroupModal(productModalFilter)
    };

    onChildrenDrawerClose = () => {
        this.setState({
            showDrawerProductGroup: false,
        });
        productModalFilter.id = ''
        productModalFilter.gp = ''
        this.props.getProductsGroupModal(productModalFilter)
    };

    onClose = () => {
        this.setState({
            showDrawerProduct: false,
        }, () => {
            this.props.updateSelectProductMultiConfirm(false, true)
        });
    };

    handleOpenCatalaog = () => {
        this.setState({
            visibleCatalog: true
        })
        productModalFilter.id = ''
        productModalFilter.gp = ''
        const barcodes = this.state.dataSource.map(r => r.BarCode);
        this.setState({
            selectedrow: this.state.dataSource,
            selectedid: barcodes
        }, () => {
            this.props.updateSelectedRows(this.state.selectedrow, this.state.selectedid)
        })

        this.props.getProductsGroupModal(productModalFilter)
        this.props.updateSelectProductMultiConfirm(false, false, false, this.state.dataSource)


    }

    handleCloseCatalog = () => {
        this.setState({
            visibleCatalog: false
        })
        this.props.updateSelectProductMultiConfirm(true, false, false, this.state.dataSource)

    }

    handleCloseCatalogGancel = () => {
        this.setState({
            visibleCatalog: false
        })
        this.props.updateSelectProductMultiConfirm(false, false, false)

    }

    handleVisibleChange = flag => {
        this.setState({ visibleMenuSettings: flag });
    };
    componentDidMount() {
        if (this.props.from === 'demands') {
            headerColumns = [
                {
                    title: '№',
                    dataIndex: 'Order',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Order'),
                    sorter: (a, b) => a.Order.length - b.Order.length,
                    render: (text, record, index) => index + 1,

                },
                {
                    title: 'Adı',
                    dataIndex: 'Name',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Name'),
                    sorter: (a, b) => a.Name.length - b.Name.length,
                },
                {
                    title: 'Barkodu',
                    dataIndex: 'BarCode',
                    isVisible: true,
                    editable: false,
                    ...this.getColumnSearchProps('BarCode'),
                    sorter: (a, b) => a.BarCode.length - b.BarCode.length,

                },
                {
                    title: 'Miqdar',
                    dataIndex: 'Quantity',
                    isVisible: true,

                    editable: true,
                    ...this.getColumnSearchProps('Quantity'),
                    sortDirections: ['descend', 'ascend'],
                    render: (_, record) =>

                        record.IsPack === 1 ? (

                            <div className='packOrQuantityWrapper'>
                                {record.ShowPacket ? `${record.Quantity}  (${record.ChangePackQuantity})` : record.Quantity}
                                <Select
                                    labelInValue
                                    style={{ width: 120 }}
                                    value={{ value: record.ShowPacket ? "pack" : "pc" }}
                                    defaultValue={{ value: "pc" }}
                                    onChange={() => this.handleChange(record)}
                                    onSelect={(e) => this.onSelect(e, record)}
                                    onClick={handleClick}
                                >
                                    <Option value="pc">Əd</Option>
                                    <Option value="pack">Paket</Option>
                                </Select>
                            </div>

                        ) : <div className='packOrQuantityWrapper'>{record.Quantity}     <Select
                            className='disabledPacket'
                            labelInValue
                            showArrow={false}
                            defaultValue={{ value: 'pc' }}
                            disabled={true}
                            style={{ width: 120 }}
                            onChange={() => this.handleChange(record)}
                        >
                            <Option value="pc">Əd</Option>
                        </Select></div>,

                },


                {
                    title: 'Satış Qiyməti',
                    dataIndex: 'Price',
                    isVisible: true,
                    editable: true,
                    ...this.getColumnSearchProps('Price'),
                    sortDirections: ['descend', 'ascend'],


                },
                {
                    title: 'Məbləğ',
                    dataIndex: 'TotalPrice',
                    isVisible: true,
                    editable: true,

                    ...this.getColumnSearchProps('CostPrice'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Qalıq',
                    dataIndex: 'StockQuantity',
                    isVisible: true,
                    editable: false,

                    ...this.getColumnSearchProps('StockQuantity'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Sil',
                    dataIndex: 'operation',
                    isVisible: true,
                    editable: false,
                    render: (_, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Typography.Link >
                                <Popconfirm title="Silməyə əminsinizmi?" okText="Bəli" cancelText="Xeyr" onConfirm={() => this.handleDelete(record.key)}>
                                    <a>Sil</a>
                                </Popconfirm>
                            </Typography.Link>

                        ) : null,


                },
            ];

            this.setState({
                columns: headerColumns.filter(c => c.isVisible == true),
                initialCols: headerColumns,
            })
        }
        if (this.props.from === 'demandreturns') {
            headerColumns = [
                {
                    title: '№',
                    dataIndex: 'Order',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Order'),
                    sorter: (a, b) => a.Order.length - b.Order.length,
                    render: (text, record, index) => index + 1,

                },
                {
                    title: 'Adı',
                    dataIndex: 'Name',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Name'),
                    sorter: (a, b) => a.Name.length - b.Name.length,
                },
                {
                    title: 'Barkodu',
                    dataIndex: 'BarCode',
                    isVisible: true,
                    editable: false,
                    ...this.getColumnSearchProps('BarCode'),
                    sorter: (a, b) => a.BarCode.length - b.BarCode.length,

                },
                {
                    title: 'Miqdar',
                    dataIndex: 'Quantity',
                    isVisible: true,

                    editable: true,
                    ...this.getColumnSearchProps('Quantity'),
                    sortDirections: ['descend', 'ascend'],
                    render: (_, record) =>

                        record.IsPack === 1 ? (

                            <div className='packOrQuantityWrapper'>
                                {record.ShowPacket ? `${record.Quantity}  (${record.ChangePackQuantity})` : record.Quantity}
                                <Select
                                    labelInValue
                                    style={{ width: 120 }}
                                    value={{ value: record.ShowPacket ? "pack" : "pc" }}
                                    defaultValue={{ value: "pc" }}
                                    onChange={() => this.handleChange(record)}
                                    onSelect={(e) => this.onSelect(e, record)}
                                    onClick={handleClick}
                                >
                                    <Option value="pc">Əd</Option>
                                    <Option value="pack">Paket</Option>
                                </Select>
                            </div>

                        ) : <div className='packOrQuantityWrapper'>{record.Quantity}     <Select
                            className='disabledPacket'
                            labelInValue
                            showArrow={false}
                            defaultValue={{ value: 'pc' }}
                            disabled={true}
                            style={{ width: 120 }}
                            onChange={() => this.handleChange(record)}
                        >
                            <Option value="pc">Əd</Option>
                        </Select></div>,

                },


                {
                    title: 'Satış Qiyməti',
                    dataIndex: 'Price',
                    isVisible: true,
                    editable: true,
                    ...this.getColumnSearchProps('Price'),
                    sortDirections: ['descend', 'ascend'],


                },
                {
                    title: 'Məbləğ',
                    dataIndex: 'TotalPrice',
                    isVisible: true,
                    editable: true,

                    ...this.getColumnSearchProps('CostPrice'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Qalıq',
                    dataIndex: 'StockQuantity',
                    isVisible: true,
                    editable: false,

                    ...this.getColumnSearchProps('StockQuantity'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Sil',
                    dataIndex: 'operation',
                    isVisible: true,
                    editable: false,
                    render: (_, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Typography.Link >
                                <Popconfirm title="Silməyə əminsinizmi?" okText="Bəli" cancelText="Xeyr" onConfirm={() => this.handleDelete(record.key)}>
                                    <a>Sil</a>
                                </Popconfirm>
                            </Typography.Link>

                        ) : null,


                },
            ];

            this.setState({
                columns: headerColumns.filter(c => c.isVisible == true),
                initialCols: headerColumns,
            })
        }
        if (this.props.from === 'sales') {
            headerColumns = [
                {
                    title: '№',
                    dataIndex: 'Order',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Order'),
                    sorter: (a, b) => a.Order.length - b.Order.length,
                    render: (text, record, index) => index + 1,

                },
                {
                    title: 'Adı',
                    dataIndex: 'Name',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Name'),
                    sorter: (a, b) => a.Name.length - b.Name.length,
                },
                {
                    title: 'Barkodu',
                    dataIndex: 'BarCode',
                    isVisible: true,
                    editable: false,
                    ...this.getColumnSearchProps('BarCode'),
                    sorter: (a, b) => a.BarCode.length - b.BarCode.length,

                },
                {
                    title: 'Miqdar',
                    dataIndex: 'Quantity',
                    isVisible: true,

                    editable: false,
                    ...this.getColumnSearchProps('Quantity'),
                    sortDirections: ['descend', 'ascend'],
                    render: (_, record) =>

                        record.IsPack === 1 ? (

                            <div className='packOrQuantityWrapper'>
                                {record.ShowPacket ? `${record.Quantity}  (${record.ChangePackQuantity})` : record.Quantity}
                                <Select
                                    labelInValue
                                    style={{ width: 120 }}
                                    value={{ value: record.ShowPacket ? "pack" : "pc" }}
                                    defaultValue={{ value: "pc" }}
                                    onChange={() => this.handleChange(record)}
                                    onSelect={(e) => this.onSelect(e, record)}
                                    onClick={handleClick}
                                >
                                    <Option value="pc">Əd</Option>
                                    <Option value="pack">Paket</Option>
                                </Select>
                            </div>

                        ) : <div className='packOrQuantityWrapper'>{record.Quantity}     <Select
                            className='disabledPacket'
                            labelInValue
                            showArrow={false}
                            defaultValue={{ value: 'pc' }}
                            disabled={true}
                            style={{ width: 120 }}
                            onChange={() => this.handleChange(record)}
                        >
                            <Option value="pc">Əd</Option>
                        </Select></div>,

                },


                {
                    title: 'Satış Qiyməti',
                    dataIndex: 'Price',
                    isVisible: true,
                    editable: false,
                    ...this.getColumnSearchProps('Price'),
                    sortDirections: ['descend', 'ascend'],


                },
                {
                    title: 'Məbləğ',
                    dataIndex: 'TotalPrice',
                    isVisible: true,
                    editable: false,

                    ...this.getColumnSearchProps('CostPrice'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Qalıq',
                    dataIndex: 'StockQuantity',
                    isVisible: true,
                    editable: false,

                    ...this.getColumnSearchProps('StockQuantity'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Endirim',
                    dataIndex: 'Discount',
                    isVisible: true,
                    editable: false,

                    ...this.getColumnSearchProps('Discount'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Sil',
                    dataIndex: 'operation',
                    isVisible: true,
                    editable: false,
                    render: (_, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Typography.Link >
                                <Popconfirm title="Silməyə əminsinizmi?" okText="Bəli" cancelText="Xeyr" onConfirm={() => this.handleDelete(record.key)}>
                                    <a>Sil</a>
                                </Popconfirm>
                            </Typography.Link>

                        ) : null,


                },
            ];

            this.setState({
                columns: headerColumns.filter(c => c.isVisible == true),
                initialCols: headerColumns,
            })
        }
        else if (this.props.from === 'enters') {
            headerColumns = [
                {
                    title: '№',
                    dataIndex: 'Order',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Order'),
                    sorter: (a, b) => a.Order.length - b.Order.length,
                    render: (text, record, index) => index + 1,

                },
                {
                    title: 'Adı',
                    dataIndex: 'Name',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Name'),
                    sorter: (a, b) => a.Name.length - b.Name.length,
                },
                {
                    title: 'Barkodu',
                    dataIndex: 'BarCode',
                    isVisible: true,
                    editable: false,
                    ...this.getColumnSearchProps('BarCode'),
                    sorter: (a, b) => a.BarCode.length - b.BarCode.length,

                },
                {
                    title: 'Miqdar',
                    dataIndex: 'Quantity',
                    isVisible: true,

                    editable: true,
                    ...this.getColumnSearchProps('Quantity'),
                    sortDirections: ['descend', 'ascend'],
                    render: (_, record) =>

                        record.IsPack === 1 ? (

                            <div className='packOrQuantityWrapper'>
                                {record.ShowPacket ? `${record.Quantity}  (${record.ChangePackQuantity})` : record.Quantity}
                                <Select
                                    labelInValue
                                    style={{ width: 120 }}
                                    value={{ value: record.ShowPacket ? "pack" : "pc" }}
                                    defaultValue={{ value: "pc" }}
                                    onChange={() => this.handleChange(record)}
                                    onSelect={(e) => this.onSelect(e, record)}
                                    onClick={handleClick}
                                >
                                    <Option value="pc">Əd</Option>
                                    <Option value="pack">Paket</Option>
                                </Select>
                            </div>

                        ) : <div className='packOrQuantityWrapper'>{record.Quantity}     <Select
                            className='disabledPacket'
                            labelInValue
                            showArrow={false}
                            defaultValue={{ value: 'pc' }}
                            disabled={true}
                            style={{ width: 120 }}
                            onChange={() => this.handleChange(record)}
                        >
                            <Option value="pc">Əd</Option>
                        </Select></div>,

                },


                {
                    title: 'Qiyməti',
                    dataIndex: 'Price',
                    isVisible: true,
                    editable: true,
                    ...this.getColumnSearchProps('Price'),
                    sortDirections: ['descend', 'ascend'],


                },
                {
                    title: 'Məbləğ',
                    dataIndex: 'TotalPrice',
                    isVisible: true,
                    editable: true,

                    ...this.getColumnSearchProps('CostPrice'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Qalıq',
                    dataIndex: 'StockQuantity',
                    isVisible: true,
                    editable: false,

                    ...this.getColumnSearchProps('StockQuantity'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Sil',
                    dataIndex: 'operation',
                    isVisible: true,
                    editable: false,
                    render: (_, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Typography.Link >
                                <Popconfirm title="Silməyə əminsinizmi?" okText="Bəli" cancelText="Xeyr" onConfirm={() => this.handleDelete(record.key)}>
                                    <a>Sil</a>
                                </Popconfirm>
                            </Typography.Link>

                        ) : null,


                },
            ];

            this.setState({
                columns: headerColumns.filter(c => c.isVisible == true),
                initialCols: headerColumns,
            })
        }
        else if (this.props.from === 'losses') {
            headerColumns = [
                {
                    title: '№',
                    dataIndex: 'Order',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Order'),
                    sorter: (a, b) => a.Order.length - b.Order.length,
                    render: (text, record, index) => index + 1,

                },
                {
                    title: 'Adı',
                    dataIndex: 'Name',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Name'),
                    sorter: (a, b) => a.Name.length - b.Name.length,
                },
                {
                    title: 'Barkodu',
                    dataIndex: 'BarCode',
                    isVisible: true,
                    editable: false,
                    ...this.getColumnSearchProps('BarCode'),
                    sorter: (a, b) => a.BarCode.length - b.BarCode.length,

                },
                {
                    title: 'Miqdar',
                    dataIndex: 'Quantity',
                    isVisible: true,

                    editable: true,
                    ...this.getColumnSearchProps('Quantity'),
                    sortDirections: ['descend', 'ascend'],
                    render: (_, record) =>

                        record.IsPack === 1 ? (

                            <div className='packOrQuantityWrapper'>
                                {record.ShowPacket ? `${record.Quantity}  (${record.ChangePackQuantity})` : record.Quantity}
                                <Select
                                    labelInValue
                                    style={{ width: 120 }}
                                    value={{ value: record.ShowPacket ? "pack" : "pc" }}
                                    defaultValue={{ value: "pc" }}
                                    onChange={() => this.handleChange(record)}
                                    onSelect={(e) => this.onSelect(e, record)}
                                    onClick={handleClick}
                                >
                                    <Option value="pc">Əd</Option>
                                    <Option value="pack">Paket</Option>
                                </Select>
                            </div>

                        ) : <div className='packOrQuantityWrapper'>{record.Quantity}     <Select
                            className='disabledPacket'
                            labelInValue
                            showArrow={false}
                            defaultValue={{ value: 'pc' }}
                            disabled={true}
                            style={{ width: 120 }}
                            onChange={() => this.handleChange(record)}
                        >
                            <Option value="pc">Əd</Option>
                        </Select></div>,

                },


                {
                    title: 'Qiyməti',
                    dataIndex: 'Price',
                    isVisible: true,
                    editable: true,
                    ...this.getColumnSearchProps('Price'),
                    sortDirections: ['descend', 'ascend'],


                },
                {
                    title: 'Məbləğ',
                    dataIndex: 'TotalPrice',
                    isVisible: true,
                    editable: true,

                    ...this.getColumnSearchProps('CostPrice'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Qalıq',
                    dataIndex: 'StockQuantity',
                    isVisible: true,
                    editable: false,

                    ...this.getColumnSearchProps('StockQuantity'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Sil',
                    dataIndex: 'operation',
                    isVisible: true,
                    editable: false,
                    render: (_, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Typography.Link >
                                <Popconfirm title="Silməyə əminsinizmi?" okText="Bəli" cancelText="Xeyr" onConfirm={() => this.handleDelete(record.key)}>
                                    <a>Sil</a>
                                </Popconfirm>
                            </Typography.Link>

                        ) : null,


                },
            ];

            this.setState({
                columns: headerColumns.filter(c => c.isVisible == true),
                initialCols: headerColumns,
            })
        }
        else if (this.props.from === 'moves') {
            headerColumns = [
                {
                    title: '№',
                    dataIndex: 'Order',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Order'),
                    sorter: (a, b) => a.Order.length - b.Order.length,
                    render: (text, record, index) => index + 1,

                },
                {
                    title: 'Adı',
                    dataIndex: 'Name',
                    editable: false,
                    isVisible: true,
                    ...this.getColumnSearchProps('Name'),
                    sorter: (a, b) => a.Name.length - b.Name.length,
                },
                {
                    title: 'Barkodu',
                    dataIndex: 'BarCode',
                    isVisible: true,
                    editable: false,
                    ...this.getColumnSearchProps('BarCode'),
                    sorter: (a, b) => a.BarCode.length - b.BarCode.length,

                },
                {
                    title: 'Miqdar',
                    dataIndex: 'Quantity',
                    isVisible: true,

                    editable: true,
                    ...this.getColumnSearchProps('Quantity'),
                    sortDirections: ['descend', 'ascend'],
                    render: (_, record) =>

                        record.IsPack === 1 ? (

                            <div className='packOrQuantityWrapper'>
                                {record.ShowPacket ? `${record.Quantity}  (${record.ChangePackQuantity})` : record.Quantity}
                                <Select
                                    labelInValue
                                    style={{ width: 120 }}
                                    value={{ value: record.ShowPacket ? "pack" : "pc" }}
                                    defaultValue={{ value: "pc" }}
                                    onChange={() => this.handleChange(record)}
                                    onSelect={(e) => this.onSelect(e, record)}
                                    onClick={handleClick}
                                >
                                    <Option value="pc">Əd</Option>
                                    <Option value="pack">Paket</Option>
                                </Select>
                            </div>

                        ) : <div className='packOrQuantityWrapper'>{record.Quantity}     <Select
                            className='disabledPacket'
                            labelInValue
                            showArrow={false}
                            defaultValue={{ value: 'pc' }}
                            disabled={true}
                            style={{ width: 120 }}
                            onChange={() => this.handleChange(record)}
                        >
                            <Option value="pc">Əd</Option>
                        </Select></div>,

                },


                {
                    title: 'Qiyməti',
                    dataIndex: 'Price',
                    isVisible: true,
                    editable: true,
                    ...this.getColumnSearchProps('Price'),
                    sortDirections: ['descend', 'ascend'],


                },
                {
                    title: 'Məbləğ',
                    dataIndex: 'TotalPrice',
                    isVisible: true,
                    editable: true,

                    ...this.getColumnSearchProps('CostPrice'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Qalıq',
                    dataIndex: 'StockQuantity',
                    isVisible: true,
                    editable: false,

                    ...this.getColumnSearchProps('StockQuantity'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Sil',
                    dataIndex: 'operation',
                    isVisible: true,
                    editable: false,
                    render: (_, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Typography.Link >
                                <Popconfirm title="Silməyə əminsinizmi?" okText="Bəli" cancelText="Xeyr" onConfirm={() => this.handleDelete(record.key)}>
                                    <a>Sil</a>
                                </Popconfirm>
                            </Typography.Link>

                        ) : null,


                },
            ];

            this.setState({
                columns: headerColumns.filter(c => c.isVisible == true),
                initialCols: headerColumns,
            })
        }
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
        console.log(selectedRowKeys)
    };
    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    handleChange = (value) => {
    }
    onSelect = (e, record) => {
        const prevdatasource = [...this.state.dataSource];
        const index = prevdatasource.findIndex((item) => record.key === item.key);
        const item = prevdatasource[index];
        if (e.value === 'pack') {

            item.Price = item.PackPrice
            item.TotalPrice = item.PackPrice * item.Quantity
            item.ShowPacket = true
            prevdatasource.splice(index, 1, { ...item, ...prevdatasource });
            this.setState({
                dataSource: prevdatasource
            })
        }
        else if (e.value === 'pc') {
            item.Price = item.SellPrice
            item.TotalPrice = item.Price * item.Quantity
            item.ShowPacket = false
            prevdatasource.splice(index, 1, { ...item, ...prevdatasource });
            this.setState({
                dataSource: prevdatasource
            })
        }

    }
    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key),
        });
    };
    handleDeleteDataSoruce = () => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== this.state.selectedRowKeys.find(k => k == item.key)),
            selectedRowKeys: []
        })
    }
    handleSwitch = (checked) => {
        var foundedColumnPack = this.columns.find(c => c.dataIndex === 'PackQuantity')
        var foundedColumnPackIndex = this.columns.findIndex(c => c.dataIndex === 'PackQuantity')

        var quantityColumn = this.columns.find(c => c.dataIndex === 'Quantity')
        var quantityColumnIndex = this.columns.findIndex(c => c.dataIndex === 'Quantity')
        foundedColumnPack.isVisible = checked
        foundedColumnPack.editable = checked
        quantityColumn.editable = checked
        var newColumnPack = foundedColumnPack
        var newQuantityColumnPack = quantityColumn
        this.columns.splice(foundedColumnPackIndex, 1, { ...foundedColumnPack, ...newColumnPack });
        this.columns.splice(quantityColumnIndex, 1, { ...quantityColumn, ...newQuantityColumnPack });
        this.setState({
            showpacket: checked
        })
    }
    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        item.Quantity != newData[index].Quantity ? newData.map(n => {
            n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity)
            n.CostPriceTotal = parseFloat(n.CostPrice) * parseFloat(n.Quantity)
            n.ChangePackQuantity = parseFloat(n.PackQuantity) * parseFloat(n.Quantity)
        }
        ) : item.Price != newData[index].Price ? newData.map(n =>
            n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity)
        ) : item.TotalPrice != newData[index].TotalPrice ? newData.map(n =>
            n.Price = parseFloat(n.TotalPrice) / parseFloat(n.Quantity)
        ) : newData.map(n =>
            n.TotalPrice = parseFloat(n.Price) * parseFloat(n.Quantity)
        )
        this.setState({
            dataSource: newData,
        });

    };
    onChange = (e) => {

        var initialCols = this.state.initialCols
        var findelement;
        var findelementindex;
        var replacedElement
        findelement = initialCols.find(c => c.dataIndex === e.target.id)
        findelementindex = initialCols.findIndex(c => c.dataIndex === e.target.id)
        findelement.isVisible = e.target.checked
        replacedElement = findelement
        initialCols.splice(findelementindex, 1, { ...findelement, ...replacedElement });
        var filtered = initialCols.filter(c => c.isVisible == true)
        console.log(filtered)
        this.setState({
            columns: filtered
        })
    }
    handleTabChange = (event, data) => {
        if (data.activeIndex === 1) {
            this.props.getLinks(this.props.linkedid, 'demand')
        }
        else {
        }
    }


    componentWillReceiveProps(nextProps, nextState) {



        if (nextProps.state.stateChanges.isConfirm === true) {
            var duplicateData = false
            var newData = {}
            var index
            var multiselectdatas = []
            if (this.props.from === 'demands') {
                var selectedRows = nextProps.state.stateChanges.selectedRows
                for (let i = 0; i < Object.keys(selectedRows).length; i++) {
                    console.log(selectedRows[i])
                    multiselectdatas.push(
                        newData = {
                            key: selectedRows[i].Id,
                            Id: selectedRows[i].Id,
                            ProductId: selectedRows[i].Id,
                            ArtCode: selectedRows[i].ArtCode,
                            Name: selectedRows[i].Name,
                            BarCode: selectedRows[i].BarCode,
                            Quantity: selectedRows[i].Quantity ? selectedRows[i].Quantity : 1,
                            SellPrice: selectedRows[i].Price,
                            Price: selectedRows[i].Price,
                            TotalPrice: selectedRows[i].Quantity ? (selectedRows[i].Quantity * selectedRows[i].Price) : selectedRows[i].Price,
                            ShowPacket: false,
                            PackQuantity: selectedRows[i].IsPack === 1 ? selectedRows[i].PackQuantity : '',
                            ChangePackQuantity: selectedRows[i].IsPack === 1 ? selectedRows[i].PackQuantity : '',
                            PackPrice: selectedRows[i].IsPack === 1 ? selectedRows[i].PackPrice : '',
                            IsPack: selectedRows[i].IsPack,
                            StockQuantity: selectedRows[i].Quantity ? selectedRows[i].Quantity : '0.00',
                            CostPrice: selectedRows[i].CostPrice,
                            CostPriceTotal: selectedRows[i].CostPriceTotal,
                        }
                    )
                }

                var prevdatasource = [...this.state.dataSource]
                this.setState({
                    dataSource: [...multiselectdatas]
                })

            }



        }
        if (nextProps.state.stateChanges.isNewProduct === true) {
            this.props.updateSelectProductMultiConfirm(false, false, false)
            var newData = {}
            if (this.props.from === 'demands') {
                if (nextProps.state.putdatas.responseProductId != '') {

                    newData = {
                        key: nextProps.state.putdatas.responseProductId.ResponseService,
                        Id: nextProps.state.putdatas.responseProductId.ResponseService,
                        ProductId: nextProps.state.putdatas.responseProductId.ResponseService,
                        ArtCode: nextProps.state.docmodals.localStates.artcode ? nextProps.state.docmodals.localStates.artcode : '',
                        Name: nextProps.state.docmodals.localStates.name ? nextProps.state.docmodals.localStates.name : '',
                        BarCode: nextProps.state.docmodals.localStates.barcode ? String(nextProps.state.docmodals.localStates.barcode) : '',
                        Quantity: 1,
                        SellPrice: nextProps.state.docmodals.localStates.price ? nextProps.state.docmodals.localStates.price : 0,
                        Price: nextProps.state.docmodals.localStates.price ? nextProps.state.docmodals.localStates.price : 0,
                        TotalPrice: nextProps.state.docmodals.localStates.price ? nextProps.state.docmodals.localStates.price : 0,
                        ShowPacket: false,
                        PackQuantity: nextProps.state.docmodals.localStates.ispack === 1 ? nextProps.state.docmodals.localStates.packquantity : '',
                        ChangePackQuantity: nextProps.state.docmodals.localStates.ispack === 1 ? nextProps.state.docmodals.localStates.packquantity : '',
                        PackPrice: nextProps.state.docmodals.localStates.ispack === 1 ? nextProps.state.docmodals.localStates.packprice : '',
                        IsPack: nextProps.state.docmodals.localStates.ispack ? nextProps.state.docmodals.localStates.ispack : 0,
                        StockQuantity: nextProps.state.docmodals.localStates.quantity ? nextProps.state.docmodals.localStates.quantity : '0.00',
                        CostPrice: nextProps.state.docmodals.localStates.costprice ? nextProps.state.docmodals.localStates.costprice : '0.00',
                        CostPriceTotal: nextProps.state.docmodals.localStates.costprice ? nextProps.state.docmodals.localStates.costprice : '0.00',
                    }
                }
                var datas = [...this.state.dataSource]
                datas.unshift(newData)
                this.setState({
                    dataSource: datas
                })

            }



        }

        if (nextProps.state.stateChanges.isAddProduct === true) {
            if (nextProps.state.handleProduct.selectedProduct != '') {
                var prevdatasource = [...this.state.dataSource]
                var duplicateData = false
                var index;
                var newData = {}
                if (this.props.from === 'enters') {
                    newData = {
                        key: nextProps.handleProduct.value,
                        ProductId: nextProps.handleProduct.value,
                        ArtCode: nextProps.handleProduct.artcode,
                        Name: nextProps.handleProduct.name,
                        BarCode: nextProps.handleProduct.barcode,
                        Quantity: nextProps.handleProduct.amount,
                        Price: nextProps.handleProduct.price,
                        TotalPrice: nextProps.handleProduct.totalprice,
                        PackQuantity: nextProps.handleProduct.ispack === 1 ? nextProps.handleProduct.packquantity : '',
                        IsPack: nextProps.handleProduct.ispack,
                        StockQuantity: nextProps.handleProduct.quantity ? nextProps.handleProduct.quantity : '0.00'
                    }
                }
                else if (this.props.from === 'losses') {
                    newData = {
                        key: nextProps.handleProduct.value,
                        ProductId: nextProps.handleProduct.value,
                        ArtCode: nextProps.handleProduct.artcode,
                        Name: nextProps.handleProduct.name,
                        BarCode: nextProps.handleProduct.barcode,
                        Quantity: nextProps.handleProduct.amount,
                        Price: nextProps.handleProduct.price,
                        TotalPrice: nextProps.handleProduct.totalprice,
                        PackQuantity: nextProps.handleProduct.ispack === 1 ? nextProps.handleProduct.packquantity : '',
                        IsPack: nextProps.handleProduct.ispack,
                        StockQuantity: nextProps.handleProduct.quantity ? nextProps.handleProduct.quantity : '0.00'
                    }
                }

                else if (this.props.from === 'moves') {
                    newData = {
                        key: nextProps.handleProduct.value,
                        ProductId: nextProps.handleProduct.value,
                        ArtCode: nextProps.handleProduct.artcode,
                        Name: nextProps.handleProduct.name,
                        BarCode: nextProps.handleProduct.barcode,
                        Quantity: nextProps.handleProduct.amount,
                        Price: nextProps.handleProduct.price,
                        TotalPrice: nextProps.handleProduct.totalprice,
                        PackQuantity: nextProps.handleProduct.ispack === 1 ? nextProps.handleProduct.packquantity : '',
                        IsPack: nextProps.handleProduct.ispack,
                        StockQuantity: nextProps.handleProduct.quantity ? nextProps.handleProduct.quantity : '0.00'
                    }

                }
                else if (this.props.from === 'supplies') {
                    newData = {
                        key: nextProps.handleProduct.key,
                        ProductId: nextProps.handleProduct.key,
                        ArtCode: nextProps.handleProduct.artcode,
                        Name: nextProps.handleProduct.name,
                        BarCode: nextProps.handleProduct.barcode,
                        Quantity: nextProps.handleProduct.amount,
                        Price: nextProps.handleProduct.price,
                        TotalPrice: nextProps.handleProduct.totalprice,
                        StockQuantity: nextProps.handleProduct.quantity ? nextProps.handleProduct.quantity : '0.00',
                        CostPrice: nextProps.handleProduct.costprice,
                        CostPriceTotal: nextProps.handleProduct.costpricetotal,

                    }


                }
                else if (this.props.from === 'demands') {

                    newData = {
                        key: nextProps.state.handleProduct.selectedProduct.value,
                        Id: nextProps.state.handleProduct.selectedProduct.value,
                        ProductId: nextProps.state.handleProduct.selectedProduct.value,
                        ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
                        Name: nextProps.state.handleProduct.selectedProduct.name,
                        BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
                        Quantity: nextProps.state.handleProduct.selectedProduct.amount,
                        SellPrice: nextProps.state.handleProduct.selectedProduct.price,
                        Price: nextProps.state.handleProduct.selectedProduct.price,
                        TotalPrice: nextProps.state.handleProduct.selectedProduct.totalprice,
                        ShowPacket: false,
                        PackQuantity: nextProps.state.handleProduct.selectedProduct.ispack === 1 ? nextProps.state.handleProduct.selectedProduct.packquantity : '',
                        ChangePackQuantity: nextProps.state.handleProduct.selectedProduct.ispack === 1 ? nextProps.state.handleProduct.selectedProduct.packquantity : '',
                        PackPrice: nextProps.state.handleProduct.selectedProduct.ispack === 1 ? nextProps.state.handleProduct.selectedProduct.packprice : '',
                        IsPack: nextProps.state.handleProduct.selectedProduct.ispack,
                        StockQuantity: nextProps.state.handleProduct.selectedProduct.quantity ? nextProps.state.handleProduct.selectedProduct.quantity : '0.00',
                        CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
                        CostPriceTotal: nextProps.state.handleProduct.selectedProduct.costpricetotal,

                    }

                }

                else if (this.props.from === 'demandreturns') {

                    newData = {
                        key: nextProps.state.handleProduct.selectedProduct.value,
                        Id: nextProps.state.handleProduct.selectedProduct.value,
                        ProductId: nextProps.state.handleProduct.selectedProduct.value,
                        ArtCode: nextProps.state.handleProduct.selectedProduct.artcode,
                        Name: nextProps.state.handleProduct.selectedProduct.name,
                        BarCode: nextProps.state.handleProduct.selectedProduct.barcode,
                        Quantity: nextProps.state.handleProduct.selectedProduct.amount,
                        SellPrice: nextProps.state.handleProduct.selectedProduct.price,
                        Price: nextProps.state.handleProduct.selectedProduct.price,
                        TotalPrice: nextProps.state.handleProduct.selectedProduct.totalprice,
                        ShowPacket: false,
                        PackQuantity: nextProps.state.handleProduct.selectedProduct.ispack === 1 ? nextProps.state.handleProduct.selectedProduct.packquantity : '',
                        ChangePackQuantity: nextProps.state.handleProduct.selectedProduct.ispack === 1 ? nextProps.state.handleProduct.selectedProduct.packquantity : '',
                        PackPrice: nextProps.state.handleProduct.selectedProduct.ispack === 1 ? nextProps.state.handleProduct.selectedProduct.packprice : '',
                        IsPack: nextProps.state.handleProduct.selectedProduct.ispack,
                        StockQuantity: nextProps.state.handleProduct.selectedProduct.quantity ? nextProps.state.handleProduct.selectedProduct.quantity : '0.00',
                        CostPrice: nextProps.state.handleProduct.selectedProduct.costprice,
                        CostPriceTotal: nextProps.state.handleProduct.selectedProduct.costpricetotal,

                    }

                }

                prevdatasource.find(pd => pd.key === newData.key) ? duplicateData = true : duplicateData = false
                index = prevdatasource.findIndex((pd) => pd.key === newData.key);
                console.log('geldi',newData)
                if (duplicateData === false) {
                    var datas = [...this.state.dataSource]
                    datas.unshift(newData)
                    this.setState({
                        dataSource: datas
                    })
                }
                else {

                    this.setState({
                        dataSource: AddRepeatProduct(prevdatasource, index, newData),
                    })

                }

            }
        }
    }
    render() {
        const { dataSource, selectedRowKeys } = this.state;
        changedPositions = dataSource
        var sumtotalprices = 0;
        var sumcount = 0;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
                Table.SELECTION_NONE,
                {
                    key: 'odd',
                    text: 'Select Odd Row',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return false;
                            }
                            return true;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
                {
                    key: 'even',
                    text: 'Select Even Row',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return true;
                            }
                            return false;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
            ],
        };


        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.state.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        linkedArray = []
        if (this.props.from === 'demands') {
            this.props.state.links.links.map(link => {
                linkedArray.push({
                    id: link.Id,
                    name: link.Name,
                    title: link.DocType
                })
            })
        }
        const menu = (

            <Menu>
                <Menu.ItemGroup title={<Trans word={'columns'} />} >
                    {
                        Object.values(this.state.initialCols).map(d => (
                            <Menu.Item key={d.dataIndex}><Checkbox id={d.dataIndex} disabled={this.state.columns.length === 3 && d.isVisible === true ? true : false} isVisible={d.isVisible} onChange={this.onChange} defaultChecked={d.isVisible} >{d.title}</Checkbox></Menu.Item>
                        ))
                    }
                </Menu.ItemGroup>
            </Menu>

        )
        const panes = [
            {
                menuItem: 'Əsas',
                render: () => <Tab.Pane attached={false}>
                    <div className='selectedItemsWrapper'>
                        <Dropdown
                            overlay={menu}
                            onVisibleChange={this.handleVisibleChange}
                            visible={this.state.visibleMenuSettings}
                        >
                            <Button className='flex_directon_col_center'> <SettingOutlined /></Button>
                        </Dropdown>


                        <p className='selectedItems' style={{ display: this.state.selectedRowKeys.length > 0 ? 'flex' : 'none' }}>Seçilib : {this.state.selectedRowKeys.length} <DeleteOutlined onClick={this.handleDeleteDataSoruce} /></p>
                    </div>

                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        className='doctable'
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{ pageSize: 100 }}
                        rowSelection={rowSelection}
                        locale={{ emptyText: 'Məhsul yoxdur...' }}
                    />



                </Tab.Pane>,
            },
            {
                menuItem: 'Əlaqəli sənədlər',
                render: () =>
                    <Tab.Pane attached={false}>

                        <OrgChartLinkedDocs nodes={linkedArray} />
                    </Tab.Pane>,
            },
        ]
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

        if (this.props.from === 'sales') {


            Object.values(this.state.dataSource).map(c => {
                c.BasicPrice != 0 ? c.Discount = ConvertDecimal(parseFloat((c.BasicPrice - c.Price) / c.BasicPrice * 100)) + ' %' : c.Discount = ConvertDecimal(0) + ' %'
            })

        }

        const tablePart = (


            <Row className='addProductInputWrapper'>
                <Col xs={24} md={12} xl={9}>
                    <div className='addProductInputIcon'>
                        <AddProInput positions={this.state.dataSource} />
                        <PlusOutlined className='addNewProductIcon' onClick={this.showDrawer} />
                    </div>
                </Col>
                <Col xs={24} md={12} xl={3} className='catalog_button_wrapper'>

                    <Button type="primary" icon={<CheckSquareOutlined />} onClick={this.handleOpenCatalaog}>
                        Kataloq
                    </Button>

                </Col>


            </Row>
        )
        return (
            <div>
                <CreateProductAndProductGroup visible={this.state.visibleCatalog} closeCtalaog={this.handleCloseCatalog} closeCtalaogGancel={this.handleCloseCatalogGancel} />
                <CreateProductModal attrInputs={inputsNameArray} visible={this.state.showDrawerProduct} childrenDrawer={this.state.showDrawerProductGroup} onClose={this.onClose} showChildrenDrawer={this.showChildrenDrawer} onChildrenDrawerClose={this.onChildrenDrawerClose} />
                {
                    this.props.from === 'sales' ? '' : tablePart
                }

                <Tab menu={{ attached: false }} onTabChange={this.handleTabChange} panes={panes} />
                {
                    PositionArray(dataSource)
                }

                <Row>
                    <Col xs={24} md={12} xl={12}>

                        <Form.Item name="description" label={<Trans word={'Description'} />}>
                            <TextArea onChange={onChangeDescription} rows={3} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} xl={12}>
                        {
                            dataSource.map(d => {
                                sumtotalprices += parseFloat(d.TotalPrice)
                                sumcount += parseFloat(d.ShowPacket ? d.ChangePackQuantity : d.Quantity)
                            })

                        }



                        <div className='doc_info_wrapper'>
                            <div>
                                <Statistic className='doc_info_text' title="" value={ConvertDecimal(sumtotalprices)} prefix={'Toplam məbləğ: '} suffix={'₼'} />
                                <Statistic className='doc_info_text doc_info_secondary' title="" value={sumcount} prefix={'Miqdar: '} suffix={'əd'} />
                                <Statistic className='doc_info_text doc_info_secondary edit' title="" value={ConvertDecimal(isNaN(sumtotalprices - this.props.doc.Profit) ? '0.00' : sumtotalprices - this.props.doc.Profit)} prefix={'Mayası: '} suffix={'₼'} />
                                <Statistic className='doc_info_text doc_info_secondary edit' title="" value={this.props.doc.Profit} prefix={'Qazanc: '} suffix={'₼'} />
                            </div>

                        </div>


                    </Col>
                </Row>
            </div >
        );
    }
}
const mapStateToProps = (state) => ({
    state,
})
const mapDispatchToProps = {
    putAddedPoisitons, updatePositions, updateSelectedRows, getLinks, getProductsGroupModal, updateSelectProductMultiConfirm, deleteResponseService, putLocalStates, fetchAttributes
}
export default connect(mapStateToProps, mapDispatchToProps)(DocTable)