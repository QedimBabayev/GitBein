import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Checkbox } from 'antd';
import putLogin from '../actions/putLogin-actions.js/putLogin';
import { updateUpperheader,updateSubheader } from '../actions/getNavbar-action';
import { Redirect } from 'react-router-dom';


class Login extends Component {

    state = {
        redirect: false
    }
    onFinish = (values) => {
        this.props.putLogin(values)

    };
    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.state.login.isLoggedIn != this.props.state.login.isLoggedIn) {
            this.setState({
                redirect: true
            })
         
        }
    }

    render() {
        console.log(this.state.redirect)
        if (this.state.redirect) {
            return <Redirect to="/p=dashboard" />
        }
        return (
            <div>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="Login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    putLogin,updateUpperheader,updateSubheader
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)




