"use client";

// AUTHENTICATION CHECKS COMMENTED OUT FOR TESTING
// import { useQuery } from "@tanstack/react-query";
// import { getAuthenticatedUserQueryOptions } from "@/query-options/usersQueryOption";
import SuperAdminDashboard from "@/components/layout/dashboards/SuperAdminDashboard";
// import KYCInitiatorDashboard from "@/components/layout/dashboards/KYCInitiatorDashboard";
// import KYCFinalApproverDashboard from "@/components/layout/dashboards/KYCFinalApproverDashboard";
// import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  // AUTHENTICATION CHECKS COMMENTED OUT FOR TESTING
  // const { data: authenticatedUser, isLoading, error } = useQuery(
  //   getAuthenticatedUserQueryOptions()
  // );

  // if (isLoading) {
  //   return (
  //     <div className="p-6">
  //       <div className="space-y-4">
  //         <Skeleton className="h-8 w-64" />
  //         <Skeleton className="h-4 w-96" />
  //         <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
  //           {Array.from({ length: 4 }).map((_, i) => (
  //             <Skeleton key={i} className="h-48 w-full" />
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="p-6">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
  //         <p className="text-gray-600">Unable to load user information. Please try again.</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!authenticatedUser?.data) {
  //   return (
  //     <div className="p-6">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-600 mb-2">No User Data</h2>
  //         <p className="text-gray-600">Unable to determine user role.</p>
  //       </div>
  //     </div>
  //   );
  // }

  // const user = authenticatedUser.data;
  // const userRoles = user.roles || [];

  // Render different dashboards based on user roles
  // const renderDashboardByRole = () => {
  //   // Check if roles array includes specific roles
  //   if (userRoles.some(role => role.toLowerCase().includes("super admin"))) {
  //     return <SuperAdminDashboard />;
  //   }

  //   if (userRoles.some(role => role.toLowerCase().includes("kyc initiator"))) {
  //     return (
  //       <KYCInitiatorDashboard
  //         title="Performance Evaluation "
  //         subtitle="Overall performance of all activities"
  //         breadcrumbText="Dashboard"
  //       />
  //     );
  //   }

  //   if (userRoles.some(role => role.toLowerCase().includes("kyc supervisor"))) {
  //     return (
  //       <KYCInitiatorDashboard
  //         title="KYC Supervisor Dashboard"
  //         subtitle="KYC request supervision and review"
  //         breadcrumbText="KYC Supervisor Dashboard"
  //       />
  //     );
  //   }

  //   if (userRoles.some(role => role.toLowerCase().includes("kyc final approver") || role.toLowerCase().includes("kyc approval supervisor"))) {
  //     return (
  //       <KYCFinalApproverDashboard
  //         title="KYC Final Approver Dashboard"
  //         subtitle="Final KYC approval and team management"
  //         breadcrumbText="KYC Final Approver Dashboard"
  //       />
  //     );
  //   }

  //   if (userRoles.some(role => role.toLowerCase().includes("field officer"))) {
  //     return (
  //       <KYCInitiatorDashboard
  //         title="Field Officer Dashboard"
  //         subtitle="Field operations and KYC management"
  //         breadcrumbText="Field Officer Dashboard"
  //       />
  //     );
  //   }

  //   // Default to Super Admin dashboard for unknown roles
  //   return <SuperAdminDashboard />;
  // };

  // return renderDashboardByRole();
  
  // Directly render SuperAdminDashboard without authentication
  return <SuperAdminDashboard />;
}
