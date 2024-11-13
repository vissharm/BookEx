import React, { useState, useEffect, Fragment } from 'react';
import OwnerOrdersColumnConfig from "../components/grid-columns-configs/ordered-books-columns-config.js";
import GridComponent from '../components/GridComponent.jsx'
import ProgressStages from '../components/ProgressStages.jsx'
import formatDateToDatetimeLocal from './utility/helper.js'
import Loader from "../components/Loader.jsx"

const OrdersCreated = (props) => {
  const [userOrderedBooks, setUserOrderedBooks] = useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [stages, setStages] = React.useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    getOrderedBooks();
    console.log('use effect', props)
  }, []);

  const isNotNullOrEmpty = (str) => {
    return str !== null && str !== undefined && str !== '';
  }

  const getOrderedBooks = (callStageLogic = false, row) => {
    setIsLoading(true);
    setLoadingText('Processing');
    fetch(`/api/orders/${props.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('-----------------', data)
        setUserOrderedBooks(data);
        if (callStageLogic) {
          var dataObj = data.find(book => book.users_books_id === row.users_books_id);
          if (dataObj) {
            const {
              requester = '',
              request_approved = false,
              request_approved_date = '',
              request_date = '',
              requester_comment  = '', 
              owner_comment  = '',
              user_received_status  = false,
              user_received_date  = '',
              user_ship_status  = false,
              user_ship_date  = '',
              requester_ship_date  = '',
              requester_ship_status  = false,
              requester_received_status  = false,
              requester_received_date  = ''
            } = dataObj
      
            const updatedStages = [
              {
                id: 1,
                completed: isNotNullOrEmpty(request_date),
                label: 'Order placed',
                date: formatDateToDatetimeLocal(request_date),
                userAssignable: true,
                controls: [],
              },
              {
                id: 2,
                completed: request_approved && isNotNullOrEmpty(request_approved_date),
                label: 'Approval',
                date: formatDateToDatetimeLocal(request_approved_date),
                userAssignable: false,
                controls: [
                  { type: 'date', label: 'Arpproval date', name: 'request_approved_date', value: formatDateToDatetimeLocal(request_approved_date) || formatDateToDatetimeLocal(new Date().toISOString()), requiredField: true, readonly: true},
                  { type: 'checkbox', label: 'Approve order', name: 'request_approved', value: request_approved, requiredField: false },
                  { type: 'text', label: 'Comment', name: 'owner_comment', value: '', requiredField: false, hideIfCompleted: true },
                ],
                note: 'To disapprove request, save the form with checkbox unselected.',
                status: !request_approved && isNotNullOrEmpty(request_approved_date) ? 'Denied' : ''
              },
              {
                id: 3,
                completed: user_ship_status && user_ship_date,
                label: 'Owner shipped?',
                date: formatDateToDatetimeLocal(user_ship_date),
                userAssignable: false,
                controls: [
                  { type: 'date', label: 'Shipment date', name: 'user_ship_date', value: formatDateToDatetimeLocal(user_ship_date) || formatDateToDatetimeLocal(new Date().toISOString()), requiredField: true},
                  { type: 'checkbox', label: 'Book sent', name: 'user_ship_status', value: user_ship_status, requiredField: true },
                  { type: 'text', label: 'Comment', name: 'owner_comment', value: '', requiredField: false, hideIfCompleted: true },
                ]
              },
              {
                id: 4,
                completed: requester_received_status && requester_received_date,
                label: 'User collected?',
                date: formatDateToDatetimeLocal(requester_received_date),
                userAssignable: true,
                controls: [
                  { type: 'date', label: 'Shipment collection date', name: 'requester_received_date', value: formatDateToDatetimeLocal(requester_received_date), requiredField: true  },
                  { type: 'checkbox', label: 'Book received', name: 'requester_received_status', value: requester_received_status, requiredField: true },
                  { type: 'text', label: 'Comment', name: 'requester_comment', value: '', requiredField: false, hideIfCompleted: true },
                ]
              },
              {
                id: 5,
                completed: requester_ship_date && requester_ship_status,
                label: 'User dispatched (return)?',
                date: formatDateToDatetimeLocal(requester_ship_date),
                userAssignable: true,
                controls: [
                  { type: 'date', label: 'Book return shipment date', name: 'requester_ship_date', value: formatDateToDatetimeLocal(requester_ship_date), requiredField: true },
                  { type: 'checkbox', label: 'Book returned', name: 'requester_ship_status', value: requester_ship_status, requiredField: true },
                  { type: 'text', label: 'Comment', name: 'requester_comment', value: '', requiredField: false, hideIfCompleted: true },
                ]
              },
              {
                id: 6,
                completed: user_received_date && user_received_status,
                label: 'Owner collected?',
                date: formatDateToDatetimeLocal(user_received_date),
                userAssignable: false, // Indicates this stage is for another user
                controls: [
                  { type: 'date', label: 'Book received date', name: 'user_received_date', value: formatDateToDatetimeLocal(user_received_date), requiredField: true },
                  { type: 'checkbox', label: 'Return completed', name: 'user_received_status', value: user_received_status, requiredField: true },
                  { type: 'text', label: 'Comment', name: 'owner_comment', value: '', requiredField: false, hideIfCompleted: true },
                ]
              },
            ];
            setStages(updatedStages);
          }
        }
        console.log('get user books', data)
        setIsLoading(false);
        setLoadingText('');
      })
      .catch((err) => {
        setIsLoading(true);
        setLoadingText('');
      })
  };

  const validationRules = {};

  const cancelOrder = (id, row) => {
    setIsLoading(true);
    setLoadingText('Processing');
    return fetch(`/api/books/user/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        users_books_id: id,
        bookisbn: row.isbn,
        requester: null,
        request_approved: null,
        request_approved_date: null,
        request_date: null,
        requester_comment : '', 
        owner_comment : '',
        user_received_status : null,
        user_received_date : null,
        user_ship_status : null,
        user_ship_date : null,
        requester_ship_date : null,
        requester_ship_status : null,
        requester_received_status : null,
        requester_received_date : null,
        cancelRequest: true
      })
    })
      .then(response => response.json())
      .then((data) => {
        setTimeout(() => {}, 1000);
        getOrderedBooks(true, data);
        setIsLoading(false);
        setLoadingText('');
      })
      .catch(error => {
        console.error('Error with update request:', error);
        alert('Some error happened. Please try again later.');
        setIsLoading(false);
        setLoadingText('');
      });
  };

  const handleRowSelection = (row) => {
    console.log(row);
    setSelectedRow(row);
    getOrderedBooks(true, row);
  };

  const UpdateOrderWorkflow = (stage, modalData) => {
    console.log(stage, modalData)
    const {isbn, users_books_id, user_id} = selectedRow;
    const updatedAttributes = stage.controls.reduce((acc, control) => {
      acc[control.name] = control.value;
      return acc;
    }, {});

    setIsLoading(true);
    setLoadingText('Processing');
    return fetch(`/api/books/user/${users_books_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        isbn,
        bookisbn: isbn,
        users_books_id,
        bookisbn: isbn,
        ...updatedAttributes,
        cancelRequest: false
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        setSelectedRow(data);
        getOrderedBooks(true, data);

        setIsLoading(false);
        setLoadingText('');

        setTimeout(() => {}, 1000); 
        const rowToClick = $(`[data-id='${users_books_id}']`);
        if (rowToClick.length) {
          rowToClick.click();
        }
      })
      .catch(error => {
        console.error('Error with update request:', error);
        alert('Some error happened. Please try again later.');
        setIsLoading(false);
        setLoadingText('');
      });
  };

  console.log('render', props)
  return (
    <div>
      <h5 className="profile-title" style={{marginBottom: '60px', display: 'grid', justifyContent: 'center'}}>Books Requests (Raised)</h5>
      {stages?.length && (<ProgressStages stages={stages} onSave={UpdateOrderWorkflow}/>)}
      <div className="result-box" style={{marginTop: '10px'}}>
          {isLoading && (
            <div className="loader-overlay">
              <Loader text={loadingText} />
            </div>
          )}
          <GridComponent
            addRecordBtnText='Add book'
            columns={OwnerOrdersColumnConfig}
            data={userOrderedBooks}
            genericActionLabel='Cancel Order'
            height={500}
            uniqueIdentityColumn='users_books_id'
            isAddAllowed={false}
            isDeleteAllowed={false}
            isEditAllowed={false}
            isGenericActionAllowed={true}
            isGenericActionDisabled={stages && stages[2]?.completed}
            width='80%'
            onGenericAction={(id, row) => {cancelOrder(id, row)}}
            validationRules={validationRules}
            onRowClick={handleRowSelection}
          />
      </div>
      {selectedRow?.owner_comment || selectedRow?.requester_comment ? (
        <Fragment>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '30px', // Parent container height
            width: '70%', 
            margin: '0 auto', 
            paddingLeft: '15px',
            color: 'black',
            fontWeight: '900',
            fontFamily: 'sans-serif',
            marginTop: '15px'
          }}>
            <label
              style={{
                flex: 1,
                color: 'black',
                fontSize: '15px'
              }}
              readOnly
            >Requester comments</label>
            <label
              style={{
                flex: 1,
                color: 'black',
                fontSize: '15px'
              }}
              readOnly
            >Book Owner comments</label>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '300px',
            width: '70%', 
            margin: '0 auto', 
            overflow: 'hidden',
          }}>
            <textarea
              style={{
                flex: 1,
                height: '80px',
                margin: '0 10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                resize: 'vertical',
                minHeight: 'calc(300px - 16px)',
                maxHeight: 'calc(300px - 16px)',
                overflow: 'auto',
                background: 'lightblue',
                color: 'darkred',
                fontFamily: 'monospace'
              }}
              placeholder="Sender Comments"
              readOnly
              value={selectedRow?.requester_comment || ''}
            />
            <textarea
              style={{
                flex: 1,
                height: '80px',
                margin: '0 10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                resize: 'vertical',
                minHeight: 'calc(300px - 16px)',
                maxHeight: 'calc(300px - 16px)',
                overflow: 'auto',
                background: 'lightblue',
                color: 'darkred',
                fontFamily: 'monospace'
              }}
              placeholder="Receiver Comments"
              readOnly
              value={selectedRow?.owner_comment || ''}
            />
          </div>
        </Fragment>
      ) : null}
    </div>
  );
};

export default OrdersCreated;