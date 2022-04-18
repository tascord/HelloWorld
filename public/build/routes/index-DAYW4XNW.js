import {
  Avatar,
  Box,
  Group,
  Navbar,
  ScrollArea,
  Text,
  UnstyledButton,
  require_dist,
  useMantineTheme
} from "/build/_shared/chunk-LGJ7EJJN.js";
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
  return /* @__PURE__ */ React.createElement(Navbar, {
    height: 600,
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
//# sourceMappingURL=/build/routes/index-DAYW4XNW.js.map
