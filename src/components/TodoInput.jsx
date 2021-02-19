import React, { useState } from 'react';
import { addTodo } from '../redux/actions';
import { v1 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';

const TodoInput = () => {
  let [name, setName] = useState();
  let  dispatch = useDispatch();
  return (
    <>
      <div className="row m-2">
        <input
          type="text"
          className="col form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() =>{
           dispatch(addTodo({
            id: uuid(),
            name: name,
          })) ;
            setName('');
          }}
          className="btn btn-primary mx-2"
        >
          Add
        </button>
      </div>
    </>
  );
};

export default TodoInput;
