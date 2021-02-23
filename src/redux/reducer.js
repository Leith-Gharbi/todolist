import { ADD_TODO, DELETE_TODO, UPDATE_TODO ,UPDATE_TODO_STATE} from './actions';

import { todo } from './states';

export let reducer = (state = todo, action) => {
    let newTodos;
  switch (action.type) {
    case ADD_TODO:
       newTodos = [...state];
      newTodos.push(action.payload);
      return newTodos;
    case DELETE_TODO:
       newTodos = [...state];
      newTodos = newTodos.filter((todo) => todo.id != action.payload);
      return newTodos;

      case UPDATE_TODO_STATE:
        // newTodos = [...state];
        // //newTodos = newTodos.filter((todo) => todo.id != action.payload);
        // newTodos = newTodos.map(x => x.id==action.payload ? x.done=!x.done:x.done);
        // return newTodos;

        newTodos = [...state];
        let indexx = -1;
        for( let i =0 ;i<newTodos.length ; i++){
            if(newTodos[i].id == action.payload){
              indexx=i;
                break;
            }
           
        }

        if (indexx != -1){
          const newValue=newTodos[indexx];
          newValue.done=!newValue.done;
         newTodos[indexx] =newValue;
         return newTodos;
 
        }
        else
        return newTodos;



    case UPDATE_TODO:
        newTodos = [...state];
       let index = -1;
       for( let i =0 ;i<newTodos.length ; i++){
        index++;
           if(newTodos[i].id == action.payload.id){
               break;
           }
          
       }
       
       if (index != -1){
        newTodos[index] =action.payload
        return newTodos;

       }
      break;

    default:
      return state;
  }
};
