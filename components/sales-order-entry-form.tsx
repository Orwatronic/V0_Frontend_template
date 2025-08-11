"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, User, Building, Mail, Phone, MapPin, CreditCard, PlusCircle, Trash2, X, Package, Truck, DollarSign } from 'lucide-react'
import { Badge } from "./ui/badge"

// Mock data matching backend schemas
const mockCustomers = [
  {
    id: "CUST001",
    name: "TechCorp Solutions",
    email: "billing@techcorp.com",
    phone: "+1-555-0123",
    creditLimit: 100000,
    creditUsed: 45000,
    creditStatus: "approved",
    shippingAddress: "123 Business Ave, New York, NY 10001",
    billingAddress: "123 Business Ave, New York, NY 10001",
  },
  {
    id: "CUST002",
    name: "Retail Plus Inc",
    email: "accounts@retailplus.com",
    phone: "+1-555-0124",
    creditLimit: 75000,
    creditUsed: 72000,
    creditStatus: "warning",
    shippingAddress: "456 Commerce St, Los Angeles, CA 90210",
    billingAddress: "456 Commerce St, Los Angeles, CA 90210",
  },
  {
    id: "CUST003",
    name: "Global Tech Ltd",
    email: "finance@globaltech.com",
    phone: "+1-555-0125",
    creditLimit: 150000,
    creditUsed: 89000,
    creditStatus: "approved",
    shippingAddress: "789 Innovation Blvd, San Francisco, CA 94105",
    billingAddress: "789 Innovation Blvd, San Francisco, CA 94105",
  },
]

const mockProducts = [
  {
    id: "PROD001",
    name: "Quantum Processor X1",
    sku: "QP-X1-2024",
    price: 2500,
    stock: 150,
    availability: "available",
  },
  {
    id: "PROD002",
    name: "HyperCore RAM 32GB",
    sku: "HC-RAM-32G",
    price: 350,
    stock: 500,
    availability: "available",
  },
  {
    id: "PROD003",
    name: "Photon SSD 2TB",
    sku: "PH-SSD-2TB",
    price: 450,
    stock: 30,
    availability: "low_stock",
  },
  {
    id: "PROD004",
    name: "Titan-V Graphics Card",
    sku: "TV-GPU-V1",
    price: 4200,
    stock: 0,
    availability: "unavailable",
  },
]

type Customer = typeof mockCustomers[0]
type Product = typeof mockProducts[0]
type OrderItem = {
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
  availabilityStatus: "available" | "low_stock" | "unavailable" | "checking"
}

export function SalesOrderEntryForm() {
  const [customerSearch, setCustomerSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [productSearch, setProductSearch] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [shippingMethod, setShippingMethod] = useState("standard")

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return []
    return mockCustomers.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase())
    )
  }, [customerSearch])

  const filteredProducts = useMemo(() => {
    if (!productSearch) return []
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
    )
  }, [productSearch])

  const handleSelectCustomer = (customer: Customer) => {
    // CURSOR: API call to GET /api/v1/sales/customers/search?q={customer.id}
    setSelectedCustomer(customer)
    setCustomerSearch("")
  }

  const handleAddProduct = (product: Product) => {
    // CURSOR: API call to POST /api/v1/sales/check-availability with { productId: product.id, quantity: 1 }
    // CURSOR: API call to POST /api/v1/sales/simulate-pricing with { customerId: selectedCustomer.id, productId: product.id, quantity: 1 }
    const existingItem = orderItems.find(item => item.product.id === product.id)
    if (existingItem) {
      updateItemQuantity(product.id, existingItem.quantity + 1)
    } else {
      setOrderItems([
        ...orderItems,
        {
          product,
          quantity: 1,
          unitPrice: product.price,
          totalPrice: product.price,
          availabilityStatus: product.availability as OrderItem['availabilityStatus'],
        },
      ])
    }
    setProductSearch("")
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setOrderItems(
      orderItems.map(item =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      )
    )
  }

  const removeItem = (productId: string) => {
    setOrderItems(orderItems.filter(item => item.product.id !== productId))
  }

  const subtotal = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.totalPrice, 0)
  }, [orderItems])

  const shippingCost = useMemo(() => {
    if (orderItems.length === 0) return 0
    return shippingMethod === "express" ? 50 : 15
  }, [shippingMethod, orderItems])

  const taxAmount = useMemo(() => {
    return (subtotal + shippingCost) * 0.08 // 8% tax
  }, [subtotal, shippingCost])

  const grandTotal = useMemo(() => {
    return subtotal + shippingCost + taxAmount
  }, [subtotal, shippingCost, taxAmount])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCreditStatusBadge = (status: string) => {
    const config = {
      approved: { color: "bg-green-100 text-green-700", label: "Approved" },
      warning: { color: "bg-yellow-100 text-yellow-700", label: "Warning" },
      rejected: { color: "bg-red-100 text-red-700", label: "Rejected" },
    }
    const { color, label } = config[status as keyof typeof config] || { color: "bg-gray-100", label: "Unknown" }
    return <Badge className={`${color} border-0`}>{label}</Badge>
  }

  const getAvailabilityBadge = (status: OrderItem['availabilityStatus']) => {
    const config = {
      available: { color: "bg-green-100 text-green-700", label: "Available" },
      low_stock: { color: "bg-yellow-100 text-yellow-700", label: "Low Stock" },
      unavailable: { color: "bg-red-100 text-red-700", label: "Unavailable" },
      checking: { color: "bg-blue-100 text-blue-700", label: "Checking..." },
    }
    const { color, label } = config[status]
    return <Badge className={`${color} border-0`}>{label}</Badge>
  }

  const handleSubmitOrder = () => {
    // CURSOR: API call to POST /api/v1/sales/orders
    const orderPayload = {
      customerId: selectedCustomer?.id,
      items: orderItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      shippingMethod,
      subtotal,
      shippingCost,
      taxAmount,
      grandTotal,
    }
    console.log("Submitting Order:", orderPayload)
    // Here you would typically close the dialog and show a success toast
  }

  return (
    <DialogContent className="max-w-6xl">
      <DialogHeader>
        <DialogTitle>New Sales Order</DialogTitle>
        <DialogDescription>
          Create a new sales order by selecting a customer and adding products.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4 max-h-[75vh] overflow-y-auto pr-2">
        {/* Left Column: Customer and Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedCustomer ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search for a customer..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-10"
                  />
                  {filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                      {filteredCustomers.map(customer => (
                        <div
                          key={customer.id}
                          className="p-2 hover:bg-accent cursor-pointer"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg flex items-center gap-2"><Building className="w-5 h-5 text-muted-foreground" /> {selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" /> {selectedCustomer.email}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4" /> {selectedCustomer.phone}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedCustomer(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-sm space-y-2">
                    <p className="font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> Shipping Address</p>
                    <p className="text-muted-foreground pl-6">{selectedCustomer.shippingAddress}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-medium flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted-foreground" /> Credit Status</p>
                    <div className="flex justify-between items-center mt-2 pl-6">
                      {getCreditStatusBadge(selectedCustomer.creditStatus)}
                      <p className="text-sm text-muted-foreground">{formatCurrency(selectedCustomer.creditUsed)} / {formatCurrency(selectedCustomer.creditLimit)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label htmlFor="shipping-method" className="text-muted-foreground">Shipping</Label>
                <Select value={shippingMethod} onValueChange={setShippingMethod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
                <span>{formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Search for products and add them to the order.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by product name or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10"
                  disabled={!selectedCustomer}
                />
                {filteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                    {filteredProducts.map(product => (
                      <div
                        key={product.id}
                        className="p-2 hover:bg-accent cursor-pointer flex justify-between items-center"
                        onClick={() => handleAddProduct(product)}
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(product.price)}</p>
                          {getAvailabilityBadge(product.availability as OrderItem['availabilityStatus'])}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Product</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.length > 0 ? (
                      orderItems.map(item => (
                        <TableRow key={item.product.id}>
                          <TableCell>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                          </TableCell>
                          <TableCell>{getAvailabilityBadge(item.availabilityStatus)}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.product.id, parseInt(e.target.value))}
                              className="w-20 h-8"
                              min="1"
                            />
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.product.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                          No products added yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Save as Draft</Button>
        <Button onClick={handleSubmitOrder} disabled={!selectedCustomer || orderItems.length === 0}>
          Submit Order
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
