import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { FaWarehouse } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE } from '../config/env';
import { MdBrandingWatermark } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { GiExpense } from 'react-icons/gi';
import { GoSettings } from 'react-icons/go';
import Trans from '../usetranslation/Trans';
import { fetchData } from '../actions/getData-action';
import StocksPage from './StocksPage';
import ModPage from './ModPage';
import { getToken } from '../config/token';
import { getModPage } from '../actions/modifications/mod-actions';
import { Skeleton } from 'antd';
import SpendItemsPage from './SpendItemsPage';
import './Settings.css'
import DepartmentPage from './DepartmentPage';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultPageName: 'stocks',
            loading: true

        }
    }

    state = {
        refList: []
    }
    componentDidMount() {
        var getFilter = {}
        getFilter.token = getToken()
        this.props.fetchData('stocks', getFilter)
    }


    async getRefTypes(object) {
        const res = await axios.post(`${API_BASE}/attributes/getreftypes.php`, object);
        return await res;
    }

    changePage = (e) => {
        console.log(e)
        this.setState({
            defaultPageName: e.key,
            loading: true
        }, () => {
            var getFilter = {}
            getFilter.token = getToken()
            if (this.state.defaultPageName === 'attributes') {
                this.props.getModPage(getFilter, this.state.defaultPageName)
            }
            else {
                this.props.fetchData(this.state.defaultPageName, getFilter)

            }
        })
    }
    render() {
        return (
            <Layout className='settings_layout'>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Ayarlar</Breadcrumb.Item>
                        <Breadcrumb.Item> <Trans word={this.state.defaultPageName} /> </Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                        <Sider className="site-layout-background" width={200}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['stocks']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%' }}
                            >

                                <SubMenu key="sub1" icon={<MdSettings />} title="Anbarlar">
                                    <Menu.Item onClick={this.changePage} icon={<FaWarehouse />} name='stocks' key="stocks">Anbarlar</Menu.Item>
                                    <Menu.Item onClick={this.changePage} icon={<FiUsers />} key="Users">Istifadəçilər</Menu.Item>
                                    <Menu.Item onClick={this.changePage} icon={<MdBrandingWatermark />} key="departments">Şöbələr</Menu.Item>
                                    <Menu.Item onClick={this.changePage} icon={<HiTemplate />} key="Templates">Şablonlar</Menu.Item>
                                    <Menu.Item onClick={this.changePage} icon={<MdAccountBalanceWallet />} key="Taxes">Tariflər</Menu.Item>
                                    <Menu.Item onClick={this.changePage} icon={<GiExpense />} key="spenditems">Xərc maddələri</Menu.Item>
                                    <Menu.Item onClick={this.changePage} icon={<GoSettings />} key="attributes">Modifikasiyalar</Menu.Item>

                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>

                            {
                                this.state.defaultPageName == 'stocks' ? <StocksPage fetching={this.props.state.datas.loading} datas={this.props.state.datas.datas} /> :
                                    this.state.defaultPageName == 'attributes' ? this.props.state.mods.pageloading ? <Skeleton active /> : <ModPage refList={this.props.state.mods.refTypes} fetching={this.props.state.datas.loading} datas={this.props.state.datas.datas} /> :
                                        this.state.defaultPageName == 'spenditems' ? <SpendItemsPage fetching={this.props.state.datas.loading} datas={this.props.state.datas.datas} /> : 
                                        this.state.defaultPageName == 'departments' ? <DepartmentPage fetching={this.props.state.datas.loading} datas={this.props.state.datas.datas} /> : ''


                            }

                        </Content>
                    </Layout>
                </Content>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    fetchData, getModPage
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
