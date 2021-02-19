import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import { todo } from '../redux/states';
import TodoItem from './TodoItem';

const TodoList = () => {
    const todos =useSelector(state => state);
    return ( 
    <div className="my-4">
   {todo.map(todo => {
       return <TodoItem key={todo.id}/>
   })}
    </div> );
}
 
export default TodoList;