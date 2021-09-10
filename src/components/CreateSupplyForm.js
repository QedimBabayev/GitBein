import React, { Component } from 'react';
import LoaderDocHOC from './LoaderDocHOC';
import { SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import putData from '../actions/putAactions/putData-action';
import { fetchData } from '../actions/getData-action';
import DocTable from './DocTable';
import Trans from '../usetranslation/Trans';
import { Link, Redirect } from 'react-router-dom';
import { Col, Row, Collapse } from 'antd';
import buttonsNames from '../ButtonsNames/NotDocs/buttonsNames'
import DocButtons from '../components/DocButtons';
import { updateCustomerSelect } from '../actions/getCustomerGroups-action';
import { getGroups } from '../actions/getGroups-action';
import { openModal } from '../actions/updateStates-action';
import moment from 'moment';
import SupplyFormComponent from './SupplyFormComponent';
import './ButtonsWrapper.css'
import './DocForm.css'

import { Icon } from 'semantic-ui-react'
import {
    PrinterOutlined,
    UserAddOutlined,
    HomeOutlined
} from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    InputNumber,
    TreeSelect,
    Checkbox,
    Dropdown,
    DatePicker,
    Switch,
    Select,
    Spin,
    Tag,
    Divider,
    Menu
} from 'antd';
const { Option } = Select;





class CreateSupplyForm extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)

    }
    state = {
        doc: '',
        status: false,
        errorFields: [],
        childrenDrawer: false,
    }
    componentDidMount() {
        this.props.updateCustomerSelect('')
    }


    handleChange = (value) => {
        console.log(value)
    }






    onFinishFailed = (values) => {
        this.setState({
            errorFields: values.errorFields
        })
    }
    handleStatusSelect = (checked, event) => {
        this.setState({
            status: checked
        })
    }

    render() {
        var ownername;
        var departmentname;
        if (Object.keys(this.props.owners).length > 0) {
            if (this.props.id && this.props.state.datas.doc[0].length > 0) {
                ownername = Object.values(this.props.owners).find(c => c.Id == this.props.state.datas.doc[0].OwnerId).Name
            }
            else {
                ownername = Object.values(this.props.owners).find(c => c.Name == 'Administrator').Name
            }
        }
        if (Object.keys(this.props.departments).length > 0) {
            if (this.props.id && this.props.state.datas.doc[0].length > 0) {
                departmentname = Object.values(this.props.departments).find(c => c.Id == this.props.state.datas.doc[0].DepartmentId).Name
            }
            else {
                departmentname = Object.values(this.props.departments).find(c => c.Name == 'Əsas şöbə').Name
            }
        }

        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Button className='flex_directon_col_center' disabled={this.state.docid === '' ? true : false}>
                        Arxivə yerləşdir
                    </Button>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button className='flex_directon_col_center' disabled={this.state.docid === '' ? true : false}>
                        Sənədi sili
                    </Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">Cavabdeh : <span>{ownername}</span></Menu.Item>
                <Menu.Item key="4">Şöbə : <span>{departmentname}</span></Menu.Item>
            </Menu>
        );
        const check = (
            <Menu>
                <Menu.Item key="0">
                    <Button className='flex_directon_col_center'>
                        A 4
                    </Button>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button className='flex_directon_col_center' >
                        50 mm
                    </Button>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to={{ pathname: '/check80', search: `${this.props.id}`, hash: "demands" }} target={'_blank'} >80mm </Link>

                </Menu.Item>
            </Menu >
        );

        const { errorFields } = this.state
        return (
            <div className='table_holder'>
                <Row>
                    <Col xs={24} md={24} xl={24}>
                        <h2 className='custom_top_margin'><Trans word={'Supplies'} /></h2>
                    </Col>

                    <Col xs={24} md={24} xl={24} className='form_header_wrapper'>

                        <DocButtons errorFields={errorFields} from={this.props.fromdoc ? this.props.fromdoc : 'p=supply'} linkedDocs={this.props.state.datas.doc ? true : false} doc={this.props.state.datas.doc} toDoc='createPaymentIn' fromDoc='createDemand' buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />

                        <div className='form_header_right_buttons_wrapper'>
                            <Button className='flex_directon_col_center d-flex-row'>
                                Qaimə
                                <PrinterOutlined />
                            </Button>
                            <Dropdown overlay={menu} trigger={['click']}>

                                <Button className='form_setting_icon_wrapper flex_directon_col_center' onClick={e => e.preventDefault()}>
                                    <span className='dots'></span>
                                    <span className='dots'></span>
                                    <span className='dots'></span>
                                </Button>
                            </Dropdown>



                        </div>

                    </Col>

                    <Col xs={24} md={12} xl={13}>
                        <SupplyFormComponent docid={this.props.id ? this.props.state.datas.doc[0].Id : ''} datas={this.props.state.groups.groups} doc={this.props.id ? this.props.state.datas.doc[0] : ''} />

                    </Col>
                    <Col xs={24} md={24} xl={24}>
                        <DocTable visible={this.state.visible} linkedid={this.props.id ? this.props.state.datas.doc[0].Id : ''} from='demands' doc={this.props.id ? this.props.state.datas.doc[0] : ''} handleProduct={this.props.state.handleProduct.selectedProduct} datasource={this.props.id ? this.props.state.datas.doc[0].Positions : ''} />

                    </Col>
                </Row >


            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    state,
})
const mapDispatchToProps = {
    putData, fetchData, updateCustomerSelect, openModal, getGroups,
}
export default connect(mapStateToProps, mapDispatchToProps)(LoaderDocHOC(CreateSupplyForm, 'fetching'))