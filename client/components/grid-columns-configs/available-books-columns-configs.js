export const OrderedBookGridColumns = [
    {
      field: 'displayId', // Field with hidden data
      headerName: 'Id',
      width: 50,
      editCondition: [],
      visible: true
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      editable: false,
      editCondition: [],
      visible: true
    },
    {
      field: 'isbn',
      headerName: 'ISBN',
      width: 180,
      editable: false,
      editCondition: [],
      visible: true
    },
    {
      field: 'genre',
      headerName: 'Genre',
      width: 180,
      editable: false,
      editCondition: [],
      visible: true
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 180,
      editable: false,
      editCondition: [],
      visible: true
    },
    {
      field: 'name',
      headerName: 'Owner Name',
      width: 180,
      editable: false,
      editCondition: [],
      visible: true
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 180,
      editable: false,
      editCondition: [],
      visible: true
    },
    {
      field: 'rent_price',
      headerName: 'Rent per day (INR)',
      width: 140,
      editable: false,
      editCondition: [],
      visible: true
    },
    {
      field: 'users_books_id', // Field with hidden data
      headerName: 'Id',
      width: 130,
      editCondition: [],
      visible: false
    }
  ];

  export default OrderedBookGridColumns;