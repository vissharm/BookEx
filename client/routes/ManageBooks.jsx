import React, { useRef, useState, useEffect } from 'react';
import AddedBookGridColumns, { emptyAddRow } from "../components/grid-columns-configs/added-book-columns-config.js";
import GridComponent from '../components/GridComponent.jsx'
import SearchComponent from '../components/SearchComponent.jsx';
import {showNotification} from './utility/helper.js'

const ManageBooks = (props) => {
  const [userOwnedBooks, setUserOwnedBooks] = useState([]);
  const dataMapRef = useRef(new Map());
  
  useEffect(() => {
    getUserBooks();
    console.log('use effect', props);

  }, []);

  const getUserBooks = () => {
    fetch(`/api/books/user/${props.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('-----------------', data)
        data.forEach((d, index) => {
          dataMapRef.current.set(d.users_books_id,  { displayId: index + 1, ...d });
        });
        setUserOwnedBooks(Array.from(dataMapRef.current.values()));
        console.log('get user books', data)
      });
  };

  const addBook = (book) => {
    const {author, genre, isbn, title, condition, rent_price} = book;
    return fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title,
        isbn,
        author,
        genre,
        condition,
        rent_price,
        user_id: props.userId
      })
    })
      .then(response => response.json())
      .then((data) => {
        if (data?.error) {
          showNotification(data?.error.detail);
        } else {
          const newDisplayId = dataMapRef.current.size + 1;
          dataMapRef.current.set(data.users_books_id, { displayId: newDisplayId, ...data });
          const updatedData = {...data, displayId: newDisplayId};
          setUserOwnedBooks(Array.from(dataMapRef.current.values()));
          return updatedData;
        }
      })
      .catch(error => {
        console.error('Error with add request:', error);
      });
  };

  const updateBook = (book) => {
    const {author, genre, isbn, title, condition, users_books_id, rent_price} = book;
    return fetch(`/api/books/${isbn}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title,
        isbn,
        author,
        genre,
        condition,
        rent_price,
        users_books_id
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log('updateook', data)
        const updatedData = {...data, displayId: book.displayId};
        dataMapRef.current.set(data.users_books_id, updatedData);
        setUserOwnedBooks(Array.from(dataMapRef.current.values()));
      })
      .catch(error => {
        console.error('Error with update request:', error);
      });
  };

  const validationRules = {
    title: { 
      isValid: (value) => value.length > 0 && value.length < 200,
      error: 'Required field.',
    },
    isbn: {
      isValid: (value) => value.length > 0 && (value.length === 10 || value.length === 13) && /^\d+$/.test(value),
      error: 'Value must be numeric and 10 or 13 characters long.',
    },
    author: {
      isValid: (value) => value.length > 0 && value.length < 200,
      error: 'Required field.',
    },
    genre: {
      isValid: (value) => value.length > 0 && value.length < 200,
      error: 'Required field.',
    },
    condition: {
      isValid: (value) => value.length > 0 && value.length < 200,
      error: 'Required field.',
    },
    rent_price: {
      isValid: (value) => value.length > 0 && /^\d+$/.test(value),
      error: 'Required numeric field.',
    }
  };

  const deleteBook = (id) => {
    fetch(`/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        dataMapRef.current.delete(id);
      });
    console.log('delete book api called', id);
  };

  const criteriaOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Author', value: 'author' },
    { label: 'Genre', value: 'genre' },
    { label: 'ISBN', value: 'isbn' },
  ];

  const handleSearch = (criteria, term) => {
    console.log(`Searching for "${term}" in ${criteria}`);
    return fetch('/api/books/search/user', {
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
        console.log('-----------------', data)
        dataMapRef.current = new Map();
        data.forEach((d, index) => {
          dataMapRef.current.set(d.users_books_id,  { displayId: index + 1, ...d });
        });
        setUserOwnedBooks(Array.from(dataMapRef.current.values()));
        console.log('get user books', data);
      })
      .catch(error => {
        console.error('Error with add request:', error);
      });
  };

  return (
    <div>
      <SearchComponent
        criteriaOptions={criteriaOptions}
        onSearch={handleSearch}
        placeholder="" // Custom placeholder text
      />
      <div className="result-box">
          <GridComponent
            addRecordBtnText='Add book'
            columns={AddedBookGridColumns}
            data={userOwnedBooks}
            dummyAddRow={emptyAddRow}
            height={700}
            uniqueIdentityColumn='users_books_id'
            isAddAllowed={true}
            isDeleteAllowed={true}
            isEditAllowed={true}
            width='70%'

            onAddRow={addBook}
            onSaveRow={updateBook}
            onDeleteRow={deleteBook}
            validationRules={validationRules}
          />
      </div>
    </div>
  );
};

export default ManageBooks;
