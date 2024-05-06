import axios from "axios";

///////////////////////////////////////////////////////

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");


export const getUserData = (page) => {
    let limit =10
    return (dispatch) => {
      dispatch({
        type: "getUser-api-request",
      });
  
      const offset = (page - 1) * limit; // Calculate the offset based on page number and limit
  
      const body = JSON.stringify({
        "limit": limit,
        "offset": offset
      });
  
      const url = `https://api.weekday.technology/adhoc/getSampleJdJSON`;
  
      axios.post(url, body, myHeaders)
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
          });
        })
    }
  };
  
  