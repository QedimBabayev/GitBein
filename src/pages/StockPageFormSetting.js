import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoaderHOC from '../components/LoaderHOC';
import {
    Col,
    Row,
    Form,
    Input,
    Button,
    TreeSelect
} from 'antd';


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



class StockPageFormSetting extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            stock: this.props.selectedStock ? this.props.selectedStock.Id : '',
            status: false,
            errorFields: [],
            childrenDrawer: false,
        }
    }


    componentDidMount() {
        customCascader = []
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedStock && nextProps.selectedStock.Id !== this.state.stock) {
            this.setState({
                stock: nextProps.selectedStock.Id,
            })


        }
    }
    render() {

        newArr = []
        Object.values(this.props.datas).map(d => {
            d.ParentId === '00000000-0000-0000-0000-000000000000' ? pid = '' : pid = d.ParentId
            customCascader.push({
                "id": d.Id, "name": d.Name, "parent": pid, "value": d.Id, "label": d.Name,
            })
        })

        newArr = convert(customCascader)
        return (
            <div className='table_holder'>
                <Form
                    ref={this.formRef}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    name='basic'
                    layout="horizontal"
                    initialValues={
                        {
                            name: this.props.selectedStock ? this.props.selectedStock.Name : '',
                            id: this.props.selectedStock ? this.props.selectedStock.Id : '',
                            description: this.props.selectedStock ? this.props.selectedStock.Description : '',
                            parentid: this.props.selectedStock ? this.props.selectedStock.ParentId : '',
                        }
                    }
                >

                    <Form.Item label="Anbar adı" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item hidden={true} label="id" name='id'>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Təsvir" name='description'>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label='Yerləşdiyi anbar' name='parentid'>
                        <TreeSelect
                            className='doc_status_formitem_wrapper_col'
                            allowClear
                            treeData={newArr.children}
                        />
                    </Form.Item>

                    <Button type="link" htmlType="button">
                        save
                    </Button>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(StockPageFormSetting, 'datas'))





