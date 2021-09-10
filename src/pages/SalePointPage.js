import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import cols from '../ColNames/SalePoints/colNames'
import { Col, Row } from 'antd';
import './Page.css'
import ResponsiveTable from '../components/ResponsiveTable';
import filter from '../Filter/demands'
import FilterPage from '../components/FilterPage';

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
                    <ResponsiveTable secDatas={this.props.secondaryData ? this.props.secondaryData : ''} columns={cols.filter(c => c.hidden == false)}  cols={cols} redirectTo={'editSalePoint'} from={'salepoints'} editPage={'editSalePoint'} foredit={'salepoints'} />
                </Col>


            </Row>

        )
    }
}
const mapStateToProps = (state) => ({
    state
})
export default connect(mapStateToProps)(GridExampleContainer)
