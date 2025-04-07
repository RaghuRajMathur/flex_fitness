
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search,
  MoreHorizontal, 
  Eye, 
  ShoppingCart,
  PackageCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string | null;
  };
}

const OrderStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "processing":
      return <Badge className="bg-blue-500">Processing</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case "pending":
    default:
      return <Badge className="bg-yellow-500">Pending</Badge>;
  }
};

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["orders", searchQuery],
    queryFn: async () => {
      // First, get all orders
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
        
      const { data: ordersData, error: ordersError } = await query;
      if (ordersError) throw ordersError;
      
      // Then, for each order, fetch the associated profile
      const processedOrders = await Promise.all(
        (ordersData || []).map(async (order) => {
          if (!order.user_id) {
            return { ...order, profiles: null };
          }
          
          let profileQuery = supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", order.user_id)
            .single();
            
          // Apply search filter if provided
          if (searchQuery) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("first_name, last_name")
              .eq("id", order.user_id)
              .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
              .single();
              
            if (profileError || !profileData) {
              return null; // Skip this order if it doesn't match search
            }
            
            return { ...order, profiles: profileData };
          } else {
            const { data: profileData, error: profileError } = await profileQuery;
            return { 
              ...order, 
              profiles: profileError ? null : profileData 
            };
          }
        })
      );
      
      // Filter out null values (orders that didn't match search)
      const filteredOrders = processedOrders.filter(Boolean) as Order[];
      return filteredOrders;
    }
  });
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('order-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, (payload) => {
        console.log('Order change received!', payload);
        refetch();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);
  
  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          *,
          products:product_id (
            name,
            image_url
          )
        `)
        .eq("order_id", orderId);
        
      if (error) throw error;
      
      setOrderItems(data || []);
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast.error("Error fetching order details");
    }
  };
  
  const viewOrderDetails = (order: Order) => {
    setViewingOrder(order);
    fetchOrderItems(order.id);
    setShowOrderDetails(true);
  };
  
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
        
      if (error) throw error;
      
      toast.success(`Order status updated to ${status}`);
      
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder({
          ...viewingOrder,
          status
        });
      }
      
      refetch();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Error updating order status");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders by customer name..."
              className="w-full pl-8 sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ShoppingCart className="h-10 w-10 mb-2" />
                      <h3 className="font-medium text-lg">No orders found</h3>
                      <p className="text-sm">
                        {searchQuery 
                          ? "Try a different search term" 
                          : "Orders will appear here after customers make purchases"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      {order.profiles?.first_name || 'Unknown'} {order.profiles?.last_name || 'User'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}>
                            <PackageCheck className="mr-2 h-4 w-4 text-blue-500" />
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "completed")}>
                            <PackageCheck className="mr-2 h-4 w-4 text-green-500" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "cancelled")}>
                            <PackageCheck className="mr-2 h-4 w-4 text-red-500" />
                            Mark Cancelled
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Order Details
              {viewingOrder && <span className="ml-2">#{viewingOrder.id.substring(0, 8)}</span>}
            </DialogTitle>
          </DialogHeader>
          
          {viewingOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Customer</h3>
                  <p>{viewingOrder.profiles?.first_name || 'Unknown'} {viewingOrder.profiles?.last_name || 'User'}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Status</h3>
                  <div className="flex items-center space-x-3">
                    <OrderStatusBadge status={viewingOrder.status} />
                    
                    <Select
                      value={viewingOrder.status}
                      onValueChange={(value) => updateOrderStatus(viewingOrder.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Order Date</h3>
                  <p>{format(new Date(viewingOrder.created_at), "MMM d, yyyy, h:mm a")}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Total Amount</h3>
                  <p className="text-lg font-semibold">${viewingOrder.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Order Items</h3>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {item.products.image_url ? (
                                <div 
                                  className="h-10 w-10 rounded-md bg-cover bg-center bg-no-repeat"
                                  style={{ backgroundImage: `url(${item.products.image_url})` }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                  <ShoppingCart className="h-5 w-5 text-primary" />
                                </div>
                              )}
                              <span>{item.products.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
