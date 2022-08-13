import { createSlice } from '@reduxjs/toolkit';
import omit from 'lodash/omit';
import { dbAddCard, dbCreateColumn, dbDeleteCard, dbDeleteColumn, dbGetBoard, dbPersistCard, dbUpdateColumn, dbUpdateColumnOrder } from '../../indexdb/db';
import { dispatch } from '../store';

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: null,
  board: {
    cards: {},
    columns: {},
    columnOrder: [],
  },
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET BOARD
    getBoardSuccess(state, action) {
      state.isLoading = false;
      const board = action.payload;
      const cards = objFromArray(board.cards);
      const columns = objFromArray(board.columns);
      const { columnOrder } = board;
      state.board = {
        cards,
        columns,
        columnOrder,
      };
    },

    // CREATE NEW COLUMN
    createColumnSuccess(state, action) {
      const newColumn = action.payload;
      state.isLoading = false;
      state.board.columns = {
        ...state.board.columns,
        [newColumn.id]: newColumn,
      };
      state.board.columnOrder.push(newColumn.id);
    },

    persistCard(state, action) {
      const columns = action.payload;
      state.board.columns = columns;
    },

    persistColumn(state, action) {
      state.board.columnOrder = action.payload;
    },

    addTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.cards[card.id] = card;
      state.board.columns[columnId].cardIds.push(card.id);
    },

    deleteTask(state, action) {
      const { cardId, columnId } = action.payload;

      state.board.columns[columnId].cardIds = state.board.columns[columnId].cardIds.filter((id) => id !== cardId);
      state.board.cards = omit(state.board.cards, [cardId]);
    },

    // UPDATE COLUMN
    updateColumnSuccess(state, action) {
      const column = action.payload;

      state.isLoading = false;
      state.board.columns[column.id] = column;
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      const { columnId } = action.payload;
      const deletedColumn = state.board.columns[columnId];

      state.isLoading = false;
      state.board.columns = omit(state.board.columns, [columnId]);
      state.board.cards = omit(state.board.cards, [...deletedColumn.cardIds]);
      state.board.columnOrder = state.board.columnOrder.filter((c) => c !== columnId);
    },
  },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

export function getBoard() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await dbGetBoard()
      console.log(response.board)
      dispatch(slice.actions.getBoardSuccess(response.board));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createColumn(newColumn) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await dbCreateColumn(newColumn)
      console.log("respose=", response)
      dispatch(slice.actions.createColumnSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateColumn(columnId, updateColumn) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await dbUpdateColumn(columnId, updateColumn)
      dispatch(slice.actions.updateColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteColumn(columnId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await dbDeleteColumn(columnId)
      dispatch(slice.actions.deleteColumnSuccess({ columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function persistColumn(newColumnOrder) {
  return async () => {
    try {
      await dbUpdateColumnOrder(newColumnOrder)
      dispatch(slice.actions.persistColumn(newColumnOrder));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function persistCard(columns) {
  return async () => {
    try {
      await dbPersistCard(columns)
      dispatch(slice.actions.persistCard(columns));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function addTask({ card, columnId }) {
  return async () => {
    try {
      console.log(card, columnId)
      await dbAddCard(card, columnId)
      dispatch(slice.actions.addTask({ card, columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteTask({ cardId, columnId }) {
  return async () => {
    try {
      await dbDeleteCard(cardId, columnId)
      dispatch(slice.actions.deleteTask({ cardId, columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
