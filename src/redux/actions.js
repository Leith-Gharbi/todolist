export const ADD_TODO ="ADD_TODO";
export const DELETE_TODO="DELETE_TODO";
export const UPDATE_TODO="UPDATE_TODO";
export const UPDATE_TODO_STATE="UPDATE_TODO_STATE";

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
export function updateTodo_state(todoId){
    return{
        type:UPDATE_TODO_STATE,
        payload:todoId,
    }}