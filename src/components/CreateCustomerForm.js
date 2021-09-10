import React, { Component } from 'react';
import LoaderHOC from './LoaderHOC';
import { SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import getCard from '../actions/getCard-action'
import putData from '../actions/putAactions/putData-action';
import {fetchData} from '../actions/getData-action';
import './ButtonsWrapper.css'

import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
} from 'antd';

var customCascader = [];
var newArr = []
var editProduct;
var pid;
var suffixed
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




class CreateCustomerForm extends Component {
    formRef = React.createRef();




    constructor(props) {
        super(props)
        this.state = {
            customerid: this.props.selectedCustomer ? this.props.selectedCustomer.Id : '',
        }
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.selectedCustomer && nextProps.selectedCustomer.Id !== this.state.customerid) {
            this.setState({
                customerid: nextProps.selectedCustomer.Id
            })
        }

        if (this.props.state.barcode.card !== nextProps.state.barcode.card) {
            if (!this.props.selectedCustomer) {
                var newCard = nextProps.state.barcode.card
                this.formRef.current.setFieldsValue({
                    card: newCard
                })
            }

        }

    }


    componentDidMount() {
        console.log(this.props.selectedCustomer)
    }

    onFinish = (values) => {
        this.props.putData('customers', values)
    };
    onGetCard = () => {
        this.props.getCard()
    }

    render() {
        newArr = []
        customCascader = []
       Object.values(this.props.datas).map(d => {
            d.ParentId === '00000000-0000-0000-0000-000000000000' ? pid = '' : pid = d.ParentId
            customCascader.push({
                "id": d.Id, "name": d.Name, "parent": pid, "value": d.Id, "label": d.Name,
            })
        })
        newArr = convert(customCascader)
        return (
            <>
                <Form ref={this.formRef}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    name="basic"
                    initialValues={

                        {
                            name: this.props.selectedCustomer ? this.props.selectedCustomer.Name : '',
                            card: this.props.selectedCustomer ? this.props.selectedCustomer.Card : '',
                            id: this.props.selectedCustomer ? this.props.selectedCustomer.Id : '',
                            bonus: this.props.selectedCustomer ? this.props.selectedCustomer.Bonus : '',
                            discount: this.props.selectedCustomer ? this.props.selectedCustomer.Discount : '',
                            phone: this.props.selectedCustomer ? this.props.selectedCustomer.Phone : '',
                            email: this.props.selectedCustomer ? this.props.selectedCustomer.Email : '',
                            description: this.props.selectedCustomer ? this.props.selectedCustomer.Description : '',
                            groupid: this.props.selectedCustomer ? this.props.selectedCustomer.GroupId : '',
                        }
                    }
                    layout="horizontal"
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        label="Customer Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please, fill the customer name',
                            },
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>

                    <Form.Item
                        label="Card"
                        name="card"
                    >
                        <Input suffix={<SyncOutlined className={'suffixed'} onClick={this.onGetCard} />} />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item hidden={true}
                        label="id"
                        name="id"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Customer Groups"
                        name='groupid'
                        rules={[
                            {
                                required: true,
                                message: 'Please, fill the customer group name',
                            },
                        ]}
                    >
                        <TreeSelect
                            allowClear
                            treeData={newArr.children}
                        />
                    </Form.Item>
                    <Form.Item label="Discount" name='discount'>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Bonus" name='bonus'>
                        <InputNumber />
                    </Form.Item>
                 
                    <Form.Item label="Button">
                        <Button htmlType="submit">Button</Button>
                    </Form.Item>
                </Form>
            </>
        );
    }
}



const mapStateToProps = (state) => ({
    state,
})
const mapDispatchToProps = {
    getCard, putData, fetchData
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(CreateCustomerForm, 'datas'))