const navigations = [
  { name: "Home", path: "/dashboard/default", icon: "home" },

  { label: "DSA Algorithms", type: "label" },
  {
    name: "Arrays",
    icon: "view_list", // Icon for the Arrays category
    badge: { color: "secondary" },
    children: [
      { name: "Binary Search", path: "/components/arrays/Bsearch", icon: "search" },
      { name: "Linear Search", path: "/components/arrays/Lsearch", icon: "search" },
      { name: "Bubble Sort", path: "/components/arrays/BBS", icon: "swap_vert" },
      { name: "Selection Sort", path: "/components/arrays/SLS", icon: "rule" }
    ]
  },
  {
    name: "Trees",
    icon: "account_tree", // Icon for the Trees category
    badge: { color: "secondary" },
    children: [
      { name: "BFS", path: "/components/trees/BFS", icon: "share" },
      { name: "DFS", path: "/components/trees/DFS", icon: "share" },
      { name: "DLS", path: "/components/trees/DLS", icon: "share" }
    ]
  },
  {
    name: "Stacks",
    icon: "layers", // Icon for the Stacks category
    badge: { color: "secondary" },
    children: [
      { name: "Stack Operations", path: "/components/Stacks/Operations", icon: "dynamic_feed" },
      { name: "Infix to Postfix", path: "/components/Stacks/INPO", icon: "transform" },
      { name: "Valid Parenthesis", path: "/components/Stacks/VP", icon: "code" }
    ]
  },
  {
    name: "Queue",
    icon: "linear_scale", // Icon for the Queue category
    badge: { color: "secondary" },
    children: [
      { name: "Queue Operations", path: "/components/Queue/Operations", icon: "arrow_right_alt" },
      { name: "Circular Queue", path: "/components/Queue/Circular-Queue-Operations", icon: "rotate_right" }
    ]
  }
];

export default navigations;