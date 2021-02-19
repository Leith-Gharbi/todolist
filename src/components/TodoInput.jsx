import React from 'react';

const TodoInput = () => {
  return (
    <>
      <h3>TodoInput</h3>
      <div className="row m-2">
        <input type="text" className="col form-control" />
        <button className="btn btn-primary mx-2">Add</button>
      </div>
    </>
  );
};

export default TodoInput;
