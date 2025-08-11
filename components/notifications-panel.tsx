"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, AlertTriangle, Info, FileText } from 'lucide-react'

// CURSOR: API call to GET /api/v1/notifications
const mockNotifications = [
  {
    id: "1",
    type: "approval",
    title: "Expense Report Approved",
    description: "Your expense report #ER-2024-08-15 for $542.50 has been approved.",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "alert",
    title: "Low Stock Warning",
    description: "Inventory for item #MAT-0012 (Micro-actuator) is below the threshold.",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "System Maintenance",
    description: "Scheduled maintenance will occur on Aug 10, 2025, from 2:00 AM to 3:00 AM.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "report",
    title: "Q2 Financial Report Ready",
    description: "The quarterly financial summary for Q2 2025 is now available for download.",
    timestamp: "3 days ago",
    read: true,
  },
]

const notificationIcons = {
  approval: <Check className="h-5 w-5 text-green-500" />,
  alert: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  report: <FileText className="h-5 w-5 text-gray-500" />,
}

type Notification = typeof mockNotifications[0];

export function NotificationsPanel({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have {unreadCount} unread messages.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <div className="flex flex-col gap-4 py-4">
            {mockNotifications.map((notification: Notification) => (
              <div key={notification.id} className="flex items-start gap-4 pr-2">
                <div className="mt-1">
                  {notificationIcons[notification.type as keyof typeof notificationIcons]}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{notification.timestamp}</p>
                </div>
                {!notification.read && (
                  <div className="mt-1">
                    <Badge className="h-2 w-2 p-0 bg-blue-500"></Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <SheetFooter>
          <Button variant="outline" className="w-full">Mark all as read</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
