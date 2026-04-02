'use client';

import { ProtectedRoute } from "@/components/protected-route";

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
