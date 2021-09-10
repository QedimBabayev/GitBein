import React, { Component } from 'react'
import { DownloadOutlined } from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import updateChanged from '../actions/updateChanged-action'
import TransactionButtons from './TransactionButtons';
import { Button, Icon } from 'semantic-ui-react'
import { openFilter } from '../actions/modalActions/getCustomerGroupsModal-action';
import SearchInput from './SearchInput';

import {
    PlusCircleOutlined,
    SearchOutlined
} from '@ant-design/icons';
class ButtonSize extends React.Component {

  

    handleClearChnaged = (e) => {
        if (e.target.parentElement.id === 'openFilter' || e.target.id === 'openFilter') {
            e.preventDefault()
            this.props.openFilter(!this.props.state.filters.isOpen)
            return false
        }
        this.props.updateChanged(false, '')
    }
    onChangeText = (e) => {
        this.setState({
            text: e.target.value
        })
    };

 
    render() {

        const buttons = (
            Object.values(this.props.items).map(p =>
                <Button animated='vertical' onClick={this.handleClearChnaged} as={Link} key={p.id} to={p.url ? p.url : ''} className={p.className} id={p.id}>
                    <Button.Content visible>{p.url ? <PlusCircleOutlined /> : ''} {p.title}</Button.Content>
                    <Button.Content hidden>{p.id === 'openFilter' && this.props.state.filters.isOpen == false ? p.animated : p.id === 'openFilter' && this.props.state.filters.isOpen == true ? 'Bağla' : p.animated}</Button.Content>
                </Button>
            )
        )
        const transactionbuttons = (
            <TransactionButtons handleClearChnaged={this.handleClearChnaged} />
        )

        const buttonsWrapper = (
            <>
                {
                    this.props.fetchFast === 'transactions' ? transactionbuttons : buttons

                }
                < SearchInput from={this.props.searchFrom} fetchFast={this.props.searchFast} />
            
            </>

        )

        const modalButtonsWrapper = (
            < SearchInput from={this.props.searchFrom} fetchFast={this.props.searchFast} />

        )
        return (
            <>
                {
                    this.props.searchFrom === 'modal' ? modalButtonsWrapper : buttonsWrapper
                }
            </>
        );
    }
}
const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
    updateChanged, openFilter
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonSize))
