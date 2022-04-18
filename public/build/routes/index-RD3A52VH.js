import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Navbar,
  ScrollArea,
  Text,
  UnstyledButton,
  require_dist,
  useMantineColorScheme,
  useMantineTheme
} from "/build/_shared/chunk-S5LTGIVA.js";
import {
  React,
  __toESM,
  init_react
} from "/build/_shared/chunk-VNQJO7SM.js";

// browser-route-module:/Users/float/Documents/Projects/bedroom.community/app/routes/index.tsx?browser
init_react();

// app/routes/index.tsx
init_react();
var import_tabler_icons_react = __toESM(require_dist());
function routes_default() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const User = ({}) => /* @__PURE__ */ React.createElement(Box, {
    sx: {
      paddingTop: theme.spacing.sm,
      borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`
    }
  }, /* @__PURE__ */ React.createElement(UnstyledButton, {
    sx: {
      display: "block",
      width: "100%",
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
      }
    }
  }, /* @__PURE__ */ React.createElement(Group, null, /* @__PURE__ */ React.createElement(Avatar, {
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80",
    radius: "xl"
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: { flex: 1 }
  }, /* @__PURE__ */ React.createElement(Text, {
    size: "sm",
    weight: 500
  }, "Amy Horsefighter"), /* @__PURE__ */ React.createElement(Text, {
    color: "dimmed",
    size: "xs"
  }, "ahorsefighter@gmail.com")), theme.dir === "ltr" ? /* @__PURE__ */ React.createElement(import_tabler_icons_react.ChevronRight, {
    size: 18
  }) : /* @__PURE__ */ React.createElement(import_tabler_icons_react.ChevronLeft, {
    size: 18
  }))));
  const Brand = ({}) => /* @__PURE__ */ React.createElement(Box, {
    sx: (theme2) => ({
      paddingLeft: theme2.spacing.xs,
      paddingRight: theme2.spacing.xs,
      paddingBottom: theme2.spacing.lg,
      borderBottom: `1px solid ${theme2.colorScheme === "dark" ? theme2.colors.dark[4] : theme2.colors.gray[2]}`
    })
  }, /* @__PURE__ */ React.createElement(Group, {
    position: "apart"
  }, /* @__PURE__ */ React.createElement(Text, {
    color: "grape",
    weight: 700,
    sx: { fontSize: "1.25rem" }
  }, "bedroom"), /* @__PURE__ */ React.createElement(ActionIcon, {
    variant: "default",
    onClick: () => toggleColorScheme(),
    size: 30
  }, colorScheme === "dark" ? /* @__PURE__ */ React.createElement(import_tabler_icons_react.Sun, {
    size: 16
  }) : /* @__PURE__ */ React.createElement(import_tabler_icons_react.MoonStars, {
    size: 16
  }))));
  return /* @__PURE__ */ React.createElement(Navbar, {
    p: "xs",
    width: { base: 300 }
  }, /* @__PURE__ */ React.createElement(Navbar.Section, {
    mt: "xs"
  }, /* @__PURE__ */ React.createElement(Brand, null)), /* @__PURE__ */ React.createElement(Navbar.Section, {
    grow: true,
    component: ScrollArea,
    mx: "-xs",
    px: "xs"
  }, /* @__PURE__ */ React.createElement(Box, {
    py: "md"
  }, /* @__PURE__ */ React.createElement("h1", null, "for real?"), /* @__PURE__ */ React.createElement("h3", null, "Just like that?"))), /* @__PURE__ */ React.createElement(Navbar.Section, null, /* @__PURE__ */ React.createElement(User, null)));
}
export {
  routes_default as default
};
//# sourceMappingURL=/build/routes/index-RD3A52VH.js.map
