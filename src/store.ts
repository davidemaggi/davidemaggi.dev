import { configureStore } from '@reduxjs/toolkit'
import {i18nSlice} from './Slices/i18nSlice'

export const store = configureStore({
  reducer: {
    i18n: i18nSlice.reducer,
   
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch