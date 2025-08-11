import { useAuth } from "@/contexts/auth-context";
import { useCallback } from "react";

// In a real enterprise app, this would be a more complex system,
// likely fetched from the backend and managed in a dedicated module.
const permissionMap: Record<string, string[]> = {
  admin: [
    "view:dashboard",
    "view:analytics",
    "view:financials",
    "view:sales",
    "view:materials",
    "view:hcm",
    "view:mdm",
    "admin:settings",
  ],
  finance_manager: [
    "view:dashboard",
    "view:analytics",
    "view:financials",
    "view:sales",
  ],
  sales_rep: [
    "view:dashboard",
    "view:sales",
  ],
  hr_manager: [
    "view:dashboard",
    "view:hcm",
  ],
  warehouse_manager: [
    "view:dashboard",
    "view:materials",
  ],
};

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = useCallback((requiredPermission: string): boolean => {
    if (!user || !user.roles) {
      return false;
    }

    // The 'admin' role has all permissions implicitly.
    if (user.roles.includes('admin')) {
      return true;
    }

    // Check if any of the user's roles grant the required permission.
    return user.roles.some(role => 
      permissionMap[role]?.includes(requiredPermission)
    );
  }, [user]);

  return { hasPermission };
};
