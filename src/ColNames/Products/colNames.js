

const cols = [

    {
        dataField: 'Order',
        text: '№',
        sort: false,
        classes: 'orderField',
        hidden: false

    },
    {
        dataField: 'Name',
        text: 'Product Name',
        classes: 'nameField',
        sort: true,
        hidden: false,

    },

    {
        dataField: 'BarCode',
        text: 'BarCode',
        sort: true,
        hidden: false


    },
    {
        dataField: 'GroupName',
        text: 'Product GroupName',
        sort: true,
        hidden: false


    },
    {
        dataField: 'ArtCode',
        text: 'ArtCode',
        headerClasses: 'prField',
        classes: 'prField',
        sort: true,
        hidden: false


    }, {
        dataField: 'BuyPrice',
        text: 'BuyPrice',
        sort: true,
        classes: 'prField',
        headerClasses: 'prField',
        hidden: false


    },

    {
        dataField: 'Price',
        text: 'Product Price',
        sort: true,
        headerClasses: 'prField',
        classes: 'prField',
        hidden: false


    },
    {
        dataField: 'MinPrice',
        text: 'MinPrice',
        headerClasses: 'prField',
        classes: 'prField',
        sort: true,
        hidden: true


    }, {
        dataField: 'Description',
        text: 'Description',
        sort: true,
        hidden: true


    },
    {
        dataField: 'StockBalance',
        text: 'StockBalance',
        sort: true,
        headerClasses: 'prField',
        classes: 'prField',
        hidden: true


    },
    {
        dataField: 'PackPrice',
        text: 'PackPrice',
        headerClasses: 'prField',
        classes: 'prField',
        sort: true,
        hidden: true


    },
    {
        dataField: 'PackQuantity',
        text: 'PackQuantity',
        headerClasses: 'prField',
        classes: 'prField',
        sort: true,
        hidden: true


    },


];
export default cols


