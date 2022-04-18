import { Avatar, Box, Group, Navbar, ScrollArea, UnstyledButton, Text, useMantineTheme, ActionIcon, useMantineColorScheme } from "@mantine/core";
import { LinksFunction } from "remix";
import { ChevronRight, ChevronLeft, MoonStars, Sun } from "tabler-icons-react";

import Styles from '~/style.css';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: Styles }
]

export default function () {

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
                        src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                        radius="xl"
                    />
                    <Box sx={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            Amy Horsefighter
                        </Text>
                        <Text color="dimmed" size="xs">
                            ahorsefighter@gmail.com
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
                paddingBottom: theme.spacing.lg,
                borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            })}
        >
            <Group position="apart">
                <Text
                    color="grape"
                    weight={700}
                    variant="gradient"
                    gradient={{ from: '#FCB0B3', to: '#7EB2DD', deg: 0 }}
                    sx={{ fontSize: '1.5rem' }}
                >bedroom</Text>
                <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                    {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
                </ActionIcon>
            </Group>
        </Box >
    );

    return (
        <Navbar p="xs" width={{ base: 300 }}>
            <Navbar.Section mt="xs">
                <Brand />
            </Navbar.Section>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                <Box py="md">
                    <h1>for real?</h1>
                    <h3>Just like that?</h3>
                </Box>
            </Navbar.Section>
            <Navbar.Section>
                <User />
            </Navbar.Section>
        </Navbar>
    )
}