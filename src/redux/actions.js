const ADD_TODO ="ADD_TODO";
const DELETE_TODO="DELETE_TODO";

const UPDATE_TODO="UPDATE_TODO";

export function addTodo(todo){
    return{
        type:ADD_TODO,
        payload:todo,
    }

}

export function deleteTodo(todoId){
    return{
        type:DELETE_TODO,
        payload:todoId,
    }

}


export function updateTodo(todoId){
    return{
        type:UPDATE_TODO,
        payload:todoId,
    }

}
