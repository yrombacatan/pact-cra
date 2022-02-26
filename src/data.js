// some dummy record for testing

let invoicesList = [
    {
        invoiceNo: 1,
        name: 'Bob Smith',
        product: 'Laptop Predator',
        amount: 50000,
        processingFee: 1000,
        total: 51000,
        data: '01/02/2022' 
    },
    {
        invoiceNo: 2,
        name: 'Alice Smith',
        product: 'Panasonic Washing',
        amount: 10000,
        processingFee: 1500,
        total: 51000,
        data: '02/01/2022' 
    },
    {
        invoiceNo: 3,
        name: 'John Smith',
        product: 'Tv Samsung 34"',
        amount: 25000,
        processingFee: 500,
        total: 51000,
        data: '02/05/2022' 
    },
    {
        invoiceNo: 4,
        name: 'Carol Smith',
        product: 'Table 4x4 feet Mahugani',
        amount: 5000,
        processingFee: 800,
        total: 51000,
        data: '02/06/2022' 
    },
]

const deleteInvoice = id => {
   invoicesList = invoicesList.filter(invoice => invoice.id !== id)
}

const getInvoices = () => {
    return invoicesList
}

export { getInvoices, deleteInvoice}