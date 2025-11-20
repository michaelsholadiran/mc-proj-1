"use client";
import {
  CustomerDetails,
  CustomerKYCTable,
} from "@/components/layout/tables/customersKYCTable";
import { KYCRequestTab } from "@/components/layout/tabs/KYCRequestTab";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Play } from "lucide-react";
import { useParams } from "next/navigation";

export default function KYCDetailsPage() {
  const params = useParams() as { id: string };
  const customerKYCData: CustomerDetails[] = [
    {
      id: "m5gr84i9",
      documentType: "NIN",
      status: "Pending",
      dateCreated: "02/04/2024",
    },
    {
      id: "3u1reuv4",
      documentType: "Driver's License",
      status: "Pending",
      dateCreated: "02/04/2024",
    },
    {
      id: "derv1ws0",
      documentType: "International Passport",

      status: "Approved",
      dateCreated: "02/04/2024",
    },
    {
      id: "5kma53ae",
      documentType: "Voter's Card",

      status: "Pending",
      dateCreated: "02/04/2024",
    },
    {
      id: "bhqecj4p",
      documentType: "NIN",

      status: "Failed",
      dateCreated: "02/04/2024",
    },
  ];

  const handleDelete = (id: string) => {
    console.log("Deleting row with id:", id);
  };

  const handleEdit = (permission: { id: string }) => {
    console.log("Editing row with id:", permission.id);
  };
  return (
    <div className="bg-white rounded-lg p-6 px-[1rem] md:px-[2rem]">
      <div>
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500]">
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/kyci-dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="!text-[#A9A9A9]">
                  KYC Requests
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>KYC Request Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mt-[26px]">
          <h6 className="font-[family-name:var(--font-dm)] font-[600] text-[16px]">
            KYC Request Details
          </h6>
        </div>
      </div>
      <KYCRequestTab id={params.id} />

      <div className="space-y-6">
        <CustomerKYCTable
          data={customerKYCData}
          onDeleteTableProp={handleDelete}
          onEditTableProp={handleEdit}
        />
      </div>
    </div>
  );
}
