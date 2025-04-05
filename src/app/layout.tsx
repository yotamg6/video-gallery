"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import Image from "next/image";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styles from "../styles/sidebar.module.css";
import { Oswald } from "next/font/google";
import { usePathname } from "next/navigation";

interface RootLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

const oswald = Oswald({
  subsets: ["latin"],
  weight: "700",
});

const queryClient = new QueryClient();

const RootLayout = ({ children }: RootLayoutProps) => {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Box
            sx={{
              display: "flex",
              minHeight: "100vh",
              position: "relative",
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('cameras.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: -1,
              }}
            />
            <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  boxSizing: "border-box",
                  backgroundColor: "#e0f2f1",
                },
              }}
            >
              <Box paddingLeft={2}>
                <Image
                  style={{ marginTop: "-2.5rem" }}
                  src="https://cdn.prod.website-files.com/6080285e10b3ca5844aecb46/6336ac285bf8c2b52e74102d_logo%20tolstoy.svg"
                  alt="Tolstoy Logo"
                  width={150}
                  height={150}
                  priority
                />
              </Box>
              <List style={{ marginTop: "-2.5rem" }}>
                <ListItem
                  className={`${styles.sidebarItem} ${
                    pathname === "/" ? styles.activeSidebarItem : ""
                  }`}
                  component={Link}
                  href="/"
                >
                  <ListItemText
                    slotProps={{
                      primary: {
                        className: `${styles.sidebarText} ${oswald.className}`,
                        fontSize: "1.5rem",
                      },
                    }}
                    primary="Gallery"
                  />
                </ListItem>
                <ListItem
                  className={`${styles.sidebarItem} ${
                    pathname === "/uploader" ? styles.activeSidebarItem : ""
                  }`}
                  component={Link}
                  href="/uploader"
                >
                  <ListItemText
                    slotProps={{
                      primary: {
                        className: `${styles.sidebarText} ${oswald.className}`,
                        fontSize: "1.5rem",
                      },
                    }}
                    primary="Video Uploader"
                  />
                </ListItem>
              </List>
            </Drawer>

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                display: "flex",
                justifyContent: "center",
                minHeight: "100vh",
              }}
            >
              {children}
            </Box>
          </Box>
        </QueryClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
