import React, { useRef, useState, useEffect } from 'react';
import OrderedBookGridColumns from "../components/grid-columns-configs/available-books-columns-configs.js";
import GridComponent from '../components/GridComponent.jsx'
import SearchComponent from '../components/SearchComponent.jsx';
import ModalForm from '../components/ModalForm.jsx';

const OrderBook = (props) => {
  const [availableOrderBooks, setAvailableOrderBooks] = useState([]);
  const [userOrderedBooks, setUserOrderedBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const dataMapRef = useRef(new Map());
  const [formData, setFormData] = useState({
    request_days: '',
    requester_comment: '',
    request_type: '',
  });

  useEffect(() => {
    getUserBooks();
    console.log('use effect', props)
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validate the text field to accept only numbers between 1 and 30
    if (name === "request_days") {
      const numberValue = parseInt(value, 10);
      if (numberValue >= 1 && numberValue <= 30) {
        setFormData({
          ...formData,
          [name]: value,
        });
      } else if (value === "") {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
      return;
    }
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCancel = () => {
    setFormData({
      request_days: '',
      request_type: '',
      requester_comment: ''
    });
    setIsModalOpen(false)
  };

  const isSaveDisabled = () => {
    const isDisabled = (!(formData.request_days >= '1' && formData.request_days <= '30') || !(formData.request_type === '0' || formData.request_type === '1'));
    return isDisabled;
  };

  const getUserBooks = () => {
    fetch(`/api/books/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        keyword: '',
        criteria: '',
        userId: props.userId
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('-----------------', data)
        dataMapRef.current = new Map();
        data.forEach((d, index) => {
          dataMapRef.current.set(d.users_books_id,  { displayId: index + 1, ...d });
        });
        setAvailableOrderBooks(Array.from(dataMapRef.current.values()));
        console.log('get user books', data)
        getOrderedBooks();
      })
      .catch(error => {
        console.error('Error with getting books data.', error);
        alert('Some error happened. Please try again later.');
      });
  };

  const getOrderedBooks = () => {
    fetch(`/api/orders/${props.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setUserOrderedBooks(data);
        console.log('get user books', data)
      });
  };

  const handleSave = () => {
    const {isbn, users_books_id, user_id} = selectedRow;

    return fetch(`/api/books/user/${users_books_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        bookisbn: isbn,
        isbn,
        users_books_id,
        bookisbn: isbn,
        request_date: new Date().toISOString(),
        requester: props.userId,
        ...formData
      })
    })
      .then(response => response.json())
      .then((data) => {
        const dataObj = {...selectedRow, ...data};
        console.log('updateook', dataObj)
        handleCancel();
        getUserBooks();
      })
      .catch(error => {
        console.error('Error with update request:', error);
        alert('Some error happened. Please try again later.');
        handleCancel();
        getUserBooks();
      });
  };

  const validationRules = {};

  const orderBook = (id) => {
    setIsModalOpen(true);
    console.log('order book api called', id);
  };

  const criteriaOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Author', value: 'author' },
    { label: 'Genre', value: 'genre' },
    { label: 'ISBN', value: 'isbn' },
  ];

  const handleSearch = (criteria, term) => {
    console.log(`Searching for "${term}" in ${criteria}`);
    return fetch('/api/books/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        keyword: term,
        criteria,
        userId: props.userId
      })
    })
      .then(response => response.json())
      .then((data) => {
        dataMapRef.current = new Map();
        data.forEach((d, index) => {
          dataMapRef.current.set(d.users_books_id,  { displayId: index + 1, ...d });
        });
        setAvailableOrderBooks(Array.from(dataMapRef.current.values()));
        console.log('get user books', data);
      })
      .catch(error => {
        console.error('Error with add request:', error);
      });
  };

  const handleRowSelection = (row) => {
    console.log(row);
    setSelectedRow(row);
  };

  console.log('render', props)
  return (
    <div>
      <SearchComponent
        criteriaOptions={criteriaOptions}
        onSearch={handleSearch}
        placeholder=""
      />
      <div className="result-box" style={{marginTop: '10px'}}
      >
          <GridComponent
            addRecordBtnText='Add book'
            columns={OrderedBookGridColumns}
            data={availableOrderBooks}
            genericActionLabel='Place order'
            height={700}
            uniqueIdentityColumn='users_books_id'
            isAddAllowed={false}
            isDeleteAllowed={false}
            isEditAllowed={false}
            isGenericActionAllowed={true}
            isGenericActionDisabled={userOrderedBooks && userOrderedBooks.length >= 5}
            width='70%'
            onGenericAction={(id) => {orderBook(id)}}
            validationRules={validationRules}
            onRowClick={handleRowSelection}
          />
      </div>
     <ModalForm
        isOpen={isModalOpen}
        onClose={handleCancel}
        onSave={handleSave}
        title="Order Book"
        saveText="Submit"
        cancelText="Close"
        isSaveDisabled={isSaveDisabled}
      >
        <div className='form-container'>
          <div className='field-wrapper form-group'>
            <label className='field-dropdown-label'>Request type:</label>
            <select
              className='field-control'
              name="request_type"
              value={formData.request_type}
              onChange={handleChange}
            >
              <option value="" disabled title='Either user could exchange book or order on rent'>Select an option</option>
              <option value="0" title='Owner will raise book for exhange'>Exhange book</option>
              <option value="1" title='Rent per day will be applicable'>Rent</option>
            </select>
          </div>
          <div className="form-group">
            <label>No of days:</label>
            <input
              type="number"
              name="request_days"
              value={formData.request_days}
              onChange={handleChange}
              placeholder="Enter days"
              min="1"
              max="30"
              title="Enter a number between 1 and 30"
            />
          </div>
          {formData.request_type === '1' && (
          <div className="form-group">
            <label>Total rent price:</label>
            <input
              disabled
              type="number"
              name="rentPrice"
              value={selectedRow ? selectedRow.rent_price * formData.request_days: ''}
              onChange={handleChange}
              placeholder="Enter days"
              min="1"
              max="30"
              title="Enter a number between 1 and 30"
              />
            </div>
          )}
          <div>
            <label>Comment:</label>
            <textarea
              name="requester_comment"
              value={formData.requester_comment}
              onChange={handleChange}
              placeholder="Enter comments for book owner"
              rows="4"
              cols="30"
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default OrderBook;