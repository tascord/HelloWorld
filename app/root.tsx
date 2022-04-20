import { useEffect, useState } from "react";
import { Meta, Links, ScrollRestoration, Scripts, LiveReload, Outlet, useTransition, LinksFunction, LoaderFunction } from "remix";
import { MantineProvider, ColorSchemeProvider, ColorScheme, useMantineTheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SpotlightProvider } from "@mantine/spotlight"
import { Search } from "tabler-icons-react";
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";
import Styles from "~/style.css"

export const loader: LoaderFunction = ({ request }) => {
  // TODO: Fetch user data if user is logged in
  return null;
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: Styles },
  { rel: "stylesheet", href: nProgressStyles }
]

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = async (value?: ColorScheme) => {

    const theme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(theme);
    localStorage.setItem('theme', theme);

  }

  const transition = useTransition();
  useEffect(() => {
    if (transition.state === "idle")
      NProgress.done();
    else NProgress.start();
  }, [transition.state]);

  const [r, sr] = useState(false);
  useEffect(() => {
    if(r) return;
    sr(true);
    setColorScheme(window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
  }, [])

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{
        padding: 0,
        margin: 0,
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
        minHeight: '100vh',
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
                {r && children}
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