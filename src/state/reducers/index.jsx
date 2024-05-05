import { combineReducers } from "redux";
import { getUserReducer } from "./DashboardReducers";

const appReducers = combineReducers({



   
    getUser: getUserReducer,
   

})

const reducers = (state, action) => {
    if (action.type === "CLEARSTORE") {
        state = undefined
    }
    return appReducers(state, action)
}

export default reducers;