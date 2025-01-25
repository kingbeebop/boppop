import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Skeleton,
  useTheme,
  Paper,
  Grow,
} from '@mui/material';
import { SxProps } from '@mui/system';

export interface SelectableItem {
  id: number | string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  data?: any;
}

interface SelectableListProps {
  items: SelectableItem[];
  onSelect: (item: SelectableItem) => void;
  selectedId?: number | string;
  isLoading?: boolean;
  emptyMessage?: string;
  showAvatar?: boolean;
  sx?: SxProps;
}

const SelectableList: React.FC<SelectableListProps> = ({
  items,
  onSelect,
  selectedId,
  isLoading = false,
  emptyMessage = 'No items found',
  showAvatar = false,
  sx = {},
}) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Paper elevation={0} sx={{ ...sx }}>
        <List>
          {[1, 2, 3].map((i) => (
            <ListItem key={i} disablePadding>
              <ListItemButton disabled>
                {showAvatar && (
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={<Skeleton width="70%" />}
                  secondary={<Skeleton width="40%" />}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }

  if (!items.length) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          color: 'text.secondary',
          ...sx,
        }}
      >
        <Typography variant="body1">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ ...sx }}>
      <List>
        {items.map((item, index) => (
          <Grow
            key={item.id}
            in
            timeout={300 + index * 100}
            style={{ transformOrigin: '0 0 0' }}
          >
            <ListItem
              disablePadding
              sx={{
                mb: 1,
                overflow: 'hidden',
                borderRadius: 1,
              }}
            >
              <ListItemButton
                onClick={() => onSelect(item)}
                selected={selectedId === item.id}
                sx={{
                  borderRadius: 1,
                  transition: theme.transitions.create(
                    ['background-color', 'transform'],
                    { duration: 200 }
                  ),
                  '&:hover': {
                    transform: 'translateX(8px)',
                    bgcolor: `${theme.palette.primary.main}14`,
                  },
                  '&.Mui-selected': {
                    bgcolor: `${theme.palette.primary.main}29`,
                    '&:hover': {
                      bgcolor: `${theme.palette.primary.main}38`,
                    },
                  },
                }}
              >
                {showAvatar && (
                  <ListItemAvatar>
                    <Avatar
                      src={item.imageUrl || undefined}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {item.title[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: selectedId === item.id ? 600 : 400,
                      }}
                    >
                      {item.title}
                    </Typography>
                  }
                  secondary={item.subtitle}
                />
              </ListItemButton>
            </ListItem>
          </Grow>
        ))}
      </List>
    </Paper>
  );
};

export default SelectableList;
