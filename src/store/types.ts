import { store } from './index';

// ReturnType extracts the return type from the function
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch is used when dispatching actions
export type AppDispatch = typeof store.dispatch;

// Thunk types for async actions
export type AppThunk<ReturnType = void> = (
    dispatch: AppDispatch,
    getState: () => RootState
) => ReturnType;