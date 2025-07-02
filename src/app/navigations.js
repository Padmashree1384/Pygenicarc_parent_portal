const navigations = [
  { name: "Page 1", path: "/dashboard/default", icon: "dashboard" },
  { label: "PAGES", type: "label" },
  {
    name: "Session/Auth",
    icon: "security",
    children: [
      { name: "Sign in", iconText: "SI", path: "/session/signin" },
      { name: "Sign up", iconText: "SU", path: "/session/signup" },
      { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
      { name: "Error", iconText: "404", path: "/session/404" }
    ]
  },
  { label: "Components", type: "label" },
  {
    name: "Components",
    icon: "favorite",
    badge: { value: "5", color: "secondary" },
    children: [
      { name: "Page 3", path: "/material/autocomplete", iconText: "3" },
      { name: "Page 4", path: "/material/buttons", iconText: "4" },
      { name: "Page 5", path: "/material/checkbox", iconText: "5" },
      { name: "Page 6", path: "/material/dialog", iconText: "6" },
      { name: "Page 7", path: "/material/form", iconText: "7" }
    ]
  },
  {
    name: "Page 2",
    icon: "trending_up",
    children: [{ name: "Echarts", path: "/charts/echarts", iconText: "E" }]
  },
  {
    name: "Documentation",
    icon: "launch",
    type: "extLink",
    path: "http://demos.ui-lib.com/matx-react-doc/"
  }
];

export default navigations;
