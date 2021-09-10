import React, { Component } from 'react'
import { Button, message, Modal, Menu, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import updateChanged from '../actions/updateChanged-action'
import { updateSelectProductMultiConfirm, updateSendObject, submitForm } from '../actions/updateStates-action';
// import Sound from 'react-sound';
import { saveDoc } from '../actions/putAactions/saveBtn-action';
// import Ok from '../audio/ok.mp3'
import { duration } from 'moment';
import {
    CheckSquareOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import './Doc.css'

const key = 'updatable';
const OpenMessage = (save) => {
    console.log(save)
    // message.loading({ content: 'Yüklənir...', duration :2.5 })
    // .then(() => message.success('Loading finished', 2.5) )
    // setTimeout(() => {
    //     message.success({ content: 'Yüklənildi!', key, duration: 2 });
    // }, 1000);
};

class DocButtons extends React.Component {


    state = {
        redirect: false,
        send: false,
        isPlaying: false,
        visible: false,
        from: this.props.from,
        fromDoc: this.props.fromDoc,
        toDoc: this.props.toDoc,
        returnPage: false,
        redirectExternal: false,
        redirectLinkedDoc: false

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    handleReturnPage = () => {
        this.setState({
            redirect: true
        });
    }
    handleCloseAlert = () => {
        message.destroy();
    }

    handleClearChanged = (e) => {
        if (e.target.parentNode.id === 'closeBtn' || e.target.id === 'closeBtn') {

            this.setState({
                returnPage: false,
                send: false,
            })
            this.setState({
                redirect: true
            });
        }
        else if (e.target.parentNode.id === 'saveBtn' || e.target.id === 'saveBtn') {
            this.setState({
                returnPage: false,
            })


        }
        else if (e.target.parentNode.id === 'newDropdown') {

        }
    }


    handleeSaveDocModal = () => {
        this.setState({
            returnPage: true
        })
    }
    onChangeText = (e) => {
        this.setState({
            text: e.target.value
        })
    };

    handlePayment = () => {
        this.setState({
            redirectExternal: true
        })
    }
    handleLinked = () => {
        this.setState({
            redirectLinkedDoc: true
        })
    }
    // progress = (fetching, mess) => {
    //     console.log(fetching)
    //     if (fetching) {
    //         message.loading('Yüklənir...')
    //     }
    //     else if (fetching === 'error') {
    //         console.log('errora girdi')

    //         message.destroy()
    //         message.error(`Saxlanılmadı.. ${mess}`)

    //     }
    //     else {

    //         message.destroy()
    //         if (this.props.state.putdatas.responseStatus === '0') {
    //             message.success('Saxlanıldı')
    //         }
    //         else {
    //             message.error(`Saxlanılmadı.. ${mess}`)
    //         }
    //     }
    // };


    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps.state.putdatas.fetching)

    //     if (nextProps.state.putdatas.fetching != this.props.state.putdatas.fetching) {
    //         this.progress(nextProps.state.putdatas.fetching, nextProps.state.putdatas.responseId)
    //     }
    // }

    render() {
        if (this.state.redirect) {
            console.log('isled')
            return <Redirect push to={`/${this.props.from}`} />;
        }
        if (this.state.redirectExternal) {
            return <Redirect push to={{
                pathname: `/${this.props.toDoc}`,
                state: {
                    fromdoc: this.props.fromDoc,
                    doc: this.props.doc
                }
            }} />;
        }
        if (this.state.redirectLinkedDoc) {
            return <Redirect push to={{
                pathname: this.props.toLinked,
                state: {
                    fromdoc: this.props.fromDoc,
                    doc: this.props.doc[0]
                }
            }} />;
        }


        const menu = (
            <Menu>
                <Menu.Item key="0" onClick={this.handlePayment} disabled={this.props.linkedDocs} fromDoc={this.props.fromDoc} toDoc={this.props.toDoc}>Ödəniş</Menu.Item>
                <Menu.Item key="1" disabled={this.props.linkedDocs} onClick={this.handleLinked}>Qaytarma</Menu.Item>
                <Menu.Item key="2">Sifariş</Menu.Item>
            </Menu>
        );
        return (
            <div className='doc_header_buttons '>
                {
                    Object.values(this.props.buttonsName).filter(p => p.id === 'saveBtn').map(p =>
                        <Button onClick={this.handleClearChanged} form={p.form} htmlType={'submit'} loading={this.props.loading} key={p.id} className={p.className} id={p.id}>{p.title}</Button>
                    )
                }
                {
                    Object.values(this.props.buttonsName).filter(p => p.id != 'saveBtn').map(p =>
                        p.icon ? <Dropdown overlay={menu} trigger={['click']}>

                            <Button htmlType={p.type} key={p.id} className={p.className} icon={<PlusCircleOutlined />} onClick={e => e.preventDefault()}>
                                {p.title}
                            </Button>
                        </Dropdown> :
                            <Button onClick={this.handleClearChanged} form={p.form} htmlType={p.type} key={p.id} className={p.className} id={p.id}>{p.title}</Button>

                    )




                }

          
                <Modal
                    title='Diqqət'
                    closable={false}
                    className='close_doc_modal_wrapper'
                    visible={this.state.visible}
                    footer={[

                        <Button key="back" onClick={this.handleCancel}>
                            Geri qayıt
                        </Button>,
                        <div className='close_doc_modal_right_side'>
                            <Button form="myForm" key="submit" htmlType="submit" onClick={this.handleeSaveDocModal} >
                                Bəli
                            </Button>
                            <Button
                                key="link"
                                href="#"
                                type="primary"
                                onClick={this.handleReturnPage}
                            >
                                Xeyr
                            </Button>
                        </div>

                    ]}
                >
                    <p>Dəyişikliklər yadda saxlanılsın</p>
                </Modal>

            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
    updateChanged, updateSelectProductMultiConfirm, updateSendObject, submitForm, saveDoc
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocButtons))
