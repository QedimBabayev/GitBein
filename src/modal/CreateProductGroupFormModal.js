import React, { Component } from 'react';
import { connect } from 'react-redux'
import getCard from '../actions/getCard-action'
import putData from '../actions/putAactions/putData-action';
import { updateStatesCreate } from '../actions/updateStates-action';
import '../components/ButtonsWrapper.css'
import Trans from '../usetranslation/Trans';
import ModalHOC from './ModalrHOC';
import { Col, Row, Collapse } from 'antd';
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


class CreateProductGroupForm extends Component {
    formRef = React.createRef();

    onFinish = (values) => {
        this.props.putData('productfolders', values)
    };


    render() {
        customCascader = []
        newArr = []
        Object.values(this.props.state.docmodals.productGroups).map(d => {
            d.ParentId === '00000000-0000-0000-0000-000000000000' ? pid = '' : pid = d.ParentId
            customCascader.push({
                "id": d.Id, "name": d.Name, "parent": pid, "value": d.Id, "label": d.Name,
            })
        })
        newArr = convert(customCascader)

        return (
            <div className='table_holder'>

                <Row>
                    <Col xs={24} md={9} xl={24}>

                        <Form className='docModal' ref={this.formRef}
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



                            <Row className='main_form_side'>
                                <Col xs={24} md={9} xl={24} className='left_form_wrapper' >


                                    <Form.Item
                                        label={<Trans word={'Group Name'} />}
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Zəhmət olmasa, məhsulun qrupunu qeyd edin..',
                                            },
                                        ]}
                                    >
                                        <Input allowClear />
                                    </Form.Item>




                                    <Form.Item
                                        label={<Trans word={'Product GroupName'} />}
                                        name='parentid'
                                    >
                                        <TreeSelect
                                            allowClear
                                            treeData={newArr.children}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={<Trans word={'Description'} />}
                                        name="description"
                                    >
                                        <TextArea rows={3} />
                                    </Form.Item>


                                    <Form.Item label="">
                                        <Button className='customsavebtn' htmlType="submit">Yadda saxla</Button>
                                    </Form.Item>

                                </Col>
                            </Row>
                        </Form>

                    </Col>
                </Row>
            </div>
        );
    }
}



const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
    getCard, putData, updateStatesCreate
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalHOC(CreateProductGroupForm,'fetching'))