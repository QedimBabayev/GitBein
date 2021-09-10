import React, { Component } from 'react';
import LoaderHOC from './LoaderHOC';
import { SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import getCard from '../actions/getCard-action'
import putData from '../actions/putAactions/putData-action';
import { updateStatesCreate } from '../actions/updateStates-action';
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

const { TextArea } = Input
var customCascader = [];
var newArr = []
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




class CreateCustomerGroupForm extends Component {
    formRef = React.createRef();


    componentDidMount() {
        customCascader = []
        customCascader = []
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.state.putdatas.responseId != this.props.state.putdatas.responseId) {
            this.props.updateStatesCreate(true)
        }
    }

    shouldComponentUpdate(nextProps) {

        if (nextProps.datas !== this.props.datas || nextProps.state.barcode.card !== this.props.state.barcode.card) {
            console.log(nextProps.state.barcode.card)
            this.formRef.current.setFieldsValue({
                card: nextProps.state.barcode.card

            });

            return true;
        } else {
            return false;
        }
    }
    onFinish = (values) => {
        console.log('Success:', values);
        this.props.putData('customergroups', values)
    };


    render() {

        newArr = []
        this.props.datas.map(d => {
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
                    initialValues={{


                    }}
                    layout="horizontal"
                    onFinish={this.onFinish}

                >

                    <Form.Item
                        label="Group Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please, fill the group name',
                            },
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>


                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea allowClear />
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
    state
})
const mapDispatchToProps = {
    getCard, putData, updateStatesCreate
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(CreateCustomerGroupForm, 'datas'))