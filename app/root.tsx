import { useState } from "react";
import { Meta, Links, ScrollRestoration, Scripts, LiveReload, Outlet } from "remix";
import { MantineProvider, ColorSchemeProvider, ColorScheme, useMantineTheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SpotlightProvider } from "@mantine/spotlight"
import { Search } from "tabler-icons-react";

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = async (value?: ColorScheme) => {

    const theme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(theme);

  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{
        padding: 0,
        margin: 0,
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1]
      }}>

        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme, fontFamily: 'GreyCliff CF, sans-serif' }}>
            <NotificationsProvider>
              <SpotlightProvider
                actions={[]}
                searchIcon={<Search size={18} />}
                searchPlaceholder="Search..."
                shortcut="mod + k"
                nothingFoundMessage="Nothing found..."
              >
                {children}
              </SpotlightProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function () {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}