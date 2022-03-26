import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface ConfigState {
  language: string
}

// Define the initial state using that type
const initialState: ConfigState = {
  language:"it",
}




// Other code such as selectors can use the imported `RootState` type
export const getCurrentLang = (state: RootState) => state.config.language



const changeLanguageImpl=(state = initialState, action:PayloadAction<string>) =>{
    // The reducer normally looks at the action type field to decide what happens
    state.language=action.payload
    
}

    export const configSlice = createSlice({
        name: 'config',
        // `createSlice` will infer the state type from the `initialState` argument
        initialState,
        reducers: {
            changeLanguage:changeLanguageImpl,
          
        },
      })

export const { changeLanguage } = configSlice.actions


export default configSlice.reducer