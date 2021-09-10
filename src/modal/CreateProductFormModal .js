import React, { Component } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { Col, Row, Collapse } from 'antd';
import { getBarcode, deleteBarcode } from '../actions/getBarcode-action'
import putData from '../actions/putAactions/putData-action';
import { fetchData } from '../actions/getData-action';
import { fetchRefList } from '../actions/getAttributes-action'
import DocButtons from '../components/DocButtons';
import { updateSelectProductMultiConfirm } from '../actions/updateStates-action';
import updateChanged from '../actions/updateChanged-action';
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames'
import { getGroups } from '../actions/getGroups-action';
import { openProductGroupModal, updateStatesCreate } from '../actions/updateStates-action';
import PercentShow from '../components/PercentShow';
import { putDataProduct } from '../actions/modalActions/putModalInputs-action';
import { putLocalStates } from '../actions/modalActions/putModalInputs-action';
import ModalHOC from './ModalrHOC';
import Trans from '../usetranslation/Trans';
import BootstrapTable from 'react-bootstrap-table-next';
import '../components/Form.css'
import '../components/Colors.css'
import '../components/ButtonsWrapper.css'
import {
    PrinterOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    InputNumber,
    TreeSelect,
    Checkbox,
    Dropdown,
    Select,
    Spin,
    Menu
} from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

var customCascader = [];
var newArr = []
var lowerCaseForAttributesSelect = []
var editProduct;
var pid;
var suffixed
var lowercasearr;
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

function CalcPercent(percent) {
    return percent
}



var panes;
class CreateProductForm extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            productid: this.props.selectedProduct ? this.props.selectedProduct.Id : '',
            weight: false,
            archieve: false,
            barcodeClicked: false,
            visibleMenuSettings: false,
            defaultpercent: 0,
            ownername: '',
            departmentname: '',
            lowercase: [],
            loadRoleSelects: true,
            errorFields: [],
            loadingTab: true
        }
    }
    showChildrenModal = () => {
        this.props.openProductGroupModal(true)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.state.barcode !== nextProps.state.barcode.barcode) {
            if (!this.props.selectedProduct) {
                var newBarcode = nextProps.state.barcode.barcode
                this.formRef.current.setFieldsValue({
                    barcode: newBarcode
                })
            }
        }
        if (this.props.state.percent.price !== nextProps.state.percent.price) {
            var newPrice = nextProps.state.percent.price
            this.formRef.current.setFieldsValue({
                price: newPrice,
            })
        }
        if (nextProps.selectedProduct && nextProps.selectedProduct.Id !== this.state.productid) {
            this.setState({
                productid: nextProps.selectedProduct.Id,
            })


        }
    }
    handleTabChange = (event, data) => {
        if (data.activeIndex === 1) {
            setTimeout(() => {
                this.setState({
                    loadingTab: false
                })
            }, 1000);
        }
        else {
            this.setState({
                loadingTab: true
            })
        }
    }
    onValuesChange = (changedValues, allValues) => {
        this.props.updateChanged('true', 'p=products')
        var newPercent = parseFloat(parseFloat(allValues.price - allValues.buyprice).toFixed(2) * parseFloat(100) / parseFloat(allValues.buyprice).toFixed(2)).toFixed(2)
        this.setState({
            defaultpercent: newPercent,
            buypricechange: allValues.buyprice
        })
    };


    onFinish = (values) => {
        if(values.packprice){
            values.ispack = 1
        }
        else{
            values.ispack = 0
            
        }
        this.props.putDataProduct(values);
        this.props.putLocalStates(values)
  
    };

    onGetBarcode = () => {
        this.props.getBarcode(this.state.weight)
        this.props.updateChanged('true', 'p=products')
    }
    handleBarcodeSelect = (checked, event) => {
        this.setState({
            weight: checked
        })
    }
    getRefList = (e) => {
        lowerCaseForAttributesSelect = []
        this.props.fetchRefList(e.target.id)
    }
    handleFocus = (event) => event.target.select();
    handleVisibleChange = flag => {
        this.setState({ visibleMenuSettings: flag });
    };
    render() {
        newArr = []
        customCascader = []
        lowerCaseForAttributesSelect = []
        Object.values(this.props.state.attributes.reflist).map(r => {
            lowerCaseForAttributesSelect.push({
                label: r.Name,
                value: r.Id,
            })
        })
        Object.values(this.props.datas).map(d => {
            d.ParentId === '00000000-0000-0000-0000-000000000000' ? pid = '' : pid = d.ParentId
            customCascader.push({
                "id": d.Id, "name": d.Name, "parent": pid, "value": d.Id, "label": d.Name,
            })
        })
        newArr = convert(customCascader)

        const modInputs = (
            this.props.attrInputs.filter(a => a.referencetypeid === '').map((a) =>
                <Form.Item
                    label={a.label}
                    name={a.name}
                    key={a.id}
                    rules={[
                        {
                            required: a.isrequired == 1 ? true : false,
                            message: `Zəhmət olmasa, ${a.label} böləməsini doldurun`,
                        }
                    ]}
                >

                    <Input allowClear />


                </Form.Item>
            )
        )
        const modSelects = (
            this.props.attrInputs.filter(a => a.referencetypeid != '').map((a) =>
                <Form.Item
                    label={a.label}
                    name={a.name}
                    key={a.id}
                    rules={[
                        {
                            required: a.isrequired == 1 ? true : false,
                            message: `Zəhmət olmasa, ${a.label} böləməsini doldurun`,
                        }
                    ]}
                >
                    <Select
                        showSearch
                        autoFocus={true}
                        style={{ width: 200 }}
                        id={a.referencetypeid}
                        placeholder=""
                        onFocus={this.getRefList}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        notFoundContent={<Spin size="small" />}
                        loading={this.props.state.attributes.refLoading}
                        options={this.props.state.attributes.refLoading === false ? lowerCaseForAttributesSelect : ''}
                    >


                    </Select>


                </Form.Item>
            )
        )



        panes = [
            {
                menuItem: 'Qiymət',
                render: () => <Tab.Pane attached={false}>

                    <Form.Item label={<Trans word={'BuyPrice'} />} name='buyprice'>
                        <InputNumber onFocus={this.handleFocus} formatter={value => `${value}  ₼`}
                            min={0} />
                    </Form.Item>
                    <Form.Item label={<Trans word={'MinPrice'} />} name='minprice'>
                        <InputNumber onFocus={this.handleFocus} formatter={value => `${value}  ₼`}
                            min={0} />
                    </Form.Item>
                    <h5>Satış qiymətləri</h5>
                    <Form.Item label={<Trans word={'Product Price'} />} name='price'>
                        <InputNumber onFocus={this.handleFocus} formatter={value => `${value}  ₼`}
                            min={0} />
                    </Form.Item>
                    <PercentShow buyprice={this.state.buypricechange} defpercent={isNaN(this.state.defaultpercent) ? 0 : isFinite(this.state.defaultpercent) ? this.state.defaultpercent : 0} />

                </Tab.Pane>,
            },
            {
                menuItem: 'Parametrlər',
                render: () =>
                    <Tab.Pane loading={this.state.loadingTab} attached={false}>
                        {
                            modInputs
                        }
                        {
                            modSelects
                        }

                    </Tab.Pane>,
            },
            {
                menuItem: 'Anbar qalığı',
                render: () => <Tab.Pane attached={false}>

                </Tab.Pane>,
            },
            {
                menuItem: 'Tarix',
                render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
            },

        ]

        var initialValuesDefault = (
            this.props.state.docmodals.localStates ? Object.assign(...Object.keys(this.props.state.docmodals.localStates).map(key => ({ [key.toLowerCase()]: this.props.state.docmodals.localStates[key] }))) : ''
        )
        return (
            <div className='table_holder'>
                <Row>
                    <Col xs={24} md={24} xl={24}>
                        <h2 className='custom_top_margin'><Trans word={'Products'} /></h2>
                    </Col>
                    <Col xs={24} md={24} xl={24}>
                        <Form className='docModal' ref={this.formRef}
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            name="basic"
                            initialValues={
                                {
                                    groupid: this.props.state.putdatas.responseId ? this.props.state.putdatas.responseId.ResponseService : '',
                                }
                            }
                            layout="horizontal"
                            onFinish={this.onFinish}
                            onValuesChange={this.onValuesChange}
                            onFinishFailed={this.onFinishFailed}
                        >

                            <Row className='main_form_side'>
                                <Col xs={24} md={9} xl={24} className='left_form_wrapper' >
                                    <Form.Item
                                        label={<Trans word={'Product Name'} />}
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Zəhmət olmasa, məhsulun adını qeyd edin..',
                                            },
                                        ]}
                                    >
                                        <Input allowClear />
                                    </Form.Item>

                                    <Form.Item
                                        label={<Trans word={'BarCode'} />}
                                        name="barcode"
                                    >
                                        <Input suffix={<SyncOutlined className={'suffixed'} onClick={this.onGetBarcode} />} />
                                    </Form.Item>

                                    <Form.Item
                                        label={<Trans word={'ArtCode'} />}
                                        name="artcode"
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        hidden={true}
                                        label="id"
                                        name="id"
                                    >
                                        <Input />
                                    </Form.Item>

                                    <div className='form_item_with_icon_modal'>
                                        <Form.Item
                                            label={<Trans word={'Product GroupName'} />}
                                            name='groupid'
                                            className='group_item_wrapper'

                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Zəhmət olmasa, məhsulun qrupunu qeyd edin..',
                                                },
                                            ]}
                                        >
                                            <TreeSelect

                                                allowClear
                                                treeData={newArr.children}
                                            />


                                        </Form.Item>
                                        <PlusOutlined className='add_elements_modal' onClick={this.props.openSecondModal} />
                                    </div>

                                    <Form.Item label={<Trans word={'Cost Price'} />} hidden={this.state.productid != '' ? false : true}>
                                        <InputNumber disabled={true} />
                                    </Form.Item>


                                    <Collapse ghost>
                                        <Panel header="Əlavə parametr" key="1">
                                            <Collapse>
                                                <Panel header="Qutu" key="1">
                                                    <Form.Item label='Satış qiyməti' name='packprice'>
                                                        <InputNumber />
                                                    </Form.Item>
                                                    <Form.Item label='Ədəd' name='packquantity'>
                                                        <InputNumber />
                                                    </Form.Item>
                                                </Panel>
                                            </Collapse>
                                        </Panel>
                                    </Collapse>



                                    <Form.Item name="description" label={<Trans word={'Description'} />}>
                                        <TextArea rows={3} />
                                    </Form.Item>
                                    <Form.Item label={<Trans word={'Weight'} />} name='weight' valuePropName="checked">
                                        <Checkbox onChange={this.handleBarcodeSelect} name='wt' ></Checkbox>
                                    </Form.Item>

                                    <Form.Item label="">
                                        <Button htmlType="submit" className='customsavebtn'>Yadda saxla</Button>
                                    </Form.Item> : ''



                                </Col>
                                <Col xs={24} md={12} xl={this.props.state.stateChanges.openCreateModal ? 24 : 15}>
                                    <div className="tab_wrapper">
                                        <Tab menu={{ attached: false }} onTabChange={this.handleTabChange} panes={panes} />
                                    </div>

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
    state,
})
const mapDispatchToProps = {
    getBarcode, putData, updateSelectProductMultiConfirm, fetchData, fetchRefList, updateChanged, deleteBarcode, getGroups, openProductGroupModal, updateStatesCreate, putDataProduct, putLocalStates
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalHOC(CreateProductForm, 'fetching'))