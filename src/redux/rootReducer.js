import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices

import kanbanReducer from './slices/kanban';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  kanban: kanbanReducer,
});

export { rootPersistConfig, rootReducer };
