import React, { Component } from 'react';
import LoaderHOC from './LoaderHOC';
import { SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { Col, Row, Collapse } from 'antd';
import { getBarcode, deleteBarcode } from '../actions/getBarcode-action'
import putData from '../actions/putAactions/putData-action';
import { fetchData } from '../actions/getData-action';
import { Link, Redirect } from 'react-router-dom';
import { fetchRefList } from '../actions/getAttributes-action'
import DocButtons from '../components/DocButtons';
import updateChanged from '../actions/updateChanged-action';
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames'
import { getGroups } from '../actions/getGroups-action';
import { openProductGroupModal, updateStatesCreate } from '../actions/updateStates-action';
import PercentShow from './PercentShow';
import { API_BASE } from '../config/env';
import axios from 'axios';
import Sound from 'react-sound';
import ok from '../audio/ok.mp3'
import Trans from '../usetranslation/Trans';
import BootstrapTable from 'react-bootstrap-table-next';
import './Form.css'
import './Colors.css'
import './ButtonsWrapper.css'
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
    message,
    Select,
    Spin,
    Menu
} from 'antd';
import { getToken } from '../config/token';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

var customCascader = [];
var newArr = []
var ownersOptions = []
var depOptions = []
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
            archieve: this.props.selectedProduct ? this.props.selectedProduct.IsArch === 1 ? true : false : false,
            barcodeClicked: false,
            visibleMenuSettings: false,
            defaultpercent: 0,
            barcode: '',
            redirect: false,
            ownername: '',
            archForm: false,
            status: false,
            departmentname: '',
            loadingButton: false,
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
        if (nextProps.state.barcode.barcode) {
            if (this.state.barcode !== nextProps.state.barcode.barcode) {
                if (!this.props.selectedProduct) {
                    var newBarcode = nextProps.state.barcode.barcode
                    this.setState({
                        barcode: newBarcode
                    })
                    this.formRef.current.setFieldsValue({
                        barcode: newBarcode
                    })
                }
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

    progress = (fetching, status, mess, arch, from) => {
        console.log(fetching)
        if (fetching) {
            message.loading('Yüklənir...')
        }
        else if (fetching === 'error') {
            console.log('errora girdi')
            message.destroy()
            if (from === 'save') {
                message.error(`Saxlanılmadı.. ${mess}`)
            }

            else if (from === 'del') {
                message.error(`Silinmədi.. ${mess}`)
            }

        }
        else {

            message.destroy()
            if (status === '0') {

                if (this.state.archForm) {
                    if (arch === 'archieve') {
                        return message.success('Arxivə salındı')
                    }
                    else if (arch === 'archievegancel') {
                        return message.success('Arxivdən çıxarıldı')
                    }
                    return
                }



                else if (from === 'save') {
                    message.success('Saxlanıldı')
                    this.setState({
                        status: true
                    })
                }

                else if (from === 'del') {
                    message.success('Silindi')
                }


                this.setState({
                    editId: mess.responseService,
                    loadingButton: false
                })
            }
            else {
                if (from === 'save') {
                    message.error(`Saxlanılmadı.. ${mess}`)
                }

                else if (from === 'del') {
                    message.error(`Silinmədi.. ${mess}`)
                }



            }
        }
    };

    async delProduct(id, object) {

        const res = await axios.post(`${API_BASE}/products/del.php?id=${id}`, object);
        return await res;
    }

    async putProduct(object) {
        const res = await axios.post(`${API_BASE}/products/put.php`, object);
        return await res;
    }

    handleArchieve = () => {
        this.setState({
            archieve: !this.state.archieve,
            archForm: true,

        })
    }
    onFinish = (values) => {
        console.log(values)
        var sendProduct = {}
        values.packprice ? values.ispack = 1 : values.ispack = 0
        sendProduct = values
        sendProduct.token = getToken()
        this.progress(true)
        this.setState({
            loadingButton: true
        })
        this.state.archieve ? sendProduct.isarch = true : sendProduct.isarch = false
        this.putProduct(sendProduct).then(res => this.progress(false, res.data.Body.ResponseStatus, res.data.Body, this.state.archieve ? 'archieve' : 'archievegancel', 'save'))

    };
    onFinishFailed = (values) => {
        this.setState({
            errorFields: values.errorFields
        })


    }
    onGetBarcode = () => {
        this.props.getBarcode(this.state.weight)
        this.props.updateChanged('true', 'p=products')
    }
    handleBarcodeSelect = (checked, event) => {
        this.setState({
            weight: checked
        })
    }
    deleteProduct = (id, e) => {
        e.stopPropagation()
        this.progress(true)
        var grFilter = {}
        grFilter.token = getToken()
        this.delProduct(id, grFilter).then(res => this.progress(false, res.data.Body.ResponseStatus, res.data.Body, 'del')).then(() => this.setState({ redirect: true }))

    }
    getRefList = (e) => {
        window.scrollTo(0, 0);
        lowerCaseForAttributesSelect = []
        this.props.fetchRefList(e.target.id)
    }
    handleFocus = (event) => event.target.select();
    handleVisibleChange = flag => {
        this.setState({ visibleMenuSettings: flag });
    };
    render() {

        if (this.state.redirect == true) {
            return <Redirect push to='/p=product' />;
        }
        var ownername;
        var departmentname;
        depOptions = []
        ownersOptions = []
        newArr = []
        customCascader = []
        lowerCaseForAttributesSelect = []
        Object.values(this.props.state.attributes.reflist).map(r => {
            lowerCaseForAttributesSelect.push({
                label: r.Name,
                value: r.Id,
            })
        })
        Object.values(this.props.owners).map(r => {
            ownersOptions.push({
                label: r.Name,
                value: r.Id,
            })
        })
        Object.values(this.props.departments).map(r => {
            depOptions.push({
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
        if (Object.keys(this.props.owners).length > 0) {
            if (this.props.selectedProduct) {
                ownername = Object.values(this.props.owners).find(c => c.Id == this.props.selectedProduct.OwnerId).Name
            }
            else {
                ownername = Object.values(this.props.owners).find(c => c.Name == 'Administrator').Name
            }
        }
        if (Object.keys(this.props.departments).length > 0) {
            if (this.props.selectedProduct) {
                departmentname = Object.values(this.props.departments).find(c => c.Id == this.props.selectedProduct.DepartmentId).Name
            }
            else {
                departmentname = Object.values(this.props.departments).find(c => c.Name == 'Əsas şöbə').Name
            }
        }
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

                    <Form.Item label={<Trans word={'Cost Price'} />} hidden={this.state.productid != '' ? false : true}>
                        <InputNumber onFocus={this.handleFocus} disabled={true} formatter={value => `${value}  ₼`}
                            min={0} />
                    </Form.Item>

                    <h5>Satış qiymətləri</h5>
                    <Form.Item label={<Trans word={'Product Price'} />} name='price'>
                        <InputNumber onFocus={this.handleFocus} formatter={value => `${value}  ₼`}
                            min={0} />
                    </Form.Item>
                    <Form.Item label={<Trans word={'MinPrice'} />} name='minprice'>
                        <InputNumber onFocus={this.handleFocus} formatter={value => `${value}  ₼`}
                            min={0} />
                    </Form.Item>
                    {/* <PercentShow buyprice={this.state.buypricechange} defpercent={isNaN(this.state.defaultpercent) ? 0 : isFinite(this.state.defaultpercent) ? this.state.defaultpercent : 0} /> */}

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
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    {
                        console.log('arxiv', this.state.archieve)
                    }
                    <Button htmlType='submit' form='myForm' onClick={this.handleArchieve} className='flex_directon_col_center' disabled={this.state.productid === '' ? true : false}>
                        {this.state.archieve ? 'Arxivdən çıxart' : 'Arxivə sal'}
                    </Button>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button onClick={(e) => this.deleteProduct(this.state.productid != '' ? this.state.productid : '', e)} className='flex_directon_col_center' disabled={this.state.productid === '' ? true : false}>
                        Məhsulu sili
                    </Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">Cavabdeh : <span>{ownername}</span></Menu.Item>
                <Menu.Item key="4">Şöbə : <span>{departmentname}</span></Menu.Item>
            </Menu>
        );
        var initialValuesDefault = (
            this.props.selectedProduct ? Object.assign(...Object.keys(this.props.selectedProduct).map(key => ({ [key.toLowerCase()]: this.props.selectedProduct[key] }))) : ''
        )
        const { errorFields } = this.state
        return (

            <div className='table_holder'>
                < Sound
                    url={ok}
                    playStatus={this.state.status ? Sound.status.PLAYING : Sound.status.Stopped}
                />
                <Row>
                    <Col xs={24} md={24} xl={24}>

                        <h2 className='custom_top_margin'><Trans word={'Products'} /></h2>
                    </Col>
                    <Col xs={24} md={24} xl={24} className='form_header_wrapper'>
                        <DocButtons loading={this.state.loading} errorFields={errorFields} from='p=product' fromDoc='createDemand' toDoc='createPaymentOut' buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />

                        <div className='form_header_right_buttons_wrapper'>

                            <Button>

                                <Link to={{ pathname: '/bc/', search: `${this.state.productid != '' ? 'bc=' + this.props.selectedProduct.BarCode + '&pr=' + this.props.selectedProduct.Price + '&nm=' + this.props.selectedProduct.Name : ''}` }} target={'_blank'} >Barkod </Link>

                                <PrinterOutlined />
                            </Button>

                            <Dropdown overlay={menu} trigger={['click']}>

                                <Button className={this.props.state.stateChanges.openCreateModal ? 'd-none' : 'form_setting_icon_wrapper flex_directon_col_center'} onClick={e => e.preventDefault()}>
                                    <span className='dots'></span>
                                    <span className='dots'></span>
                                    <span className='dots'></span>
                                </Button>
                            </Dropdown>
                        </div>
                    </Col>
                    <Col xs={24} md={24} xl={24}>
                        <Form id='myForm' ref={this.formRef}
                            labelCol={{
                                span: 7,
                            }}
                            wrapperCol={{
                                span: 15,
                            }}
                            name="basic"
                            initialValues={
                                this.props.selectedProduct ? initialValuesDefault : ''
                            }
                            layout="horizontal"
                            onFinish={this.onFinish}
                            onValuesChange={this.onValuesChange}
                            onFinishFailed={this.onFinishFailed}
                        >

                            <Row className='main_form_side'>
                                <Col xs={24} md={9} xl={8} className='left_form_wrapper'>
                                    <div className='ant-row ant-form-item' style={{ marginBottom: '2.5rem' }}>
                                        <div class="ant-col ant-col-7 ant-form-item-label"><h2>Ümumi məlumatlar</h2></div>
                                        <div class="ant-col ant-col-12 ant-form-item-label"><h2></h2></div>
                                    </div>

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
                                        allowClear={true}
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
                                    {
                                        this.props.state.stateChanges.openCreateModal ? <PlusOutlined className='custom_add_group_icon' onClick={this.showChildrenModal} /> : ''
                                    }





                                    <Form.Item name="description" label={<Trans word={'Description'} />}>
                                        <TextArea rows={3} />
                                    </Form.Item>
                                    <Form.Item label={<Trans word={'Weight'} />} name='weight' valuePropName="checked">
                                        <Checkbox onChange={this.handleBarcodeSelect} name='wt' ></Checkbox>
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




                                    {
                                        this.props.state.stateChanges.openCreateModal ? <Form.Item label="">
                                            <Button htmlType="submit" className='customsavebtn'>Yadda saxla</Button>
                                        </Form.Item> : ''
                                    }



                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <div className="tab_wrapper">
                                        <Tab menu={{ attached: false }} onTabChange={this.handleTabChange} panes={panes} />
                                    </div>

                                </Col>
                                <Col xs={24} md={24} xl={8}>
                                    <Collapse ghost>
                                        <Panel header="İcazəli" key="1">
                                            <Form.Item
                                                label={'Cavabdeh'}
                                                name="ownerid"
                                                style={{ margin: '0' }}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder=""
                                                    filterOption={false}
                                                    notFoundContent={<Spin size="small" />}
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    loading={this.props.state.groups.loading ? <Spin size="small" /> : ''}
                                                    options={ownersOptions}
                                                />

                                            </Form.Item>
                                            <Form.Item
                                                label={'Şöbə'}
                                                name="departmentid"
                                                style={{ margin: '0' }}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder=""
                                                    notFoundContent={<Spin size="small" />}
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    loading={this.props.state.groups.loading ? <Spin size="small" /> : ''}
                                                    options={depOptions}
                                                />
                                            </Form.Item>
                                        </Panel>
                                    </Collapse>
                                </Col>
                            </Row>
                        </Form>
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
    getBarcode, putData, fetchData, fetchRefList, updateChanged, deleteBarcode, getGroups, openProductGroupModal, updateStatesCreate
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(CreateProductForm, 'datas'))