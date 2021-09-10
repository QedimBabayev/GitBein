import React, { Component } from 'react'
import TableLoader from './TableLoader'
import { Spin, Alert } from 'antd';

const LoaderHOC = (WrappedComponent, field) => {
    return class LoaderHOC extends Component {
        render() {
            console.log(this.props[field])
            return this.props[field].length === 0 ? <Spin className='fetchSpinner' tip="Yüklənir...">
                    <Alert/>
                </Spin>: <WrappedComponent {...this.props} />
        }
    }
}


export default LoaderHOC