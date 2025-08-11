"use client"

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, FileDown, FileUp, PlusCircle, Filter, X, CheckCircle, Clock, AlertCircle, Globe, Phone, Mail, Building, DollarSign, FileText, Users } from 'lucide-react'

// Mock Data - Replace with API calls
// CURSOR: API call to GET /api/v1/mdm/customers
const mockCustomers = [
  { id: 'C001', name: 'Innovate Corp', type: 'Enterprise', status: 'active', country: 'USA', creditLimit: 500000, approvalStatus: 'approved', created: '2023-01-15' },
  { id: 'C002', name: 'Quantum Solutions', type: 'SME', status: 'active', country: 'Germany', creditLimit: 150000, approvalStatus: 'approved', created: '2023-02-20' },
  { id: 'C003', name: 'Apex Industries', type: 'Enterprise', status: 'pending', country: 'Japan', creditLimit: 1000000, approvalStatus: 'pending', created: '2023-03-10' },
  { id: 'C004', name: 'Synergy Partners', type: 'SME', status: 'inactive', country: 'UK', creditLimit: 50000, approvalStatus: 'approved', created: '2022-11-05' },
  { id: 'C005', name: 'Starlight Ventures', type: 'Startup', status: 'active', country: 'Canada', creditLimit: 75000, approvalStatus: 'approved', created: '2023-04-01' },
  { id: 'C006', name: 'Horizon Logistics', type: 'Enterprise', status: 'rejected', country: 'USA', creditLimit: 0, approvalStatus: 'rejected', created: '2023-05-12' },
];

// CURSOR: API call to GET /api/v1/mdm/customers/{id}/details
const mockCustomerDetails = {
  general: { id: 'C001', name: 'Innovate Corp', type: 'Enterprise', industry: 'Technology', taxId: 'US123456789' },
  contacts: [{ id: 1, name: 'Jane Doe', role: 'CEO', email: 'jane.doe@innovate.com', phone: '123-456-7890' }],
  addresses: [{ id: 1, type: 'Billing', line1: '123 Tech Ave', city: 'Palo Alto', state: 'CA', zip: '94301', country: 'USA' }],
  financial: { creditLimit: 500000, paymentTerms: 'NET 30', currency: 'USD', bankName: 'Bank of America' },
  documents: [{ id: 1, name: 'Master Service Agreement.pdf', type: 'Contract', uploaded: '2023-01-15' }],
  history: [{ id: 1, user: 'admin', action: 'Created Record', timestamp: '2023-01-15 10:00:00' }],
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants: { [key: string]: { className: string, icon: React.ReactNode } } = {
    active: { className: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
    pending: { className: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
    inactive: { className: 'bg-gray-100 text-gray-800', icon: <X className="h-3 w-3" /> },
    rejected: { className: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-3 w-3" /> },
  }
  const variant = variants[status] || variants.inactive;
  return <Badge variant="outline" className={`border-transparent ${variant.className}`}><span className="mr-1">{variant.icon}</span> {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export const CustomerMaster = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'all' || customer.status === filters.status;
      const matchesType = filters.type === 'all' || customer.type === filters.type;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [customers, searchTerm, filters]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? filteredCustomers.map(c => c.id) : []);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const openDetailsSheet = (customer: any) => {
    // CURSOR: API call to GET /api/v1/mdm/customers/{customer.id}
    setSelectedCustomer({ ...customer, ...mockCustomerDetails });
    setIsSheetOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2" /> Customer Master Data
        </CardTitle>
        <CardDescription>Manage and maintain all customer records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-8 w-full md:w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filters.status} onValueChange={value => setFilters(f => ({ ...f, status: value }))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.type} onValueChange={value => setFilters(f => ({ ...f, type: value }))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="SME">SME</SelectItem>
                  <SelectItem value="Startup">Startup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><FileUp className="mr-2 h-4 w-4" /> Import</Button>
              <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
              <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Customer</Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox checked={selectedRows.length === filteredCustomers.length && filteredCustomers.length > 0} onCheckedChange={handleSelectAll} />
                  </TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map(customer => (
                  <TableRow key={customer.id} data-state={selectedRows.includes(customer.id) ? "selected" : ""}>
                    <TableCell>
                      <Checkbox checked={selectedRows.includes(customer.id)} onCheckedChange={checked => handleRowSelect(customer.id, !!checked)} />
                    </TableCell>
                    <TableCell className="font-mono">{customer.id}</TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell><Badge variant="secondary">{customer.type}</Badge></TableCell>
                    <TableCell><StatusBadge status={customer.status} /></TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customer.creditLimit)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openDetailsSheet(customer)}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>{selectedRows.length} of {filteredCustomers.length} row(s) selected.</div>
            <div>Page 1 of 1</div>
          </div>
        </div>
      </CardContent>

      {/* Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full md:w-3/5 lg:w-2/5 xl:w-1/3 sm:max-w-none">
          {selectedCustomer && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center">{selectedCustomer.name} <StatusBadge status={selectedCustomer.status} /></SheetTitle>
                <SheetDescription>Customer ID: {selectedCustomer.id}</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <Tabs defaultValue="general">
                  <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" className="mt-4 space-y-4">
                    <p><Building className="inline mr-2 h-4 w-4" />Industry: {selectedCustomer.general.industry}</p>
                    <p><FileText className="inline mr-2 h-4 w-4" />Tax ID: {selectedCustomer.general.taxId}</p>
                  </TabsContent>
                  <TabsContent value="contacts" className="mt-4">
                    {selectedCustomer.contacts.map((c: any) => <div key={c.id}><p>{c.name} ({c.role})</p><p><Mail className="inline mr-2 h-4 w-4" />{c.email}</p><p><Phone className="inline mr-2 h-4 w-4" />{c.phone}</p></div>)}
                  </TabsContent>
                  <TabsContent value="financial" className="mt-4">
                    <p><DollarSign className="inline mr-2 h-4 w-4" />Credit Limit: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedCustomer.financial.creditLimit)}</p>
                    <p>Payment Terms: {selectedCustomer.financial.paymentTerms}</p>
                  </TabsContent>
                  <TabsContent value="history" className="mt-4">
                    {selectedCustomer.history.map((h: any) => <p key={h.id}>{h.timestamp}: {h.action} by {h.user}</p>)}
                  </TabsContent>
                </Tabs>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Close</Button>
                <Button>Save Changes</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  )
}
