import React, { Component } from 'react'
import { connect } from 'react-redux'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Table.css'
import Trans from '../usetranslation/Trans';
import { Redirect, Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { fetchData } from '../actions/getData-action';
import { getToken } from '../config/token';
import { fetchDataFast } from '../actions/getData-action';
import filterObject from '../config/filterObject';
import { updateSelectedRows } from '../actions/updateStates-action';
import overlayFactory from 'react-bootstrap-table2-overlay';
import { fetchDocuments } from '../actions/getData-action';
import TableLoader from './TableLoader';
import { ConvertDecimal } from '../Function/convertNumberDecimal';
import moment from 'moment';
import { Spin, Alert } from 'antd';

import { Button, Dropdown, Menu, Checkbox } from 'antd';
import {
    SettingOutlined
} from '@ant-design/icons';
import LinkedDocs from './LinkedDocs';




var translatedCols = []
var translatedColsWrapper = []
var addedSortFunctionCols = []
var settlementsDatas = []
var menutranslatedCols = []
var menutranslatedColsWrapper = []

var datas = []
var footerName;
var tableRowEvents;
var selectRow;
const NoDataIndication = () => (
    <div className="spinner">
        <div className="rect1" />
        <div className="rect2" />
        <div className="rect3" />
        <div className="rect4" />
        <div className="rect5" />
    </div>
);


class ResponsiveTable extends Component {


    constructor(props) {
        super(props)
    }


    state = {
        activePage: 0,
        page: 1,
        sizePerPage: this.props.state.datas.totalLimit,
        pageChange: false,
        selected: [],
        from: this.props.from,
        initialcols: this.props.initialcols ? this.props.initialcols : this.props.cols,
        attributes: this.props.attributes ? this.props.attributes : '',
        redirect: false,
        selectedRowId: '',
        defaultSorterName: '',
        defaultSorterDir: 0,
        visibleMenuSettings: false,
        columns: this.props.columns,
        redirectto: this.props.editPage,
        drawer: this.props.drawer ? this.props.drawer : '',
        drawerVisible: false,
        linkedDocs: {}

    }


    onChangePage = (page, sizePerPage) => {
        const currentIndex = (page - 1)
        filterObject.pg = currentIndex
        if (getToken()) {
            if (this.props.state.datas.searching != '') {
                filterObject.fast = this.props.state.datas.searching
                this.props.fetchDataFast(this.props.from, filterObject)
            }
            else {
                filterObject.fast = ''
                this.props.fetchData(this.props.from, filterObject)
            }
        }


    }

    onPageChange = (page) => {
        const currentIndex = (page - 1)
        filterObject.pg = currentIndex
        if (getToken()) {

            if (this.props.state.datas.searching != '') {
                filterObject.fast = this.props.state.datas.searching
                this.props.fetchDataFast(this.state.from, filterObject)
            }
            else {
                filterObject.fast = ''
                this.props.fetchData(this.props.from, filterObject)
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.selected != this.state.selected) {
            this.props.updateSelectedRows(this.state.selected)
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
    }


    componentWillReceiveProps(nextState) {
        if (this.props.columns != nextState.columns) {
            this.setState({
                columns: this.props.columns,
                initialcols: this.props.initialcols ? this.props.initialcols : this.props.cols,
            })
        }
    }

    handleSort = (field, order) => {
        filterObject.id = ''
        filterObject.sr = field
        order === 'asc' ? filterObject.dr = 0 : filterObject.dr = 1
        if (getToken()) {
            if (this.props.state.datas.searching != '') {
                filterObject.fast = this.props.state.datas.searching
                this.props.fetchDataFast(this.state.from, filterObject)
            }
            else {
                filterObject.fast = ''
                this.props.fetchData(this.state.from, filterObject)
            }

        }
    }

    handleFooter = (column, colIndex, { text }) => {
        if (column.dataField === 'PaymentIn') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.InSum)
        }
        else if (column.dataField === 'PaymentOut') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.OutSum)
        }

        else if (column.dataField === 'Amount') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.AllSum)
        }
        else if (column.dataField === 'Bank') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.BankSum)
        }
        else if (column.dataField === 'Sum') {
            footerName = ConvertDecimal(parseFloat(this.props.state.datas.additionalInfo.AllSum + this.props.state.datas.additionalInfo.BankSum))
        }
        else if (column.dataField === 'Profit') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.ProfitSum)
        }
        else if (column.dataField === 'Discount') {
            footerName = ''
        }
        else if (column.dataField === 'UseBonus') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.BonusSum)
        }
        else if (column.dataField === 'SumCost') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.AllCost)
        }
        else if (column.dataField === 'SumPrice') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.AllAmount)
        }
        else if (column.dataField === 'RetSumCost') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.RetAllCost)
        }
        else if (column.dataField === 'RetSumPrice') {
            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.RetAllAmount)
        }

        else if (column.dataField === 'ProfitPercent') {
            footerName = ConvertDecimal(parseFloat(this.props.state.datas.additionalInfo.AllProfit) * 100 / parseFloat(this.props.state.datas.additionalInfo.AllCost - this.props.state.datas.additionalInfo.RetAllCost))
        }
        if (column.footerName === 'ProfitSumReports') {

            footerName = ConvertDecimal(this.props.state.datas.additionalInfo.AllProfit)
        }
        return (
            <span>{footerName}</span>
        )
    }

    handleVisibleChange = flag => {
        this.setState({ visibleMenuSettings: flag });
    };

    handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            this.setState({
                selected: [...this.state.selected, row]
            });

        }
        else {
            this.setState({
                selected: this.state.selected.filter(x => x.Id !== row.Id)
            });


        }


    }

    showDrawer = (id) => {
        var linkedDocs = {}
        linkedDocs.token = getToken()
        linkedDocs.moment = moment()
            .format('DD/MM/YYYY HH:mm')
            .replace(/T/, " ")
            .replace(/\..+/, "")
            .replaceAll("/", ".")
            .slice(0, 16);
        linkedDocs.pg = 0
        linkedDocs.cus = id
        linkedDocs.lm = 15

        this.props.fetchDocuments(linkedDocs)
        this.setState({
            drawerVisible: true,
            linkedDocs: linkedDocs

        });

    };
    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };
    onChange = (e) => {

        var initialCols = this.state.initialcols
        console.log(initialCols)
        var findelement;
        var findelementindex;
        var replacedElement
        findelement = initialCols.find(c => c.dataField === e.target.id)
        findelementindex = initialCols.findIndex(c => c.dataField === e.target.id)
        findelement.hidden = !e.target.checked
        replacedElement = findelement
        initialCols.splice(findelementindex, 1, { ...findelement, ...replacedElement });
        var filtered = initialCols.filter(c => c.hidden == false)
        this.setState({
            columns: filtered
        })
    }
    render() {
        translatedCols = []
        translatedColsWrapper = []
        menutranslatedCols = []
        menutranslatedColsWrapper = []
        addedSortFunctionCols = []
        tableRowEvents = {
            onClick: (e, row, rowIndex) => {
                console.log(row)
                this.setState({
                    redirect: true,
                    selectedRowId: row.Id,
                    redirectname: this.props.redirectTo,
                    redirectlinkedto: row.DocType ? row.DocType === 'Demand' ? 'editDemand' : row.DocType === 'Supply' ? 'editSupply' : row.DocType === 'Enter' ? 'editEnter' : row.DocType === 'Loss' ? 'editLoss' : row.DocType === 'Move' ? 'editMove' : '' : '',
                    drawer: this.props.drawer,
                    cusname: row.CustomerName,
                    amount: row.Amount

                }, () => {
                    if (this.props.from === 'settlements') {
                        this.showDrawer(row.CustomerId)
                    }

                })

            },
        }


        selectRow = {
            mode: 'checkbox',
            onSelect: this.handleOnSelect,

        };

        if (this.props.from === 'documents') {
            if (this.state.redirect) {
                return <Redirect push to={{
                    pathname: `/${this.state.redirectlinkedto}/${this.state.selectedRowId}`,
                    state: 'p=' + this.props.from

                }} />;
            }
        }
        else if (this.state.redirectname != '') {
            if (this.state.redirect) {
                return <Redirect push to={`/${this.state.redirectto}/${this.state.selectedRowId}`} />;
            }
        }

        Object.values(this.state.columns).map(c => {
            c.onSort = this.handleSort

            if (c.showFooter === true) {
                c.footer = c.text
                c.footerName = c.footerName
                c.footerFormatter = this.handleFooter
            }
            else {
                c.footer = ''

            }
        })


        for (let i = 0; i < Object.keys(this.props.state.datas.datas).length; i++) {
            console.log(i + 1 + this.props.state.datas.totalLimit * filterObject.pg)
            this.props.state.datas.datas[i].Order = i + 1 + this.props.state.datas.totalLimit * filterObject.pg
        }

        Object.values(this.state.columns).map(c => translatedCols.push({ text: <Trans word={c.text} />, dataField: c.dataField, classes: c.classes, headerClasses: c.headerClasses, sort: c.sort, onSort: c.onSort, hidden: c.hidden, footer: c.footer, footerFormatter: c.footerFormatter, footerName: c.footerName ? c.footerName : '' }))
        if (this.props.from === 'products') {
            Object.values(this.props.cols.concat(this.props.attributes)).map(c => menutranslatedCols.push({ text: <Trans word={c.text} />, dataField: c.dataField, classes: c.classes, headerClasses: c.headerClasses, sort: c.sort, onSort: c.onSort, hidden: c.hidden }))


        }
        else {
            Object.values(this.props.cols).map(c => menutranslatedCols.push({ text: <Trans word={c.text} />, dataField: c.dataField, classes: c.classes, headerClasses: c.headerClasses, sort: c.sort, onSort: c.onSort, hidden: c.hidden }))

        }



        if (this.props.from === 'settlements') {

            Object.values(this.props.state.datas.datas).map(c => {
                if (c.Amount > 0) {
                    c.AmountProfit = c.Amount
                }
                else {
                    c.AmountBorrow = c.Amount
                }
            })
        }

        if (this.props.from === 'transactions') {

            Object.values(this.props.state.datas.datas).map(c => {
                if (c.Type === 'p') {
                    c.CashOrInvoice = <Trans word={'cash'} />
                }
                else if (c.Type === 'i') {
                    c.CashOrInvoice = <Trans word={'invoice'} />
                }
                if (c.Direct === 'i') {
                    c.PaymentIn = c.Amount
                }
                else if (c.Direct === 'o') {
                    c.PaymentOut = c.Amount
                }
            })
        }

        if (this.props.from === 'sales' || this.props.from === 'returns') {
            Object.values(this.props.state.datas.datas).map(c => {
                c.Sum = c.Amount
            })
        }
        if (this.props.from === 'salepoints') {


            Object.values(this.props.state.datas.datas).map(c => {

                for (let a = 0; a < Object.keys(this.props.secDatas).length; a++) {
                    if (this.props.secDatas[a].Id == c.StockId) {
                        c.Stock = this.props.secDatas[a].Name
                    }
                }
            })


        }

        if (this.props.from === 'salereports') {


            Object.values(this.props.state.datas.datas).map(c => {
                if (parseFloat(c.SumCost - c.RetSumCost) === 0) {
                    c.ProfitPercent = '0 %'
                }
                else {
                    c.ProfitPercent = parseFloat(c.Profit).toFixed(2) * 100 / parseFloat(c.SumCost - c.RetSumCost).toFixed(2)
                }
            })


        }



        if (this.props.from === 'documents') {

            Object.values(this.props.state.datas.datas).map(c => {
                c.TranslatedDocTypes = <Trans word={c.DocType} />
            })
        }
        translatedColsWrapper = translatedCols
        menutranslatedColsWrapper = menutranslatedCols

        const { activePage, sizePerPage, from } = this.state;
        const menu = (
            <Menu>
                <Menu.ItemGroup title={<Trans word={'columns'} />} >
                    {
                        Object.values(menutranslatedColsWrapper).map(d => (
                            <Menu.Item key={d.dataField}><Checkbox id={d.dataField} hidden={d.hidden} onChange={this.onChange} defaultChecked={!d.hidden} >{d.text}</Checkbox></Menu.Item>
                        ))
                    }
                </Menu.ItemGroup>
            </Menu>
        );

        const defaultSorted = [{
            dataField: this.props.from === 'stockbalance' || this.props.from === 'salereports' ? 'Quantity' : this.props.from === 'products' || this.props.from === 'customers' || this.props.from === 'salepoints' ? 'Name' : this.props.from === 'settlements' ? 'CustomerName' : 'Moment',
            order: 'asc'
        }];



        return (

            <div className='table-container' style={{ position: 'relative' }}>

                <div className='tableButtonsWrapper'>
                    <Dropdown
                        trigger={['click']}
                        overlay={menu}
                        onVisibleChange={this.handleVisibleChange}
                        visible={this.state.visibleMenuSettings}
                    >
                        <Button className='flex_directon_col_center'> <SettingOutlined /></Button>
                    </Dropdown>

                </div>
                {
                    this.props.state.datas.loading ? <TableLoader className='custom_table_loader show' /> : <TableLoader className='custom_table_loader hidden' />
                }


                <BootstrapTable
                    keyField='BarCode'
                    data={this.props.state.datas.fetching ? [] : this.props.state.datas.datas}
                    page={filterObject.pg + 1}
                    loading={this.props.state.datas.fetching}
                    columns={translatedColsWrapper}
                    selectRow={selectRow}
                    hover
                    condensed
                    rowEvents={tableRowEvents}
                    bordered={false}
                    defaultSorted={defaultSorted}
                    wrapperClasses={'table-responsive'}
                />

                {
                    this.props.from === 'settlements' ? <LinkedDocs cusname={this.state.cusname} amount={this.state.amount} filter={this.state.linkedDocs} visible={this.state.drawerVisible} datas={this.props.state.datas.documents} onClose={this.onClose} /> : ''
                }


                {
                    this.props.state.datas.loading ? '' : <Pagination current={filterObject.pg + 1} onChange={this.onChangePage} showSizeChanger={false} defaultPageSize={this.props.state.datas.totalLimit} total={this.props.state.datas.totalDatas} />
                }

            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    state
})
const mapDispatchToProps = {
    fetchData, updateSelectedRows, fetchDocuments, fetchDataFast
}
export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveTable)
