import {
  CustomerManagementIcon,
  DashboardIcon,
  PermissionManagementIcon,
  RoleManagementIcon,
  UserManagementIcon,
} from "@/components/icons";
import { Transaction } from "@/components/icons/Transaction";
import { ComponentType } from "react";
import { UserPlus, DollarSign, Shield } from "lucide-react";

// Legacy NavLink type - no longer used
// type NavLink = {
//   title: string;
//   url: string;
//   icon: ComponentType<React.ComponentProps<"svg">>;
// };

export interface SidebarLink {
  title: string;
  url: string;
  icon: ComponentType<React.ComponentProps<"svg">>;
  roles: string[];
}

// Role-based sidebar configuration
// SHOWING ONLY THREE ITEMS FOR TESTING
export const sidebarLinks: SidebarLink[] = [
  {
    title: "Invite User",
    url: "/invite-user",
    icon: UserPlus as ComponentType<React.ComponentProps<"svg">>,
    roles: ["Super Admin"],
  },
  {
    title: "Payment Summary",
    url: "/payment-summary",
    icon: DollarSign as ComponentType<React.ComponentProps<"svg">>,
    roles: ["Super Admin"],
  },
  {
    title: "Verify Payment",
    url: "/verify-payment",
    icon: Shield as ComponentType<React.ComponentProps<"svg">>,
    roles: ["Super Admin"],
  },
  // ALL OTHER LINKS COMMENTED OUT FOR TESTING
  // {
  //   title: "Dashboard",
  //   url: "/dashboard",
  //   icon: DashboardIcon,
  //   roles: ["Super Admin", "KYC Initiator", "KYC Supervisor", "KYC Final Approver", "Field Officer"],
  // },
  // {
  //   title: "KYC Initiator Dashboard",
  //   url: "/kyci-dashboard",
  //   icon: DashboardIcon,
  //   roles: [],
  // },
  // {
  //   title: "KYC Supervisor Dashboard",
  //   url: "/kyc-supervisor",
  //   icon: DashboardIcon,
  //   roles: [],
  // },
  // {
  //   title: "KYC Final Approval Supervisor Dashboard",
  //   url: "/kyc-approval-supervisor",
  //   icon: DashboardIcon,
  //   roles: [],
  // },
  // {
  //   title: "Physical Verification Dashboard",
  //   url: "/physical-verification",
  //   icon: DashboardIcon,
  //   roles: [],
  // },
  // {
  //   title: "User Management",
  //   url: "/user-management",
  //   icon: UserManagementIcon,
  //   roles: ["Super Admin"],
  // },
  // {
  //   title: "Role Management",
  //   url: "/role-management",
  //   icon: RoleManagementIcon,
  //   roles: ["Super Admin"],
  // },
  // {
  //   title: "Permission Management",
  //   url: "/permission-management",
  //   icon: PermissionManagementIcon,
  //   roles: ["Super Admin"],
  // },
  // {
  //   title: "Customer Management",
  //   url: "/customer-management",
  //   icon: CustomerManagementIcon,
  //   roles: ["Super Admin"],
  // },
  // {
  //   title: "Transactions",
  //   url: "/transactions",
  //   icon: Transaction,
  //   roles: ["Super Admin"],
  // },
];


// Legacy superAdminLinks for backward compatibility - now merged into sidebarLinks
// export const superAdminLinks: NavLink[] = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: DashboardIcon,
//   },
//   {
//     title: "KYC Initiator Dashboard",
//     url: "/kyci-dashboard",
//     icon: DashboardIcon,
//   },
//   {
//     title: "KYC Supervisor Dashboard",
//     url: "/kyc-supervisor",
//     icon: DashboardIcon,
//   },
//   {
//     title: "KYC Final Approval Supervisor Dashboard",
//     url: "/kyc-approval-supervisor",
//     icon: DashboardIcon,
//   },
//   {
//     title: "KYC Pending  Final Approval  Supervisor Dashboard",
//     url: "/kyc-approvall-supervisor-pendings",
//     icon: DashboardIcon,
//   },
//   {
//     title: "Physical Verification Dashboard",
//     url: "/physical-verification",
//     icon: DashboardIcon,
//   },
//   {
//     title: "User Management",
//     url: "/user-management",
//     icon: UserManagementIcon,
//   },
//   {
//     title: "Role Management",
//     url: "/role-management",
//     icon: RoleManagementIcon,
//   },
//   {
//     title: "Permission Management",
//     url: "/permission-management",
//     icon: PermissionManagementIcon,
//   },
//   {
//     title: "Customer Management",
//     url: "/customer-management",
//     icon: CustomerManagementIcon,
//   },
//   {
//     title: "Transactions",
//     url: "/transactions",
//     icon: Transaction,
//   },
// ];
