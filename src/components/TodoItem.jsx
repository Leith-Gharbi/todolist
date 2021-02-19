import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTodo } from '../redux/actions';

const TodoItem = (todo) => {
    let dispatch = useDispatch();

    return ( <>
    <div className="row mx-2 align-items-center">
        {console.log(todo)}
        {console.log(todo.todo.id)}
        <div>#{todo.todo.id.length>1 ? todo.todo.id[2] : todo.todo.id }</div>
        <div className="col"><h4>{todo.todo.name}</h4></div>
        <button 
        className="btn btn-primary m-2">
            Edit</button>
        <button onClick={()=>dispatch(deleteTodo(todo.todo.id))} className="btn btn-danger m-2">
            Delete</button>
    </div>
    </> );
}
 
export default TodoItem;