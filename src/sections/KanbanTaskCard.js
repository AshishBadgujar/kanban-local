import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
// @mui
import { Paper, Typography, Box } from '@mui/material';
// components
// ----------------------------------------------------------------------

KanbanTaskCard.propTypes = {
  card: PropTypes.object,
  index: PropTypes.number,
  onDeleteTask: PropTypes.func,
};

export default function KanbanTaskCard({ card, index }) {
  const { name } = card;

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Paper
            sx={{
              px: 2,
              width: 1,
              position: 'relative',
              boxShadow: (theme) => theme.customShadows.z1,
              '&:hover': {
                boxShadow: (theme) => theme.customShadows.z16,
              },
            }}
          >
            <Box sx={{ cursor: 'pointer' }}>
              <Typography
                noWrap
                variant="subtitle2"
                sx={{
                  py: 2,
                  transition: (theme) =>
                    theme.transitions.create('opacity', {
                      duration: theme.transitions.duration.shortest,
                    })
                }}
              >
                {name}
              </Typography>
            </Box>
          </Paper>
        </div>
      )}
    </Draggable>
  );
}
