import React, { Component } from 'react'
import { connect } from 'react-redux'
import BootstrapTable from 'react-bootstrap-table-next';
import { Table, Switch, Space } from 'antd';
import 'antd/dist/antd.css';
var childrenArr = []
class TableProfit extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            datas: [],
            expandedRowKeys: ['4']
        };
    }


    componentDidMount() {
        childrenArr = []
        var spendItemsSum = 0;
        {
            this.props.datas.map(d => {
                spendItemsSum += parseFloat(d.Amount)
                childrenArr.push({
                    key: d.Id,
                    name: d.Name,
                    profit: parseFloat(d.Amount).toFixed(2)
                })
            })

        }
        var clearProfit = parseFloat(this.props.state.datas.profitInfo.SaleSum - this.props.state.datas.profitInfo.CostSum - spendItemsSum).toFixed(2)


        this.setState({

            datas: [
                {
                    key: 1,
                    name: 'Satış dövrüyyəsi',
                    profit: parseFloat(this.props.state.datas.profitInfo.SaleSum).toFixed(2) + ' ₼'
                },
                {
                    key: 2,
                    name: 'Mayası',
                    profit: parseFloat(this.props.state.datas.profitInfo.CostSum).toFixed(2) + ' ₼'
                },
                {
                    key: 3,
                    name: 'Dövrüyyə mənfəəti',
                    profit: parseFloat(this.props.state.datas.profitInfo.SaleSum - this.props.state.datas.profitInfo.CostSum).toFixed(2) + ' ₼'
                },
                {
                    key: 4,
                    name: 'Xərclər (toplam)',
                    profit: parseFloat(spendItemsSum).toFixed(2) + ' ₼',
                    children: childrenArr
                },
                {
                    key: 5,
                    name: <span className='boldContent'>Təmiz mənfəət</span>,
                    profit: <span className='boldContent' style={{ color: clearProfit < 0 ? "red" : 'initial' }}>{clearProfit} ₼</span>
                },
            ]

        })
    }

    render() {


        return (
            <Table
                columns={this.props.cols}
                dataSource={this.state.datas}
                pagination={false}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(TableProfit)
