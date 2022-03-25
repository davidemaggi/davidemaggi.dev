import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface i18nState {
  current: string
}

// Define the initial state using that type
const initialState: i18nState = {
  current:"it",
}




// Other code such as selectors can use the imported `RootState` type
export const getCurrentLang = (state: RootState) => state.i18n.current



const changeLanguageImpl=(state = initialState, action:PayloadAction<string>) =>{
    // The reducer normally looks at the action type field to decide what happens
    state.current=action.payload
    
}

    export const i18nSlice = createSlice({
        name: 'i18n',
        // `createSlice` will infer the state type from the `initialState` argument
        initialState,
        reducers: {
            changeLanguage:changeLanguageImpl,
          
        },
      })

export const { changeLanguage } = i18nSlice.actions


export default i18nSlice.reducer