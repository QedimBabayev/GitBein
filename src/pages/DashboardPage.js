import React from 'react'
import { Card, Col, Row } from 'antd';
import 'antd/dist/antd.css';
import { Trans, useTranslation } from "react-i18next";
import './dashboard.css'
import LoaderHOC from '../components/LoaderHOC'
import Chart from '../components/Chart'
import { getDaysBetweenDates } from '../Function/getDaysBetweenDates'
import moment from 'moment/min/moment-with-locales';
moment.locale('az');


var startDate = moment().subtract(1, "month").format()
var endDate = moment().format()
var dailyArray = []

var chartJSON = []
dailyArray = []
dailyArray = getDaysBetweenDates(startDate, endDate)
dailyArray.map(p =>
    chartJSON.push({
        year: p
    })
)

function GridExampleContainer(props) {
    const { t, i18n } = useTranslation();
 
    return (

        <Row>

            <Col xs={24} md={12} xl={6}>
                <Card title={t('salesdashboard')} bordered={false}>

                    <ul className='dashboard_card_ul'>
                        <li>
                            <span>{t('today')} :</span>
                            <span>{props.cardIndicators.Sales}</span>
                        </li>
                        <li>
                            <span>{t('yesterday')} :</span>
                            <span>{props.cardIndicators.LastSales}</span>
                        </li>
                    </ul>
                </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
                <Card title={t('financedashboard')} bordered={false}>
                    <ul className='dashboard_card_ul'>
                        <li>
                            <span>{t('balance')} :</span>
                            <span>{props.cardIndicators.CashesBalance}</span>
                        </li>
                        <li>
                            <span>{t('cashes')} :</span>
                            <span>{props.cardIndicators.LastCashesBalance}</span>
                        </li>
                    </ul>
                </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
                <Card title={t('stockbalancedashboard')} bordered={false}>
                    <ul className='dashboard_card_ul'>
                        <li>
                            <span>{t('cost')} :</span>
                            <span>{props.cardIndicators.StockBalance}</span>
                        </li>
                        <li>
                            <span>{t('quantity')} :</span>
                            <span>''</span>
                        </li>
                    </ul>
                </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
                <Card title={t('profitdashboard')} bordered={false}>
                    <ul className='dashboard_card_ul'>
                        <li>
                            <span>{t('today')} :</span>
                            <span>{props.cardIndicators.Profit}</span>
                        </li>
                        <li>
                            <span>{t('yesterday')} :</span>
                            <span>{props.cardIndicators.LastProfit}</span>
                        </li>
                    </ul>
                </Card>
            </Col>
            <Col xs={16} md={16} xl={16}>
                <Chart days={chartJSON} indicators={props.chartIndicators} />

            </Col>

        </Row>

    )
}

export default LoaderHOC(GridExampleContainer, 'cardIndicators')
