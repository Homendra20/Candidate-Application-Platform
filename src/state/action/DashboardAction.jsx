import axios from "axios";

///////////////////////////////////////////////////////

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");


export const getUserData = () => {

    return (dispatch) => {
      dispatch({
        type: "getUser-api-request",
  
  
      });

      const body = JSON.stringify({
        "limit": 10,
        "offset": 0
       });
       

      const url = `https://api.weekday.technology/adhoc/getSampleJdJSON`;
    
      axios.post(url, body , myHeaders)
        .then((response) => {
  
          dispatch({
            type: "getUser-api-success",
            payload: response.data
          });
  
  
        })
        .catch((error) => {
          dispatch({
            type: "getUser-api-fail",
            payload: error,
          });
  
        }).finally(() => {
          dispatch({
            type: "getUser-api-reset",
            // payload: error,
          });
        })
  
    }
  
  };
  