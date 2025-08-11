"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, ChevronsRight, FileText, Plus, Search, Trash2, User, Users, DollarSign, Calendar, Truck, Building } from 'lucide-react'

const mockCatalogItems = [
{ id: "MAT001", name: "Steel Rods - Grade A", price: 45.50, unit: "KG" },
{ id: "MAT002", name: "Aluminum Sheets 2mm", price: 125.00, unit: "PCS" },
{ id: "MAT004", name: "Electronic Components Kit", price: 89.99, unit: "SET" },
{ id: "MAT005", name: "Safety Equipment Set", price: 156.25, unit: "SET" },
]

const mockVendors = [
{ id: "VEND001", name: "Steel Corp Ltd", performance: 98, leadTime: 15 },
{ id: "VEND002", name: "Aluminum Industries", performance: 95, leadTime: 12 },
{ id: "VEND003", name: "Electronics Supply Co", performance: 99, leadTime: 10 },
]

const approvalChain = [
{ name: "Alice Johnson", role: "Requestor", status: "complete" },
{ name: "Bob Williams", role: "Department Head", status: "complete" },
{ name: "Charlie Brown", role: "Finance Controller", status: "pending" },
{ name: "Diana Prince", role: "Procurement Officer", status: "upcoming" },
]

export default function ProcurementWorkflow() {
const [step, setStep] = useState(1)
const [requisition, setRequisition] = useState({
title: "",
department: "",
requestor: "Alice Johnson",
items: [],
vendor: "",
deliveryDate: "",
notes: "",
})
const [searchTerm, setSearchTerm] = useState("")

const handleInputChange = (e) => {
const { name, value } = e.target
setRequisition(prev => ({ ...prev, [name]: value }))
}

const handleSelectChange = (name, value) => {
setRequisition(prev => ({ ...prev, [name]: value }))
}

const addItem = (item) => {
const existingItem = requisition.items.find(i => i.id === item.id)
if (existingItem) {
  updateItemQuantity(item.id, existingItem.quantity + 1)
} else {
  setRequisition(prev => ({
    ...prev,
    items: [...prev.items, { ...item, quantity: 1 }]
  }))
}
}

const updateItemQuantity = (id, quantity) => {
const newQuantity = Math.max(1, quantity)
setRequisition(prev => ({
  ...prev,
  items: prev.items.map(i => i.id === id ? { ...i, quantity: newQuantity } : i)
}))
}

const removeItem = (id) => {
setRequisition(prev => ({
  ...prev,
  items: prev.items.filter(i => i.id !== id)
}))
}

const totalCost = requisition.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

const nextStep = () => setStep(s => s + 1)
const prevStep = () => setStep(s => s - 1)

const handleSubmit = () => {
// CURSOR: API call to POST /api/v1/materials/procurement/requisitions
console.log("Submitting requisition:", requisition)
alert("Purchase Requisition Submitted Successfully!")
// Reset state or close modal
}

const renderStepIndicator = () => (
<div className="flex items-center justify-center mb-8">
  {[1, 2, 3, 4].map((s, index) => (
    <>
      <div key={s} className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-muted border-border'}`}>
        {step > s ? <Check /> : s}
      </div>
      {index < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-border'}`} />}
    </>
  ))}
</div>
)

return (
<div className="p-4 space-y-6 h-full flex flex-col">
  {renderStepIndicator()}
  
  <div className="flex-grow overflow-y-auto pr-4">
    {step === 1 && (
      <Card>
        <CardHeader>
          <CardTitle>1. Basic Information</CardTitle>
          <CardDescription>Provide the essential details for this purchase requisition.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Requisition Title</Label>
            <Input id="title" name="title" value={requisition.title} onChange={handleInputChange} placeholder="e.g., Quarterly Steel Supply" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select name="department" onValueChange={(v) => handleSelectChange("department", v)}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Requestor</Label>
              <div className="flex items-center p-2 border rounded-md bg-muted">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{requisition.requestor}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )}

    {step === 2 && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>2. Add Items</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search item catalog..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCatalogItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price.toFixed(2)} / {item.unit}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => addItem(item)}><Plus className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Requisition Items</CardTitle>
          </CardHeader>
          <CardContent>
            {requisition.items.length === 0 ? (
              <p className="text-muted-foreground text-center">No items added yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisition.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Input type="number" value={item.quantity} onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))} className="w-20" />
                      </TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="font-bold text-lg flex justify-between">
            <span>Total:</span>
            <span>${totalCost.toFixed(2)}</span>
          </CardFooter>
        </Card>
      </div>
    )}

    {step === 3 && (
      <Card>
        <CardHeader>
          <CardTitle>3. Vendor & Delivery</CardTitle>
          <CardDescription>Select a vendor and specify delivery details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Select name="vendor" onValueChange={(v) => handleSelectChange("vendor", v)}>
              <SelectTrigger><SelectValue placeholder="Select a vendor" /></SelectTrigger>
              <SelectContent>
                {mockVendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    <div className="flex justify-between w-full">
                      <span>{vendor.name}</span>
                      <span className="text-muted-foreground text-xs">Perf: {vendor.performance}% / Lead: {vendor.leadTime}d</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Requested Delivery Date</Label>
            <Input id="deliveryDate" name="deliveryDate" type="date" value={requisition.deliveryDate} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Justification</Label>
            <Textarea id="notes" name="notes" value={requisition.notes} onChange={handleInputChange} placeholder="Add any special instructions or justification for this purchase." />
          </div>
        </CardContent>
      </Card>
    )}

    {step === 4 && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>4. Review & Submit</CardTitle>
            <CardDescription>Please review all details before submitting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Title:</span>
              <span>{requisition.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Department:</span>
              <span className="capitalize">{requisition.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Vendor:</span>
              <span>{mockVendors.find(v => v.id === requisition.vendor)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-muted-foreground">Delivery Date:</span>
              <span>{requisition.deliveryDate}</span>
            </div>
            <div className="font-medium text-muted-foreground">Items:</div>
            <Table>
              <TableBody>
                {requisition.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total Cost:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approval Chain</CardTitle>
            <CardDescription>This requisition will be routed for approval as follows.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {approvalChain.map((approver, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${approver.name}`} />
                    <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{approver.name}</p>
                    <p className="text-sm text-muted-foreground">{approver.role}</p>
                  </div>
                  <Badge variant={approver.status === 'complete' ? 'default' : approver.status === 'pending' ? 'secondary' : 'outline'}
                    className={approver.status === 'complete' ? 'bg-green-600' : ''}>
                    {approver.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )}
  </div>

  <div className="flex justify-between pt-4 border-t">
    <Button variant="outline" onClick={prevStep} disabled={step === 1}>Back</Button>
    {step < 4 && <Button onClick={nextStep}>Next</Button>}
    {step === 4 && <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">Submit Requisition</Button>}
  </div>
</div>
)
}
