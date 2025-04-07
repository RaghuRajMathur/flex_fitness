
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, ShoppingBag, Heart, CreditCard, Settings, LogOut } from "lucide-react";

const AccountPage = () => {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop",
  });
  
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate profile update
    setTimeout(() => {
      setIsUpdating(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    setIsUpdating(true);
    
    // Simulate password update
    setTimeout(() => {
      setIsUpdating(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully");
    }, 1000);
  };
  
  const recentOrders = [
    {
      id: "ORD123456",
      date: "2023-06-15",
      status: "Delivered",
      total: 249.98,
      items: 2,
    },
    {
      id: "ORD123455",
      date: "2023-05-03",
      status: "Delivered",
      total: 89.99,
      items: 1,
    },
    {
      id: "ORD123454",
      date: "2023-04-18",
      status: "Cancelled",
      total: 129.99,
      items: 1,
    },
  ];
  
  return (
    <Layout>
      <div className="max-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border shadow-sm p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  My Account
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Orders & Returns
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </div>
              
              <div className="mt-8 pt-4 border-t">
                <Button variant="outline" className="w-full justify-start text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>
            
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <ShoppingBag className="h-5 w-5 mr-2 text-muted-foreground" />
                      <h3 className="font-semibold">Orders</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">{recentOrders.length}</p>
                    <p className="text-sm text-muted-foreground">Total orders</p>
                  </div>
                  
                  <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <Heart className="h-5 w-5 mr-2 text-muted-foreground" />
                      <h3 className="font-semibold">Favorites</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">5</p>
                    <p className="text-sm text-muted-foreground">Liked products</p>
                  </div>
                  
                  <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex items-center mb-4">
                      <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                      <h3 className="font-semibold">Spent</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">$469.96</p>
                    <p className="text-sm text-muted-foreground">Total spent</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2 font-medium">Order</th>
                          <th className="pb-2 font-medium">Date</th>
                          <th className="pb-2 font-medium">Status</th>
                          <th className="pb-2 font-medium">Total</th>
                          <th className="pb-2 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id} className="border-b last:border-0">
                            <td className="py-3 pr-4">
                              <div>
                                <span className="font-medium">{order.id}</span>
                                <span className="text-xs text-muted-foreground block mt-1">
                                  {order.items} {order.items === 1 ? "item" : "items"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 pr-4 font-medium">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="py-3">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Orders
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Order History</h3>
                  
                  <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b">
                              <th className="pb-2 font-medium">Order</th>
                              <th className="pb-2 font-medium">Date</th>
                              <th className="pb-2 font-medium">Status</th>
                              <th className="pb-2 font-medium">Total</th>
                              <th className="pb-2 font-medium">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentOrders.map(order => (
                              <tr key={order.id} className="border-b last:border-0">
                                <td className="py-3 pr-4">
                                  <div>
                                    <span className="font-medium">{order.id}</span>
                                    <span className="text-xs text-muted-foreground block mt-1">
                                      {order.items} {order.items === 1 ? "item" : "items"}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 pr-4">
                                  {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="py-3 pr-4">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-3 pr-4 font-medium">
                                  ${order.total.toFixed(2)}
                                </td>
                                <td className="py-3">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't placed any orders yet.
                        </p>
                        <Button asChild>
                          <a href="/products">Shop Now</a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  
                  <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={profileForm.address}
                          onChange={handleProfileChange}
                          placeholder="Street address"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={profileForm.city}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={profileForm.state}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={profileForm.zipCode}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </div>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Change Password"}
                    </Button>
                  </form>
                </div>
                
                <div className="bg-card rounded-xl border shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Login Sessions</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start border-b pb-4">
                      <div className="mr-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Last active: {new Date().toLocaleString()}
                        </div>
                        <div className="flex text-xs space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                          <span className="text-muted-foreground">
                            Chrome on Windows
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-4" size="sm">
                    Sign Out of All Devices
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
