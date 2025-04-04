"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  SxProps,
  Theme,
} from "@mui/material";
import { JSX } from "react";

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
  return (
    <Box sx={styles.wrapper}>
      <Typography variant="h6" sx={styles.title} textAlign={"center"}>
        {title}
      </Typography>
      <List sx={styles.list}>
        {items.map((item) => (
          <ListItem
            key={getKey(item)}
            sx={{
              ...styles.listItem,
            }}
          >
            <ListItemText primary={getLabel(item)} sx={{ paddingRight: 2 }} />
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
