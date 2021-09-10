import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Row, Col, Input, Button, Select, DatePicker, Checkbox, TreeSelect, Dropdown, Menu, ConfigProvider } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Null_Content } from '../config/env';
import filterObject from '../config/filterObject';
import { fetchData } from '../actions/getData-action';
import TableLoader from './TableLoader';
import { getToken } from '../config/token';
import Trans from '../usetranslation/Trans';
import { getFilterDatas } from '../actions/filterActions/getFilter-actions';
import { Spin } from 'antd';
import './Filter.css'
import { LoadingOutlined, SettingOutlined } from '@ant-design/icons';
import filterMark from '../config/filterMark';
import moment from 'moment';
import 'moment/locale/az';
import locale from 'antd/es/date-picker/locale/az_AZ';
const { Option, OptGroup } = Select;
moment.locale('az');

const children = [];
var lowerCaseForSelect = []

const { RangePicker } = DatePicker;
class FilterPage extends Component {
    form = React.createRef();
    state = {
        spinning: true,
        visibleMenuSettings: false,
        initialCols: this.props.filter,
        filteredInputs: this.props.filter.filter(a => a.hidden === false),
        rangeFilter: {}


    }
    getData = (e) => {
        lowerCaseForSelect = []
        this.props.getFilterDatas(e.target.id)
    }



    visibleChange = (open) => {
        if (!open) {
            this.setState({
                spinning: true
            })
        }
    }


    handleVisibleChange = flag => {
        this.setState({ visibleMenuSettings: flag });
    };

    hiddenFilters = (e) => {
        var initialCols = this.state.initialCols
        console.log(initialCols)
        var findelement;
        var findelementindex;
        var replacedElement
        findelement = initialCols.find(c => c.name === e.target.id)
        findelementindex = initialCols.findIndex(c => c.name === e.target.id)
        findelement.hidden = !e.target.checked
        replacedElement = findelement
        initialCols.splice(findelementindex, 1, { ...findelement, ...replacedElement });
        var filtered = initialCols.filter(c => c.hidden == false)
        this.setState({
            filteredInputs: filtered
        })
    }


    onChange = (e) => {
        console.log(e)
        var n = e.target.name
        var v = e.target.value
        this.setState({
            rangeFilter: { ...this.state.rangeFilter, [n]: v }
        })
    }





    onFinish = (fieldsValue) => {
        const rangeCreateValue = fieldsValue['createdDate'];
        const rangeModifyValue = fieldsValue['modifedDate'];

        const values = {
            ...fieldsValue,
            ...this.state.rangeFilter,
            'token': getToken(),
            'dr': 0,
            'sr': this.props.sort,
            'pg': 0,
            'momb': rangeCreateValue ? rangeCreateValue[0].format('YYYY-MM-DD HH:mm:ss') : '',
            'mome': rangeCreateValue ? rangeCreateValue[1].format('YYYY-MM-DD HH:mm:ss') : '',
            'modb': rangeModifyValue ? rangeModifyValue[0].format('YYYY-MM-DD HH:mm:ss') : '',
            'mode': rangeModifyValue ? rangeModifyValue[1].format('YYYY-MM-DD HH:mm:ss') : '',
        };
        console.log('Received values of form: ', values);
        this.props.fetchData(this.props.from, values)

    }
    componentWillReceiveProps(prevPros) {
        if (prevPros.state.filters.filterDatas != this.props.state.filters.filterDatas && this.props.state.filters.fetching === true) {
            this.setState({
                spinning: false
            })
        }
    }
    render() {

        lowerCaseForSelect = []
        Object.values(this.props.state.filters.filterDatas).map(r => {
            lowerCaseForSelect.push({
                label: r.Name,
                value: r.Id,
            })
        })

        const rangeConfig = {
            rules: [
                {
                    type: 'array',
                    message: 'Please select time!',
                },
            ],
        };

        const filterInputs = (
            this.state.filteredInputs.map(a =>
                <Col span={4} key={a.key}>
                    < Form.Item
                        name={`${a.name}`}
                        label={`${a.label}`}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        {
                            a.type === 'text' ? <Input placeholder={a.label} /> :
                                a.type === 'select' ?
                                    <Select
                                        showSearch
                                        placeholder={a.label}
                                        allowClear
                                        id={a.controller}
                                        onFocus={this.getData}
                                        loading={this.props.state.filters.fetching}
                                        onDropdownVisibleChange={this.visibleChange}
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        dropdownRender={menu => (
                                            <React.Fragment>

                                                <div>
                                                    <Spin className='customSpin' spinning={this.state.spinning} >
                                                        {
                                                            menu
                                                        }
                                                    </Spin>

                                                </div>


                                            </React.Fragment>
                                        )}
                                        notFoundContent={<Spin size="small" />}
                                        options={
                                            lowerCaseForSelect
                                        }

                                    >
                                    </Select> :
                                    a.type === 'date' ?
                                        <RangePicker
                                            showTime={{ format: 'HH:mm:ss' }}
                                            locale={locale}
                                            {...rangeConfig}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            ranges={{
                                                'Bu gün': [moment().startOf('day'), moment().endOf('day')],
                                                'Dünən': [moment().subtract(1, "day").startOf('day'), moment().subtract(1, "day").endOf('day')],
                                                'Bu ay': [moment().startOf('month'), moment().endOf('month')],
                                                'Keçən ay': [moment().subtract(1, "month").startOf('month'), moment().subtract(1, "month").endOf('month')],
                                            }}
                                        />
                                        :
                                        a.type === 'number' ?
                                            <Input type='number' allowClear placeholder={a.label} /> :
                                            a.type === 'range' ?
                                                <Input.Group compact>
                                                    <Input onChange={this.onChange} child={a.start} name={a.start} style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
                                                    <Input
                                                        className="site-input-split"
                                                        style={{
                                                            width: 30,
                                                            borderLeft: 0,
                                                            borderRight: 0,
                                                            pointerEvents: 'none',
                                                        }}
                                                        placeholder="~"
                                                        disabled
                                                    />
                                                    <Input
                                                        className="site-input-right"
                                                        child={a.start}
                                                        name={a.end}
                                                        onChange={this.onChange}
                                                        style={{
                                                            width: 100,
                                                            textAlign: 'center',
                                                        }}
                                                        placeholder="Maximum"
                                                    />
                                                </Input.Group> : ''
                        }

                    </Form.Item>
                </Col>

            )
        )

        const menu = (
            <Menu>
                <Menu.ItemGroup >
                    {
                        Object.values(this.props.filter).map(d => (
                            <Menu.Item key={d.key}><Checkbox id={d.name} hidden={d.hidden} onChange={this.hiddenFilters} defaultChecked={!d.hidden} >{d.label}</Checkbox></Menu.Item>
                        ))
                    }
                </Menu.ItemGroup>
            </Menu>
        );
        return (
            <div className={this.props.state.filters.isOpen ? 'filter_wrapper' : 'filter_wrapper hide'}>
                <Form
                    ref={this.form}
                    name="advanced_search"
                    className="ant-advanced-search-form"
                    onFinish={this.onFinish}
                >


                    <Row>
                        <Col
                            span={24}
                            style={{
                                textAlign: 'left',
                                display: 'flex',
                                marginBottom: '22px',
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Axtar
                            </Button>
                            <Button
                                style={{
                                    margin: '0 20px',
                                }}
                                onClick={() => {
                                    this.form.current.resetFields();
                                }}
                            >
                                Təmizlə
                            </Button>
                            <Dropdown
                                overlay={menu}
                                onVisibleChange={this.handleVisibleChange}
                                visible={this.state.visibleMenuSettings}
                            >
                                <Button
                                    style={{
                                        border: 'none',
                                        color: '#0288d1',
                                        background: 'transparent'
                                    }}
                                    className='flex_directon_col_center'>
                                    <SettingOutlined />
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Row gutter={24}>{filterInputs}</Row>

                </Form>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    getFilterDatas, fetchData
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPage)
