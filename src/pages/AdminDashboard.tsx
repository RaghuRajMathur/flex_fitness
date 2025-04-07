
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  created_at: string;
  image_url: string | null;
}

interface OrderWithProfile {
  id: string;
  status: string;
  total: number;
  created_at: string;
  user_id: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const AdminDashboard = () => {
  const { data: productsCount = 0, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["productsCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: usersCount = 0, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["usersCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: ordersCount = 0, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["ordersCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingProducts ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                ) : (
                  productsCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Items in your inventory
              </p>
            </CardContent>
            <Link 
              to="/admin/products"
              className="absolute inset-0 rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="View products"
            >
              <span className="sr-only">View products</span>
            </Link>
            <div className="absolute bottom-2 right-2">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingUsers ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                ) : (
                  usersCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
            <Link 
              to="/admin/users"
              className="absolute inset-0 rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="View users"
            >
              <span className="sr-only">View users</span>
            </Link>
            <div className="absolute bottom-2 right-2">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingOrders ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
                ) : (
                  ordersCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Processed orders
              </p>
            </CardContent>
            <Link 
              to="/admin/orders"
              className="absolute inset-0 rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="View orders"
            >
              <span className="sr-only">View orders</span>
            </Link>
            <div className="absolute bottom-2 right-2">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentProducts />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentOrders />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

const RecentProducts = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["recentProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded bg-muted"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">No products found.</p>;
  }

  return (
    <div className="space-y-2">
      {products.map((product: Product) => (
        <div
          key={product.id}
          className="flex items-center gap-3 rounded-md border p-3"
        >
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              ${product.price} - {product.stock} in stock
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentOrders = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: async () => {
      // First fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (ordersError) throw ordersError;
      
      // Then fetch profiles for those orders
      const orderResults = await Promise.all(
        (ordersData || []).map(async (order) => {
          if (!order.user_id) {
            return { ...order, profiles: null };
          }
          
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", order.user_id)
            .single();
            
          return {
            ...order,
            profiles: profileError ? null : profileData
          };
        })
      );
      
      return orderResults as OrderWithProfile[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded bg-muted"></div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">No orders found.</p>;
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center gap-3 rounded-md border p-3"
        >
          <div 
            className={`h-10 w-10 rounded-md flex items-center justify-center ${
              order.status === 'completed' 
                ? 'bg-green-100 text-green-600' 
                : order.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'bg-red-100 text-red-600'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {order.profiles?.first_name || 'Unknown'} {order.profiles?.last_name || 'User'}
            </p>
            <p className="text-sm text-muted-foreground">
              ${order.total} - {order.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
