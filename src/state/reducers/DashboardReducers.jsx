
      ///////////getusers////////////////
      export const getUserReducer = (state = {}, action) => {
        switch (action.type) {
          case "getUser-api-request":
            return { loading: true }
          case "getUser-api-success":
            return { loading: false, response: action.payload }
          case "getUser-api-fail":
            return { loading: false, error: action.payload }
    
        
          default: 
            return state;
        }
      };