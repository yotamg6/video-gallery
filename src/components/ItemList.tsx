"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  SxProps,
  Theme,
} from "@mui/material";
import { JSX } from "react";

type RenderState = string | JSX.Element;

interface ItemListProps<T> {
  title: string;
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  getStateDisplay?: (item: T) => JSX.Element | "Failed" | undefined;
  styles?: {
    wrapper?: SxProps<Theme>;
    title?: SxProps<Theme>;
    list?: SxProps<Theme>;
    listItem?: SxProps<Theme>;
  };
}

const ItemList = <T,>({
  title,
  items,
  getKey,
  getLabel,
  getStateDisplay,
  styles = {},
}: ItemListProps<T>) => {
  if (!items.length) return null;

  return (
    <Box sx={styles.wrapper}>
      <Typography variant="h6" sx={styles.title}>
        {title}
      </Typography>
      <List sx={styles.list}>
        {items.map((item) => (
          <ListItem
            key={getKey(item)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 0,
              paddingRight: 0,
              ...styles.listItem,
            }}
          >
            <ListItemText primary={getLabel(item)} />
            {getStateDisplay && (
              <Box sx={{ minWidth: 100, textAlign: "right" }}>
                {getStateDisplay(item)}
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ItemList;
