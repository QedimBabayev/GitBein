import React, { Component } from 'react';
import LoaderHOC from './LoaderHOC';
import { SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import putData from '../actions/putAactions/putData-action';
import { fetchData } from '../actions/getData-action';
import DocTable from './DocTable';
import Trans from '../usetranslation/Trans';
import { Col, Row, Collapse } from 'antd';
import buttonsNames from '../ButtonsNames/NotDocs/NotDocsDifferent/buttonsNames'
import DocButtons from '../components/DocButtons';
import { updateCustomerSelect } from '../actions/getCustomerGroups-action';
import { getGroups } from '../actions/getGroups-action';
import { openModal } from '../actions/updateStates-action';
import moment from 'moment';
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
import LossFormComponent from './LossFormComponent';
const { Option } = Select;





class CreateLossForm extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            doc: this.props.selectedDoc ? this.props.selectedDoc[0] : [],
            docid: this.props.selectedDoc ? this.props.selectedDoc[0].Id : '',
            positions: this.props.selectedDoc ? this.props.selectedDoc[0].Positions : [],
            status: false,
            errorFields: [],
            childrenDrawer: false,
        }
    }
    componentDidMount() {
        this.setState({
            visible: false,
            childrenDrawer: false
        })
        this.props.updateCustomerSelect('')

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedDoc && nextProps.selectedDoc.Id !== this.state.docid) {
            this.setState({
                doc: nextProps.selectedDoc[0],
                docid: nextProps.selectedDoc[0].Id,
                positions: nextProps.selectedDoc[0].Positions,
            })
        }
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

        // if (Object.keys(this.props.owners).length > 0) {
        //     if (this.props.selectedDoc) {
        //         ownername = Object.values(this.props.owners).find(c => c.Id == this.props.selectedDoc.OwnerId).Name
        //     }
        //     else {
        //         ownername = Object.values(this.props.owners).find(c => c.Name == 'Administrator').Name
        //     }
        // }
        // if (Object.keys(this.props.departments).length > 0) {
        //     if (this.props.selectedDoc) {
        //         departmentname = Object.values(this.props.departments).find(c => c.Id == this.props.selectedDoc.DepartmentId).Name
        //     }
        //     else {
        //         departmentname = Object.values(this.props.departments).find(c => c.Name == '??sas ????b??').Name
        //     }
        // }

        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Button className='flex_directon_col_center' disabled={this.state.docid === '' ? true : false}>
                        Arxiv?? yerl????dir
                    </Button>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button className='flex_directon_col_center' disabled={this.state.docid === '' ? true : false}>
                        S??n??di sili
                    </Button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">Cavabdeh : <span>{ownername}</span></Menu.Item>
                <Menu.Item key="4">????b?? : <span>{departmentname}</span></Menu.Item>
            </Menu>
        );


        const { errorFields } = this.state
        console.log(this.props.fromdoc)
        return (
            <div className='table_holder'>
                <Row>
                    <Col xs={24} md={24} xl={24}>
                        <h2 className='custom_top_margin'><Trans word={'Losses'} /></h2>
                    </Col>

                    <Col xs={24} md={24} xl={24} className='form_header_wrapper'>

                        <DocButtons errorFields={errorFields} from={this.props.fromdoc ? this.props.fromdoc : 'p=loss'}  linkedDocs = {this.state.doc.length === 0 ? true : false} doc={this.state.doc} toDoc='createPaymentOut' fromDoc = 'createLoss' buttonsName={buttonsNames} activeitem={this.props.state.navbar.activeItem} activesubitem={this.props.state.navbar.activeSubItem} />

                        <div className='form_header_right_buttons_wrapper'>
                            <Button className='flex_directon_col_center d-flex-row'>
                                Qaim??
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
                        <LossFormComponent datas={this.props.datas} fetching={this.props.state.groups.fetching} docid={this.state.docid} doc={this.state.doc} />
                    </Col>
                    <Col xs={24} md={24} xl={24}>
                        <DocTable visible={this.state.visible} linkedid={this.state.doc ? this.state.doc.Id : ''} from='losses' doc={this.state.doc} handleProduct={this.props.state.handleProduct.selectedProduct} datasource={this.state.positions} />
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
    putData, fetchData,updateCustomerSelect, openModal, getGroups,
}
export default connect(mapStateToProps, mapDispatchToProps)(LoaderHOC(CreateLossForm, 'datas'))