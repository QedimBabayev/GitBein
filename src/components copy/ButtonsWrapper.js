import React, { Component } from 'react'
import PageHeaderCustom from './PageHeaderCustom'
import { connect } from 'react-redux'
import Buttons from './Buttons'
import { Col, Row } from 'antd';

import './ButtonsWrapper.css'
class ButtonsWrapper extends Component {

    render() {
        return (
            <Row className='buttons_wrapper_side' style={{zIndex : !this.props.state.stateChanges.zindex ? 102 : 0}} >
                <Col xs={16} md={8} xl={4}>
                    <PageHeaderCustom activeItem={this.props.activeitem} activeSubItem={this.props.activesubitem} />
                </Col>
                <Col xs={16} md={8} xl={20}>
                    <div className='buttons_center'>
                        <Buttons searchFrom = {this.props.from}  fetchFast={this.props.fetchFast} searchFast = {this.props.fetchFast} from={this.props.from ? this.props.from : ''} items={this.props.buttonsName} activeSubItem={this.props.activesubitem} />
                    </div>
                </Col>
            </Row>

        )
    }
}


const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(ButtonsWrapper)
