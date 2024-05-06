import logger from 'redux-logger'
import {thunk} from 'redux-thunk';
import reducers from './state/reducers'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { configureStore , Tuple } from "@reduxjs/toolkit";


const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['tracking']
} 

const persistedReducer = persistReducer(persistConfig, reducers)


export const store  = configureStore({
  reducer:persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: () => new Tuple( thunk),
})

window.addEventListener("unload",()=>{
    store.dispatch({type:"CLEARSTORE"})
  })
export const persistor = persistStore(store);