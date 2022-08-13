import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Paper, OutlinedInput, ClickAwayListener } from '@mui/material';

// ----------------------------------------------------------------------

const defaultTask = {};

KanbanTaskAdd.propTypes = {
  onAddTask: PropTypes.func,
  onCloseAddTask: PropTypes.func,
};

export default function KanbanTaskAdd({ onAddTask, onCloseAddTask }) {
  const [name, setName] = useState('');

  const handleKeyUpAddTask = (event) => {
    if (event.key === 'Enter') {
      if (name.trim() !== '') {
        onAddTask({ ...defaultTask, name });
      }
    }
  };

  const handleClickAddTask = () => {
    if (name) {
      onAddTask({ ...defaultTask, name });
    }
    onCloseAddTask();
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAddTask}>
        <Paper variant="outlined" sx={{ p: 1 }}>
          <OutlinedInput
            multiline
            size="small"
            placeholder="Task name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyUp={handleKeyUpAddTask}
            sx={{
              '& input': { p: 0 },
              '& fieldset': { borderColor: 'transparent !important' },
            }}
          />
        </Paper>
      </ClickAwayListener>
    </>
  );
}
