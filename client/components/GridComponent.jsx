import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

const customStyles = {
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: 'lightblue',
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: 'lightgray',
  },
  boxShadow: 2,
  border: 2,
  borderColor: 'primary.light',
  '& .MuiDataGrid-cell:hover': {
    color: 'primary.main',
  },
};

function EditToolbar(props) {
  const { rows, setRows, setRowModesModel, addRecordBtnText = 'Add record', dummyAddRow, onModeChange } = props;

  const handleClick = () => {
    var isEditRowExist = rows.find(r => r.id === '001');
    if (isEditRowExist) {
      return
    }
    const id = '001';
    const cloneRow = structuredClone(dummyAddRow);
    cloneRow.isNew = true;
    console.log(cloneRow, dummyAddRow);
    setRows((oldRows) => [
      ...oldRows,
      cloneRow
    ]);
    onModeChange('add');
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        {addRecordBtnText}
      </Button>
    </GridToolbarContainer>
  );
}

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-rows-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-rows-primary"
          d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-rows-secondary"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>No rows</Box>
    </StyledGridOverlay>
  );
}

export default function GridComponent(props) {
  if (!props) {
    console.log('props undefined!')
  }

  const {
    data,
    rowSelectionId,
    addRecordBtnText = 'ADD RECORD',
    columns,
    genericActionLabel = '',
    height,
    isDeleteAllowed = true,
    isGenericActionAllowed = false,
    isGenericActionDisabled = false,
    isEditAllowed = false,
    isAddAllowed = true,
    dummyAddRow,
    uniqueIdentityColumn,
    width,
    onAddRow = () => {},
    onDeleteRow = () => {},
    onGenericAction = () => {},
    onSaveRow  = () => {},
    validationRules = {},
    onRowClick = (row) => {}
  } = props
  const [rows, setRows] = React.useState(data);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [errorMessages, setErrorMessages] = React.useState({});
  const [operationMode, setOperationMode] = React.useState('view'); // edit, add , view
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [editingRowId, setEditingRowId] = React.useState(null);
  
  React.useEffect(() => {
    if (rowSelectionId) {
      setSelectionModel([rowSelectionId]);
      setSelectedRowId(rowSelectionId);
    }
  }, [rowSelectionId]);

  React.useEffect(() => {
    setRows(data);
    const hideConfig =columnsConfig.reduce((accumulator, col) => {
      accumulator[col.field] = !!col.visible; // Set the user object at the key of user id
      return accumulator;
    }, {});
    setColumnVisibilityModel(hideConfig);
  }, [data]);

  const actionColumn =
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode && isAddAllowed) {
        return [

          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: 'primary.main',
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      const editCell = <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        className="textPrimary"
        onClick={handleEditClick(id)}
        color="inherit"
      />;

      const deleteCell = <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={handleDeleteClick(id)}
        color="inherit"
      />;
      const actionButtons = [];
      if (isEditAllowed) {
        actionButtons.push(editCell);
      }

      if (isDeleteAllowed) {
        actionButtons.push(deleteCell);
      }

      const genericAction = <GridActionsCellItem
        disabled={isGenericActionDisabled}
        icon={<Button variant="contained">{genericActionLabel}</Button>}
        label={genericActionLabel}
        onClick={() => {
          const row = rows.find(r => r[uniqueIdentityColumn] === id);
          onRowClick(row);
          setSelectedRowId(id);
          onGenericAction(id, row);
        }}
        color="inherit"
      />;

      if (isGenericActionAllowed) {
        actionButtons.push(genericAction);
      }

      console.log(actionButtons);
      return actionButtons;
    },
  }

  const handleCellEditStart = (params) => {
    setEditingRowId(params.id);
  };

  const handleCellEditStop = () => {
    setEditingRowId(null);
  };

  const onModeChange = (mode) => {
    setOperationMode(mode)
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    onModeChange('edit');
  };

  const handleSaveClick = (id) => () => {
    console.log(rowModesModel)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    onModeChange('view');
  };

  const handleDeleteClick = (id) => async () => {
    setSelectionModel([]); 
    console.log('Delete called');
    var rows_final = rows.filter((row) => row[uniqueIdentityColumn] !== id);
    await onDeleteRow(id);
    setRows(rows_final.length > 0 ? rows_final : []);
  };

  const handleCancelClick = (id) => () => {
    onModeChange('view');
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === '001');
    if (editedRow && editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
      setErrorMessages({});
    }
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = async (newRow, originalRow) => {
    setSelectionModel([]); 
    if (!newRow || !newRow.id) {
      console.warn("Updated row data is missing or undefined.");
      return;
    }

    console.log(newRow.id, '===')
    for (const field of Object.keys(newRow)) {
      const value = newRow[field];
      const validateRule = validationRules[field];
      if (validateRule && validateRule.isValid) {
        var isValid = validateRule.isValid(value);
        if (!isValid) {
          var error = validateRule.error;
          console.log(field, error);
          errorMessages[field] = error;
          rowModesModel.mode = GridRowModes.Edit;
          setRowModesModel({ ...rowModesModel});
          setErrorMessages({...errorMessages});
          console.log('is this causing issue???')
          return newRow;
        }
      }
    };

    console.log('Process row update called', newRow);
    var isAdd = newRow.isNew === true
    console.log("updating...");

    const updatedRow = { ...newRow, isNew: false };
    console.log(rows);
    setRows((prevRows) => {
      const filteredRows = prevRows.filter((row) => row.id !== newRow.id);
      return [...filteredRows];
    });
    if (isAdd)
    {
      console.log('Add called')
      await onAddRow(updatedRow);
      console.log('should be called later');
      return updatedRow;

    }
    else {
      console.log('Edit called')
      await onSaveRow(updatedRow);
      console.log('should be called later');
      return updatedRow;
    }
  };

  const handleRowModesModelChange = React.useCallback((newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  }, []);

  const getRowId = (row) => {
    let rowId;
    if (!row) {
      alert('empty row');
    }
    if (row.isNew){
      rowId = row.id;
    }
    else {
      rowId = row[uniqueIdentityColumn] || '001';
    }
    console.log(rowId);

    if (!rowId) {
      console.log('rowid has error')
    }
    return rowId;
  };

  const actionColToRender = isAddAllowed || isEditAllowed || isDeleteAllowed || isGenericActionAllowed ? [actionColumn] : null;
  var columnsCopy = [...columns]
  var columnsConfig = columnsCopy.map(col => ({ ...col,
      preProcessEditCellProps: (params) => {
        const editPred = (s) => (operationMode === 'edit' && !s.editCondition.includes('edit'));
        const addPred = (s) => (operationMode === 'add' && !s.editCondition.includes('add'));
        var nonEditableColumns = columns.filter(s => operationMode === 'add' ? addPred(s) : editPred(s));
        var otherFieldProps = {
          ...params.otherFieldsProps,
          ...nonEditableColumns.reduce((acc, item) => {
              acc[item.field] = {
                  value: "",         // Set value as empty
                  error: false,
                  isProcessingProps: false
              };
              return acc;
          }, {})
        };      

        var editingColumn = columns.find(el => !otherFieldProps[el.field]);
        if (editingColumn && editingColumn.field) {
          const {value} = params.props
          const validateRule = validationRules[editingColumn.field];
          if (validateRule && validateRule.isValid) {
            var isValid = validateRule.isValid(value);
            if (!isValid) {
              var error = validateRule.error;
              console.log(editingColumn.field, error);
              errorMessages[editingColumn.field] = error;
              setErrorMessages({...errorMessages});
              return { ...params.props, error: true, helpertext: error };
            } else {
              delete errorMessages[editingColumn.field];
              setErrorMessages({...errorMessages});
            }
          }
        }

        return {...params.props, error: false };
      }
   }));

  console.log(actionColToRender);
  const columnsWithActions = actionColToRender && actionColToRender.length ? [...columnsConfig,
  ...actionColToRender
  ] : columnsConfig;

  const getCellClassName = (params) => {
    const { id, field } = params;
    if (id === '001' && errorMessages[field]) {
        return 'error-cell'; // Apply error class
    }
    return '';
  };

  const addRecordProps = isAddAllowed ? {
    slots: {
      toolbar: EditToolbar,
      noRowsOverlay: CustomNoRowsOverlay
    },
    slotProps: {
      toolbar: { addRecordBtnText, setRows, setRowModesModel, dummyAddRow, rows, onModeChange },
    }
  } : null;

  const ErrorMessageBox = ({errors}) => {
    if (!Object.keys(errorMessages).length > 0) {
      return;
    }
    return (
        <div className="container">
            <div className="card red lighten-5">
                <div className="card-content p-10">
                    <span className="black-text"><strong>Error Messages</strong></span>
                    <ul className="left-align">
                        {Object.entries(errorMessages).map(([field, message]) => (
                            <li key={field} className="collection-item red-text p-b-2">
                                <strong>{field.toUpperCase()}:</strong> {message}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
  };

  const handleProcessRowUpdateError = React.useCallback((error, row) => {
    console.error('Error updating row:', error, row);
    alert('An error occurred while updating the row. Please try again.');
    onModeChange('view');
  }, []);

  const isCellEditable = (params) => {
    if (params.row && !params.row.isNew && !params.colDef.editCondition.includes('edit')) {
      return false;
    }

    return true;
  };

  const handleRowSelection = (selectionModel) => {
    console.log(selectionModel); // rowId
    onRowClick(rows.find(r => selectionModel.includes(r[uniqueIdentityColumn])));
    setSelectedRowId(selectionModel[0] || null);
  };

  const hideConfig =columnsConfig.reduce((accumulator, col) => {
    accumulator[col.field] = !!col.visible; // Set the user object at the key of user id
    return accumulator;
  }, {});
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState(hideConfig);

  console.log(rows);
  return (
    <div className='center'>
      <Box
        sx={{
          height: {height},
          width: {width},
          backgroundColor: 'lightgoldenrodyellow',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          sx={customStyles}
          rows={rows || []}
          columns={columnsWithActions}
          editMode="row"
          getRowId={getRowId}
          rowModesModel={rowModesModel}
          isCellEditable={isCellEditable}
          onCellEditStart={handleCellEditStart}
          onCellEditStop={handleCellEditStop}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          {...addRecordProps}
          getCellClassName={getCellClassName}
          getRowClassName={(params) =>
            params.id === selectedRowId
              ? 'selectedRow'
              : params.id === editingRowId
              ? 'editingRow'
              : ''
          }
          onProcessRowUpdateError={handleProcessRowUpdateError}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          selectionModel={selectionModel}
          onSelectionModelChange={(newSelection) => {
            setSelectionModel(newSelection);
          }}
          onRowSelectionModelChange={(newSelectionModel) => handleRowSelection(newSelectionModel)}
        />
        <ErrorMessageBox errors={errorMessages}/>
      </Box>
    </div>
  );
}
