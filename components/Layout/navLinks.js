import {
  IconBlog,
  IconDashboard,
  IconMedia,
  IconMessage,
  IconSettings,
  IconCategories,
} from "../Icons";

export const navLinks = [
  {
    name: "Dashboard",
    link: "/",
    icon: <IconDashboard />,
  },
  {
    name: "Blog",
    link: "/blog",
    icon: <IconBlog />,
    sublinks: [
      { name: "Add Blog", link: "/blog/add-blog" },
      { name: "Edit Blog", link: "/blog/edit-blog" },
    ],
  },
  {
    name: "Categories",
    link: "/categories",
    icon: <IconCategories />,
  },
  {
    name: "Media",
    link: "/media",
    icon: <IconMedia />,
  },
  {
    name: "Message",
    link: "/message",
    icon: <IconMessage />,
  },
  {
    name: "Settings",
    link: "/settings",
    icon: <IconSettings />,
  },
];
