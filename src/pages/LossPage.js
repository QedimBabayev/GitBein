import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import cols from '../ColNames/Losses/colNames'
import { persistConfig } from '../reducers/rootReducer'
import filter from '../Filter/losses'
import FilterPage from '../components/FilterPage';
import { Col, Row } from 'antd';
import './Page.css'
import ResponsiveTable from '../components/ResponsiveTable';


class GridExampleContainer extends Component {
    contextRef = createRef()

    constructor(props) {
        super(props)
        this.state = {
            cols: cols
        }
    }



    render() {
        return (
            <Row className={'table_holder_section'}>
                <Col xs={24} md={24} xs={24}>
                    <FilterPage filter={filter} />

                </Col>
                <Col xs={24} md={24} xl={24}>
                    <ResponsiveTable cols={cols} columns={cols.filter(c => c.hidden == false)} redirectTo={'editLoss'} from={'losses'} editPage={'editLoss'} foredit={'losses'} />
                </Col>


            </Row>

        )
    }
}
const mapStateToProps = (state) => ({
    state
})
export default connect(mapStateToProps)(GridExampleContainer)
