"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { getAuthenticatedUserQueryOptions } from "@/query-options/usersQueryOption";
import { useQuery } from "@tanstack/react-query";
import { Play, X } from "lucide-react";
import Link from "next/link";

export default function ProfileSettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    role: "",
    phoneNumber: ""
  });
  
  const { data: authenticatedUser } =
    useQuery(getAuthenticatedUserQueryOptions());

  const user = authenticatedUser?.data;

  // Initialize form data when user data is loaded
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        department: user.departmentId || "",
        role: user.roles?.[0] || "",
        phoneNumber: user.phoneNumber || ""
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    // Handle form submission here
    console.log("Updating user data:", formData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Section */}
      <div className="mb-4 sm:mb-6 lg:mb-8 w-full bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <Breadcrumb>
            <BreadcrumbList className="font-[family-name:var(--font-poppins)] font-[500] text-xs sm:text-sm lg:text-base">
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/dashboard" className="hover:text-gray-700">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC] h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#A9A9A9]">
                <BreadcrumbLink href="/settings" className="hover:text-gray-700">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Play className="text-[#CCCCCC] h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem className="text-[#464646]">
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#464646] font-[family-name:var(--font-poppins)]">
            Settings
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-row gap-2 sm:gap-4 lg:gap-8">
          <Link 
            href="/settings/profile"
            className="font-[family-name:var(--font-poppins)] px-3 sm:px-4 py-2 rounded-none border-b-2 border-[#04B2F1] text-[#04B2F1] transition-colors text-xs sm:text-sm whitespace-nowrap"
          >
            Profile
          </Link>
          <Link 
            href="/settings/security"
            className="font-[family-name:var(--font-poppins)] px-3 sm:px-4 py-2 rounded-none border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
          >
            Security
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="space-y-4 sm:space-y-6 bg-white px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          {/* Profile Picture Section */}
          <Card className="shadow-none border-0">
            <CardContent className="p-4 !pl-0 !pt-0 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#464646] font-[family-name:var(--font-poppins)] mb-3 sm:mb-4">
                Your Profile Picture
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {/* Profile Picture */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#04B2F1] to-[#0284B2] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg sm:text-xl font-bold font-[family-name:var(--font-poppins)]">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-lg sm:text-xl font-bold text-[#464646] font-[family-name:var(--font-poppins)] mb-2">
                    {user?.firstName} {user?.lastName}
                  </h4>
                  <div className="space-y-1 text-xs sm:text-sm text-[#464646] font-[family-name:var(--font-poppins)]">
                    <p>Department: {user?.departmentId || "N/A"}</p>
                    <p>Role: {user?.roles?.[0] || "N/A"}</p>
                    <p>Last seen: {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information Display */}
          <Card className="shadow-none border-0">
            <CardContent className="py-4 sm:p-6 !p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                      First Name
                    </Label>
                    <input
                      type="text"
                      value={user?.firstName || "N/A"}
                      disabled
                      className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg font-[family-name:var(--font-poppins)] text-[#A9A9A9] text-sm sm:text-base bg-gray-50 mt-3"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                      Role
                    </Label>
                    <input
                      type="text"
                      value={user?.roles?.[0] || "N/A"}
                      disabled
                      className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg font-[family-name:var(--font-poppins)] text-[#A9A9A9] text-sm sm:text-base bg-gray-50 mt-3"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                      Email Address
                    </Label>
                    <input
                      type="email"
                      value={user?.email || "N/A"}
                      disabled
                      className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg font-[family-name:var(--font-poppins)] text-[#A9A9A9] text-sm sm:text-base bg-gray-50 break-all mt-3"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                      Last Name
                    </Label>
                    <input
                      type="text"
                      value={user?.lastName || "N/A"}
                      disabled
                      className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg font-[family-name:var(--font-poppins)] text-[#A9A9A9] text-sm sm:text-base bg-gray-50 mt-3"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                      Department
                    </Label>
                    <input
                      type="text"
                      value={user?.departmentId || "N/A"}
                      disabled
                      className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg font-[family-name:var(--font-poppins)] text-[#A9A9A9] text-sm sm:text-base bg-gray-50 break-all mt-3"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                      Phone Number
                    </Label>
                    <input
                      type="text"
                      value={user?.phoneNumber || "N/A"}
                      disabled
                      className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg font-[family-name:var(--font-poppins)] text-[#A9A9A9] text-sm sm:text-base bg-gray-50 mt-3"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-6 sm:mt-8 flex justify-center sm:justify-start">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0284B2] hover:bg-[#0284B2]/90 text-white font-[family-name:var(--font-poppins)] px-4 sm:px-6 h-12 sm:h-14 rounded-[4px] text-sm sm:text-base w-full sm:w-auto"
                >
               
                  Edit Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Information Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-xs sm:max-w-md lg:max-w-2xl mx-4 sm:mx-0">
            <DialogHeader className="relative">
              <DialogTitle className="text-lg sm:text-xl font-bold text-[#464646] font-[family-name:var(--font-poppins)]">
                Edit Information
              </DialogTitle>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </button>
            </DialogHeader>
            
            <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="modal-name" className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                    Name
                  </Label>
                  <input
                    type="text"
                    id="modal-name"
                    value={`${formData.firstName} ${formData.lastName}`}
                    onChange={(e) => {
                      const names = e.target.value.split(' ');
                      handleInputChange('firstName', names[0] || '');
                      handleInputChange('lastName', names.slice(1).join(' ') || '');
                    }}
                    className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg focus:border-blue-500 text-gray-900 mt-3 text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <Label htmlFor="modal-email" className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                    Email Address
                  </Label>
                  <input
                    type="email"
                    id="modal-email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg text-gray-900 mt-3 text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <Label htmlFor="modal-department" className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                    Department
                  </Label>
                  <Select>
                    <SelectTrigger 
                      className="w-full !h-[56px]  sm:h-14 px-3 border border-gray-300 rounded-lg text-gray-900 mt-3"
                    >
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical-support">Technical Support Department</SelectItem>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="it-support">IT Support</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="modal-role" className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger 
                      className="w-full !h-[56px] sm:h-14 px-3 border border-gray-300 rounded-lg text-gray-900 mt-3"
                    >
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT Support">IT Support</SelectItem>
                      <SelectItem value="Support Team">Support Team</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="KYC Initiator">KYC Initiator</SelectItem>
                      <SelectItem value="KYC Supervisor">KYC Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="modal-phone" className="text-xs sm:text-sm font-medium text-[#464646] font-[family-name:var(--font-poppins)]">
                    Phone Number
                  </Label>
                  <input
                    type="text"
                    id="modal-phone"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full h-12 sm:h-14 pt-3 sm:pt-4 pr-3 pb-3 sm:pb-4 pl-3 border border-gray-300 rounded-lg focus:border-blue-500 text-gray-900 mt-3 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-center sm:justify-end pt-2 sm:pt-4">
                <Button
                  onClick={handleUpdate}
                  className="bg-[#0284B2] hover:bg-[#0284B2]/90 text-white font-[family-name:var(--font-poppins)] px-6 sm:px-8 h-12 sm:h-14 rounded-lg text-sm sm:text-base w-full sm:w-auto"
                >
                  Update Information
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}
