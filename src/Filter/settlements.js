const filter = [

    {
        key :'1',
        label: 'Sənəd Nömrəsi',
        name: 'docNumber',
        type: 'text',
        hidden: false,
    },
    {

        key :'2',
        label: 'Məhsul adı',
        name: 'productName',
        type: 'select',
        controller: 'products',
        hidden: false,
    },

    {

        key :'3',
        label: 'Barkodu',
        name: 'barcode',
        type: 'number',
        hidden: false,
    },
    {
        key :'4',
        label: 'Anbar',
        name: 'stockName',
        type: 'select',
        controller: 'stocks',
        hidden: false,
    },
    {

        key :'5',
        label: 'Şöbə',
        name: 'departmentName',
        controller: 'departments',
        type: 'select',
        hidden: true,
    },
    {
        key :'6',
        label: 'Cavabdeh',
        name: 'ownerName',
        controller: 'owners',
        type: 'select',
        hidden: true,
    },
    {
        key :'7',
        label: 'Tarix',
        name: 'moment',
        type: 'onemoment',
        hidden: true,
    },
    {
        key :'8',
        label: 'Müştəri',
        name: 'customerName',
        controller: 'customers',
        type: 'select',
        hidden: false,
    },
    {

        key :'9',
        label: 'Məbləğ',
        name: 'docPrice',
        start: 'amb',
        end: 'ame',
        type: 'range',
        hidden: true,
    },


]

export default filter