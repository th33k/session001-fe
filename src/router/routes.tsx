import * as routes from "../constants/routes";

const routeItems = [
  {
    path: routes.DASHBOARD,
    component: "Dashboard",
    policy: "dashboard.index",
  },
  {
    path: routes.QC_DASHBOARD,
    component: "QC/QCDashboard",
    policy: "qc.index",
  },
];

export default routeItems;
