/*
  Site settings.
  Edit this file to change your name and links, and to list your posts.
*/
window.SITE = {

  name: "Heitor Baldo",
  role: "Applied Mathematician | Researcher",

  // Links at the bottom of the sidebar (none for now). To add one:
  //   links: [ { label: "Papers", url: "https://..." } ],
  links: [],

  // Your posts. Add one line per post (any order; they are sorted by date).
  //   title: shown in the menu and at the top of the post
  //   date:  year-month-day
  //   file:  the file name inside the posts/ folder
  posts: [
    { title: "Tropical combinatorial neural codes", date: "2026-04-14", file: "tropical-combinatorial-neural-codes.html" },
    
  ],

  // How many recent posts to show under "Posts" in the sidebar (0 hides the list).
  sidebarPosts: 8,

  // LaTeX shortcuts you can use in any post, e.g. $\dd x$.
  macros: {
    "\\dd": "\\mathrm{d}"
  }

  // Optional: replace the footer text (default: "© <year> <name>").
  // footer: "© Heitor Baldo"
};
