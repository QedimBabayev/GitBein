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
        label: 'Dəyişmə tarixi',
        name: 'modifedDate',
        type: 'date',
        hidden: true,
    },
    {

        key :'8',
        label: 'Məbləğ',
        name: 'docPrice',
        type: 'range',
        hidden: true,
    },
    {

        key :'9',
        label: 'Tarixi',
        name: 'createdDate',
        type: 'date',
        hidden: false,
    },

]

export default filter