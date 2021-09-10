import React, { Component } from 'react'
import { Menu, Dropdown } from 'antd';
import { Button, Icon } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import Trans from '../usetranslation/Trans';
import './TransactionButtons.css'

const menuPaymentIn = (
    <Menu className='transaction_buttons_menu'>
        <Menu.Item key="0">
            <Button as={Link} to="/createPaymentIn">< Trans word={'cash'} /></Button>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
            <a href="/createInvoiceIn"><Trans word={'invoice'} /></a>
        </Menu.Item>
    </Menu>
);


const menuPaymentOut = (
    <Menu className='transaction_buttons_menu'>
        <Menu.Item key="0">
            <Button as={Link} to="/createPaymentOut">< Trans word={'cash'} /></Button>

        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1">
            <a href="/createInvoiceOut">< Trans word={'invoice'} /></a>
        </Menu.Item>
    </Menu>
);

class TransactionButtons extends Component {
    render() {
        return (
            <>
                <Dropdown overlay={menuPaymentIn} trigger={['click']}>
                    <Button animated='vertical' className='project_buttons'>
                        <Button.Content visible><Trans word={'NewPaymentIn'} /> </Button.Content>
                        <Button.Content hidden><DownOutlined /></Button.Content>
                    </Button>
                </Dropdown>
                <Dropdown overlay={menuPaymentOut} trigger={['click']}>
                    <Button animated='vertical' className='project_buttons'>
                        <Button.Content visible><Trans word={'NewPaymentOut'} /> </Button.Content>
                        <Button.Content hidden><DownOutlined /></Button.Content>
                    </Button>
                </Dropdown>
            </>
        )
    }
}

export default TransactionButtons