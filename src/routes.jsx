import DataTable from "./Components/DataTable/DataTable";
import Placeholder from "./Components/Placeholder";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fa fa-pie-chart",
    layout: "/admin",
  },

  {
    path: "/master",
    name: "Master Management",
    icon: "fa fa-tachometer",
    layout: "/admin",
    children: [
      {
        path: "roles",
        name: "Roles",
        icon: "fa fa-user",
        layout: "/admin",
      },
      {
        path: "designation",
        name: "Designation",
        icon: "fa fa-certificate",
        layout: "/admin",
      },
      {
        path: "organization",
        name: "Organization",
        icon: "fa fa-building",
        layout: "/admin",
      },
    ],
  },
  {
    path: "/lead",
    name: "Lead Management",
    icon: "fa fa-tasks",
    layout: "/admin",
    children: [
      {
        path: "contacts",
        name: "Contacts",
        icon: "fa fa-phone",
        layout: "/admin",
      },
      {
        path: "reference",
        name: "Reference",
        icon: "fa fa-plug",
        layout: "/admin",
      },
      {
        path: "leadsTag",
        name: "Leads Tag",
        icon: "fa fa-tags",
        layout: "/admin",
      },
      {
        path: "leadsSource",
        name: "Leads Source",
        icon: "fa fa-snowflake-o",
        layout: "/admin",
      },

      {
        path: "leadsStatus",
        name: "Leads Status",
        icon: "fa fa-th-list",
        layout: "/admin",
      },
      {
        path: "leads",
        name: "Leads",
        icon: "fa fa-leaf",
        layout: "/admin",
      },
    ],
  },

  {
    path: "/employee",
    name: "Employee Management",
    icon: "fa fa-users",
    layout: "/admin",
    children: [
      {
        path: "list",
        name: "Employee List",
        icon: "fa fa-list",
      },
    ],
  },

  {
    path: "/campaign",
    name: "Campaign Management",
    icon: "fa fa-object-group",
    layout: "/admin",
    children: [
      {
        path: "contactTag",
        name: "Contact Tag",
        icon: "fa fa-phone-square",
      },
      {
        path: "template",
        name: "Template",
        icon: "fa fa-file-text-o",
      },
      {
        path: "campaign",
        name: "Campaign",
        icon: "fa fa-share-square-o",
      },
      // {
      //   path: "campaignScheduling",
      //   name: "Campaign Scheduling",
      //   icon: "fa fa-calendar",
      // },
    ],
  },

  // {
  //   path: "/tables",
  //   name: "Table List",
  //   icon: "fa fa-table",
  //   component: DataTable,
  //   layout: "/admin",
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "fa fa-text-width",
  //   component: Placeholder,
  //   layout: "/admin",
  // },
  // {
  //   pro: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "nc-icon nc-spaceship",
  //   component: Placeholder,
  //   layout: "/admin",
  // },
];

export default routes;
