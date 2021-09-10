import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'antd';
import './Page.css'
import { Link } from 'react-router-dom';


class GridExampleContainer extends Component {

    constructor(props) {
        super(props)

    }



    render() {
        return (
            <Row className={'table_holder_section download_page'}>

                <Col xs={24} md={24} xl={24}>
                    <h2>Kassa Proqramı</h2>
                    <p>
                        İstənilən cihaz ilə işləmək imkanı(PC-kompüter, NoteBook,
                        NetBook, Planşet): Onlayn və Offlayn rejimdə. Sadə və rahat
                        interfeys.Satışların qeydiyyatı, müştəriyə qaytarılacaq qalığın
                        göstərilməsi. Növbələrin açılıb bağlanması. Qaytarmalar ilə
                        hərəkat.Ştrixkod və Barkodun dəstəklənməsi.
                    </p>
                </Col>

                <Col xs={24} md={24} xl={24}>
                    <h5>
                        <span>Bein </span> kassa proqramı
                    </h5>
                    <p>
                        Kassa proqramını əldə etmək üçün aşağıdakı düyməyə tıklayın.<br />
                        Şifrə tələb olduqda <span>"bein"</span> sözü daxil edin.
                    </p>
                    <Link to='./downloads/?p=release'/>
                </Col>
            </Row>

        )
    }
}
const mapStateToProps = (state) => ({
    state
})
export default connect(mapStateToProps)(GridExampleContainer)
