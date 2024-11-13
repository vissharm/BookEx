import { GridPreProcessEditCellProps } from '@mui/x-data-grid';
const AddedBookGridColumns = [
    {
      field: 'displayId', // Field with hidden data
      headerName: 'Id',
      width: 50,
      visible: true, // Keeps it hidden 
      editCondition: []
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      editable: true,
      editCondition: ['add', 'edit'],
      visible: true
    },
    {
      field: 'isbn',
      headerName: 'ISBN',
      width: 180,
      editable: true,
      isCellEditable: (params) => params.row.isNew,
      editCondition: ['add'],
      visible: true
    },
    {
      field: 'genre',
      headerName: 'Genre',
      width: 180,
      editable: true,
      editCondition: ['add', 'edit'],
      visible: true
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 180,
      editable: true,
      editCondition: ['add', 'edit'],
      visible: true
    },
    {
      field: 'condition',
      headerName: 'Condition',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Like New', 'Fine', 'Very Good', 'Fair', 'Poor'],
      editCondition: ['add', 'edit'],
      visible: true,
    },
    {
      field: 'rent_price',
      headerName: 'Rent per day (INR)',
      width: 140,
      editable: true,
      editCondition: ['add', 'edit'],
      visible: true
    },
    {
      field: 'users_books_id', // Field with hidden data
      headerName: 'Id',
      width: 130,
      visible: false, // Keeps it hidden 
      editCondition: []
    },
  ];

  export const emptyAddRow = { id:'001', users_books_id: '001', title: '', isbn: '', genre: '', author: '', condition: '', rent_price: '15', isNew: true }

  export default AddedBookGridColumns;