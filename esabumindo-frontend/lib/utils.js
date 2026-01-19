// lib/utils.js

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generate slug from title
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Format currency to IDR
export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

// Format time
export function formatTime(time) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(time));
}

// Calculate work hours
export function calculateWorkHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const checkInTime = new Date(checkIn);
  const checkOutTime = new Date(checkOut);

  const diffMs = checkOutTime - checkInTime;
  const diffHours = diffMs / (1000 * 60 * 60);

  return Math.max(0, Number(diffHours.toFixed(2)));
}

// Calculate overtime hours
export function calculateOvertimeHours(totalHours, regularHours = 8) {
  const overtime = totalHours - regularHours;
  return Math.max(0, Number(overtime.toFixed(2)));
}

// Get shift info based on time
export function getShiftInfo(checkInTime) {
  const time = new Date(checkInTime);
  const hours = time.getHours();

  if (hours >= 6 && hours < 14) {
    return { type: "shift-1", name: "Shift 1 (06:00 - 14:00)" };
  } else if (hours >= 14 && hours < 22) {
    return { type: "shift-2", name: "Shift 2 (14:00 - 22:00)" };
  } else {
    return { type: "non-shift", name: "Non-Shift (08:00 - 16:00)" };
  }
}

// Calculate salary
export function calculateSalary(
  hourlyRate,
  workHours,
  overtimeHours,
  overtimeMultiplier = 1.5
) {
  const basicSalary = hourlyRate * workHours;
  const overtimePay = hourlyRate * overtimeHours * overtimeMultiplier;

  return {
    basicSalary: Number(basicSalary.toFixed(2)),
    overtimePay: Number(overtimePay.toFixed(2)),
    totalSalary: Number((basicSalary + overtimePay).toFixed(2)),
  };
}
