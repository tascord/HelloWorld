import React, { useEffect, useState } from "react";
import { Avatar, Box, Group, Navbar, ScrollArea, UnstyledButton, Text, useMantineTheme, ActionIcon, useMantineColorScheme, SimpleGrid, TextInput, Button, TextProps, Menu, Modal, Textarea, AppShell, ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ActionFunction, Form, Link, Links, LinksFunction, LiveReload, LoaderFunction, Meta, MetaFunction, Outlet, redirect, Scripts, ScrollRestoration, useActionData, useLoaderData, useTransition } from "remix";
import { ChevronRight, ChevronLeft, MoonStars, Sun, Logout, Settings, Plus, Search } from "tabler-icons-react";
import { format_media } from "~/utils/Server";
import { commitSession, getSession } from "~/utils/Session";
import { api_request } from "~/utils/Server";
import { Community, TokenUser, User } from "~/utils/Types";
import { NotificationsProvider } from "@mantine/notifications";
import { SpotlightProvider } from "@mantine/spotlight";

import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";
import Styles from "~/style.css"

export const loader: LoaderFunction = ({ request }) => new Promise(async resolve => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has('token')) return resolve(null);

  api_request<User>('me', 'get', undefined, session.get('token'))
    .then(user => resolve({ ...user, token: session.get('token') }))
    .catch(async () => {
      session.unset('token');
            resolve(redirect('/', {
        headers: {
          'Set-Cookie': await commitSession(session)
        }
      }));
    })

})

export const action: ActionFunction = ({ request }) => new Promise(async resolve => {
  const data = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));

  const email = data.get('email');
  const username = data.get('username');
  const password = data.get('password');

  api_request<{ token: string }>('user', email ? 'put' : 'post', { email: email?.toString(), username: username?.toString(), password: password?.toString() })
    .then(async ({ token }) => {
      session.set('token', token);
            resolve(redirect('/', {
        headers: {
          'Set-Cookie': await commitSession(session)
        }
      }));
    })
    .catch(error => {
      resolve({ error })
    })

})

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: Styles },
  { rel: "stylesheet", href: nProgressStyles }
]

export const meta: MetaFunction = () => ({
  title: 'bedroom !',
})

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
    if (r) return;
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
          <MantineProvider theme={{ colorScheme, fontFamily: 'Rubik, sans-serif' }}>
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
  const user_data = useLoaderData<TokenUser | undefined>();
  return (
    <Layout>
      {user_data ? Timeline(user_data) : Splash()}
    </Layout>
  )
}

export function ThemeSwitcher({ }): JSX.Element {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineColorScheme();

  return (
    <ActionIcon
      variant="light"
      color={theme.colorScheme === 'dark' ? 'yellow' : 'grape'}
      onClick={() => toggleColorScheme()}
      size={30}>
      {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
    </ActionIcon>
  )
}

export function ThemedText(props: { lightness?: number, children: string | JSX.Element | Array<string | JSX.Element> } & TextProps<'div'>) {
  return (
    <Text sx={(t) => ({ color: t.colorScheme === 'dark' ? t.colors.gray[t.colors.gray.length - (props.lightness ?? 4)] : t.colors.dark[(props.lightness ?? 4)] })} {...props}>
      {props.children}
    </Text>
  )
}

export const NoLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'inherit'
}

function Splash(): JSX.Element {

  const [registering, setRegistering] = React.useState(false);
  const { error }: { error?: string } = (useActionData() ?? {});

  return (
    <>
      <Group
        direction="row"
        position="apart"
        px="md"
        py="sm">
        <Text
          color="grape"
          weight={700}
          variant="gradient"
          component={Link}
          to="/"
          gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
          sx={{ fontSize: '1.5rem' }}>
          bedroom
        </Text>
        <ThemeSwitcher />
      </Group>
      <SimpleGrid
        cols={2}
        style={{
          height: '100%',
        }}>
        <Group
          direction="column"
          position="right">
          <Text
            color="grape"
            weight={700}
            variant="gradient"
            align="right"
            gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
            sx={{ fontSize: '3.5rem' }}>
            bedroom community
          </Text>

          <ThemedText
            align="right"
            style={{
              fontSize: '2.25rem',
              maxWidth: 'min(35vw, 40rem)',
            }}>
            Find your sub-sub-genre of the internet filled with fellow folk that find familiar frills fascinating.
          </ThemedText>

        </Group>
        <Group>
          <Form
            method="post"
            style={{
              width: '100%',
              maxWidth: '40rem'
            }}>
            <Box px="xl">
              <Text color="red">{error}</Text>
              <TextInput
                name="username"
                placeholder="Username"
                label="Username"
                description="Your account handle"
                mt="sm"
                required
              />
              {registering && <TextInput
                name="email"
                type="email"
                placeholder="Email Address"
                label="Email"
                description="The email address that will be tied to your account"
                mt="sm"
                required
              />}
              <TextInput
                name="password"
                type="password"
                placeholder="Password"
                label="Password"
                description="Your accounts password"
                mt="sm"
                required
              />
              <Group
                mt="md"
                position="right"
                style={{ flexDirection: 'row-reverse' }}>
                <Button
                  type="submit"
                  variant="light"
                  color="pink">
                  {registering ? 'Register' : 'Login'}
                </Button>
                <Button
                  variant="light"
                  color="yellow"
                  onClick={() => setRegistering(!registering)}>
                  {registering ? 'Login' : 'Register'} Instead
                </Button>
              </Group>
            </Box>
          </Form>
        </Group>
      </SimpleGrid>
    </>
  )
}

function Timeline(user: TokenUser) {
  const theme = useMantineTheme();

  const User = ({ }) => (

    // TODO: Fix theme issues here
    // Doesn't seem to effect <Brand /> ?

    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
      }}
    >
      <Menu
        placement="end"
        position="right"
        style={{ width: '100%' }}
        control={
          <UnstyledButton
            sx={{
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[8],
              },
            }}
          >
            <Group>
              <Avatar
                src={format_media(user.avatar)}
                radius="xl"
              />
              <Box sx={{ flex: 1 }}>
                <ThemedText size="sm" weight={500} lightness={10}>
                  {user.display_name}
                </ThemedText>
                <Text color="dimmed" size="xs">
                  @{user.username}
                </Text>
              </Box>
              {theme.dir === 'ltr' ? <ChevronRight size={18} color={theme.colors.gray[5]} /> : <ChevronLeft size={18} color={theme.colors.gray[5]} />}
            </Group>
          </UnstyledButton>
        }>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
        <Menu.Item color="red" icon={<Logout size={14} />}><Link to="/logout" style={NoLinkStyle}>Logout</Link></Menu.Item>
      </Menu>
    </Box>
  );

  const Brand = ({ }) => (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingBottom: theme.spacing.sm,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
      })}
    >
      <Group position="apart">
        <Text
          color="grape"
          weight={700}
          variant="gradient"
          component={Link}
          to="/"
          gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
          sx={{ fontSize: '1.5rem' }}>
          bedroom
        </Text>
        <ThemeSwitcher />
      </Group>
    </Box >
  );

  const Communities = ({ }) => {

    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [fields, setFields] = useState<{ [key: string]: string }>({});

    const [communities, setCommunities] = useState<Community[]>([]);
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {

      if (dataLoading) return;
      setDataLoading(true);
      let data: Community[] = [];

      for (let i = 0; i <= Math.min(user.communities.length - 1, 10); i++) {
        api_request<Community>(`community/${user.communities[i]}`, 'get', undefined, user.token)
          .then(community => data.push(community))
          .catch(e => console.log(`Unable to poll for community at ID ${i}:\n${e}`))
          .finally(() => {
            if (i === Math.min(user.communities.length - 1, 10)) {
              setCommunities(data);
            }
          })
      }

    });

    function create(e: any) {
      e.preventDefault();

      setLoading(true);
      api_request<Community>('community', 'put', fields, user.token)
        .then(({ id }) => {
          // TODO: Remix redirect
          window.location.pathname = id;
        })
        .catch(error => {
          setError(error);
          setLoading(false);
          setTimeout(() => setError(undefined), 2000);
        })

    }

    return (
      <>
        {
          communities.map(c => (
            <Button
              key={c.id}
              variant="light"
              color="yellow"
              mt="xs"
              component={Link}
              to={c.id}
              style={{ width: '100%' }}>
              {c.name}
            </Button>
          ))
        }
        <Modal
          opened={creating}
          title="Create a Community"
          onClose={() => setCreating(false)}>
          <form
            onSubmit={(e) => create(e)}>
            <TextInput
              placeholder="Name"
              label="Community Name"
              description="The name tied to your Community. While it doesn't have to be unique, it should make your Community stand out."
              onChange={(e) => setFields({ ...fields, name: e.target.value })}
              mt="sm"
              required
            />
            <Textarea
              placeholder="Description"
              label="Community Description"
              description="Anything and everything about your Community, summed up to be easy to read at a glance. This will be visible to users scouting for new Communities to join."
              onChange={(e) => setFields({ ...fields, description: e.target.value })}
              mt="sm"
              maxLength={200}
              required
            />
            <Button
              mt="sm"
              variant="light"
              color="green"
              type="submit"
              style={{ width: '100%' }}
              loading={loading}
              disabled={error !== undefined}>
              {error ?? 'Create'}
            </Button>
          </form>
        </Modal>
        <Group
          mt="sm"
          direction="column"
          position="center"
          style={{ width: '100%' }}>
          <Button
            variant="light"
            color="pink"
            leftIcon={<Plus />}
            onClick={() => setCreating(true)}
            style={{ width: '100%' }}>
            Create New
          </Button>
        </Group>
      </>
    )

  }

  return (
    <AppShell
      navbar={<Navbar p="xs" width={{ base: 300 }}>
        <Navbar.Section mt="xs">
          <Brand />
        </Navbar.Section>
        <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
          <Communities />
        </Navbar.Section>
        <Navbar.Section>
          <User />
        </Navbar.Section>
      </Navbar>}
    >
      <Outlet />
    </AppShell>
  )
}