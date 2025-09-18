const navigations = [
  { name: "Home", path: "/dashboard/default", icon: "home" },
  { name: "DSA Roadmap", path: "/dashboard/Roadmap", icon: "timeline" },

  { label: "Learning Levels", type: "label" },

  {
    name: "Level 1",
    icon: "layers",
    children: [
      { name: "Stack Operations", path: "/components/Stacks/Operations", icon: "dynamic_feed" },
      { name: "Queue Operations", path: "/components/Queue/Operations", icon: "arrow_right_alt" },
      { name: "Circular Queue", path: "/components/Queue/Circular-Queue-Operations", icon: "rotate_right" }
    ]
  },
  {
    name: "Level 2",
    icon: "transform",
    children: [
      { name: "Infix to Postfix", path: "/components/Stacks/INPO", icon: "transform" },
      { name: "Valid Parenthesis", path: "/components/Stacks/VP", icon: "code" }
    ]
  },
  {
    name: "Level 3",
    icon: "search",
    children: [
      { name: "Binary Search", path: "/components/arrays/Bsearch", icon: "search" },
      { name: "Linear Search", path: "/components/arrays/Lsearch", icon: "search" },
      { name: "Bubble Sort", path: "/components/arrays/BBS", icon: "swap_vert" },
      { name: "Selection Sort", path: "/components/arrays/SLS", icon: "rule" }
    ]
  },
  {
    name: "Level 4",
    icon: "account_tree",
    children: [
      { name: "BFS", path: "/components/trees/BFS", icon: "share" },
      { name: "DFS", path: "/components/trees/DFS", icon: "share" },
      { name: "DLS", path: "/components/trees/DLS", icon: "share" }
    ]
  }
];

export default navigations;