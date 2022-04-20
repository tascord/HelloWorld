import React from "react";
import { Avatar, Box, Group, Navbar, ScrollArea, UnstyledButton, Text, useMantineTheme, ActionIcon, useMantineColorScheme, SimpleGrid, TextInput, Button, TextProps } from "@mantine/core";
import { ActionFunction, Form, Link, LoaderFunction, redirect, useActionData, useLoaderData } from "remix";
import { ChevronRight, ChevronLeft, MoonStars, Sun } from "tabler-icons-react";
import { format_media } from "~/utils/Server";
import { commitSession, getSession } from "~/utils/Session";
import { api_request } from "~/utils/Server";
import type { User } from "~/utils/Types";

export const loader: LoaderFunction = ({ request }) => new Promise(async resolve => {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has('token')) {
        console.log(session.data)
        console.log('No token lol')
        return resolve(null);
    }

    api_request<User>('/me', 'get', undefined)
        .then(resolve)
        .catch(async () => {
            console.log('Unsetting token');
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
            console.log(session.data);
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

export default function () {

    const user_data = useLoaderData<User | undefined>();
    if (!user_data) return Splash();
    return Timeline(user_data);

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

function Timeline(user: User) {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const User = ({ }) => (
        <Box
            sx={{
                paddingTop: theme.spacing.sm,
                borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            }}
        >
            <UnstyledButton
                sx={{
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                    '&:hover': {
                        backgroundColor:
                            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    },
                }}
            >
                <Group>
                    <Avatar
                        src={format_media(user.avatar)}
                        radius="xl"
                    />
                    <Box sx={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            {user.display_name}
                        </Text>
                        <Text color="dimmed" size="xs">
                            @{user.username}
                        </Text>
                    </Box>

                    {theme.dir === 'ltr' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Group>
            </UnstyledButton>
        </Box>
    )

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

    return (
        <Navbar p="xs" width={{ base: 300 }}>
            <Navbar.Section mt="xs">
                <Brand />
            </Navbar.Section>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">

                {/*  */}

            </Navbar.Section>
            <Navbar.Section>
                <User />
            </Navbar.Section>
        </Navbar>
    )
}