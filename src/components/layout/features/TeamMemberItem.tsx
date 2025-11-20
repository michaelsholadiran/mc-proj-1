"use client";

import React from "react";
// No need to import ChevronDown here, it's handled by shadcn's AccordionTrigger
// import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components
import Image from "next/image";

// Helper component for the circular progress/metric display
const CircularMetric = ({
  label,
  value,
  type = "percentage",
  primaryColor = "#66B2B2",
}: {
  label: string;
  value: string;
  type: string;
  primaryColor: string;
}) => {
  let displayValue = value;
  let strokeDashoffset = 0;
  const radius = 40; // SVG circle radius
  const circumference = 2 * Math.PI * radius;

  if (type === "percentage") {
    const percentageValue = parseFloat(value);
    strokeDashoffset = circumference - (percentageValue / 100) * circumference;
    displayValue = `${percentageValue}%`;
  } else if (type === "time") {
    strokeDashoffset = circumference - 0.7 * circumference; // Fixed visual for time
  } else if (type === "count") {
    strokeDashoffset = circumference - 0.8 * circumference; // Fixed visual for count
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-[#f5f5f5]" // Lighter blue for the track
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-500 ease-in-out"
            strokeWidth="8"
            stroke={primaryColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)" // Start from top
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#27B8D9"
            className="font-bold text-[12px]" // Ensure text is dark and clear
          >
            {displayValue}
          </text>
        </svg>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

const TeamMemberItem = ({
  avatarSrc,
  name,
  role,
  roleColor,
  percentage,
  value,
  averageHandlingTime = "00:35:00",
  slaMetrics = "10",
  processedRequestCount = "3",
}: {
  avatarSrc?: string;
  name: string;
  role?: string;
  roleColor?: string;
  percentage?: string;
  value?: string;
  averageHandlingTime?: string;
  slaMetrics?: string;
  processedRequestCount?: string;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-white  border rounded-[12px]"
    >
      <AccordionItem
        value={value || name.toLowerCase().replace(/\s/g, "-")}
        className="border-b-0"
      >
        <AccordionTrigger className="w-full h-auto p-0 hover:no-underline rounded-lg overflow-hidden data-[state=open]:rounded-b-none flex items-center pr-4 cursor-pointer">
          {/* Main content for the trigger */}
          <div className="flex items-center justify-between w-full p-4">
            {/* Left side: Avatar, Name, Role */}
            <div className="flex items-center gap-4">
              <Image
                width={20}
                height={20}
                src={avatarSrc ?? ""}
                alt={name}
                className="w-12 h-12 rounded-full object-cover  border-blue-200 p-[2px]"
              />
              <div>
                <p className="font-semibold text-gray-800">{name}</p>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: roleColor }}
                  ></span>
                  <span>{role}</span>
                </div>
              </div>
            </div>

            {/* Right side: Percentage and SHADCN's built-in ChevronDown */}
            {/* The AccordionTrigger will position its default icon.
                We need to wrap percentage and the icon in a flex container
                and let AccordionTrigger manage the icon's rotation. */}
            <div className="flex items-center gap-2">
              {" "}
              {/* Align percentage and icon horizontally */}
              <p className="text-xl font-bold text-gray-800 leading-none">
                {percentage}
              </p>
              {/* SHADCN's default ChevronDown is implicitly added here by AccordionTrigger.
                  We just need to make sure our outer flex containers allow it to be positioned.
                  The AccordionTrigger component itself handles adding and rotating the icon.
                  We ensure there's enough space and it's vertically centered. */}
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="p-4 bg-white rounded-b-lg border-t border-gray-100 -mt-1">
          <div className="flex justify-around items-start gap-4 flex-wrap">
            <CircularMetric
              label="Average Handling Time"
              value={averageHandlingTime ?? ""}
              type="time"
              primaryColor="#27B8D9"
            />
            <CircularMetric
              label="SLA Metrics"
              value={slaMetrics ?? ""}
              type="percentage"
              primaryColor="#27B8D9"
            />
            <CircularMetric
              label="Processed Request Count"
              value={processedRequestCount ?? ""}
              type="count"
              primaryColor="#27B8D9"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TeamMemberItem;
