import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import TodoItem from './TodoItem';

const TodoList = () => {
    const todos =useSelector(state => state);
    return ( 
    <div className="my-4">
   {todos.map(todo => {
       return <TodoItem key={todo.id} todo={todo}/>
   })}
    </div> );
}
 
export default TodoList;