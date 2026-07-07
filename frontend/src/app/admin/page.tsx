'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  ClipboardList,
  Users,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Clock,
  Truck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

// Fetch admin dashboard details
const fetchDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data.data;
};

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  processing: { label: 'Processing', icon: TrendingUp, className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  shipped: { label: 'Shipped', icon: Truck, className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  delivered: { label: 'Delivered', icon: PackageCheck, className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 bg-muted rounded-3xl" />
          <div className="h-96 bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-3xl text-center text-red-500">
        <h2 className="text-lg font-bold mb-2">Error Loading Dashboard</h2>
        <p className="text-sm text-red-500/80">{(error as any).message || 'Something went wrong.'}</p>
      </div>
    );
  }

  const { totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders, monthlyRevenue } = data;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Console Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time store overview, revenue metrics, and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-background border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</span>
            <div className="h-9 w-9 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{formatPrice(totalRevenue || 0)}</h3>
            <p className="text-xs text-muted-foreground mt-1">Life-time store sales revenue</p>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-background border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Orders</span>
            <div className="h-9 w-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{totalOrders || 0}</h3>
            <p className="text-xs text-muted-foreground mt-1">Product orders placed by customers</p>
          </div>
        </motion.div>

        {/* Total Products */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-background border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Products</span>
            <div className="h-9 w-9 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{totalProducts || 0}</h3>
            <p className="text-xs text-muted-foreground mt-1">Products currently in catalog</p>
          </div>
        </motion.div>

        {/* Total Users */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-background border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Customers</span>
            <div className="h-9 w-9 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{totalUsers || 0}</h3>
            <p className="text-xs text-muted-foreground mt-1">Registered customer accounts</p>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sales Chart (Visual representation using bars) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border border-border rounded-3xl p-6 shadow-sm lg:col-span-7 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-bold text-foreground">Sales Performance</h2>
            <p className="text-xs text-muted-foreground">Monthly breakdown of store revenue and orders</p>
          </div>

          <div className="mt-6 flex items-end justify-between h-48 px-2">
            {monthlyRevenue?.length > 0 ? (
              monthlyRevenue.map((item: any, idx: number) => {
                const maxRevenue = Math.max(...monthlyRevenue.map((m: any) => m.revenue), 1);
                const heightPercentage = Math.min((item.revenue / maxRevenue) * 100, 100);
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                    <div className="w-full max-w-[24px] bg-muted hover:bg-[var(--brand-red)] rounded-t-lg transition-colors relative flex items-end h-32">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                        className="w-full bg-[var(--brand-red)] rounded-t-lg group-hover:bg-[var(--brand-red-dark)] transition-colors relative"
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-foreground text-background text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                          {formatPrice(item.revenue)} ({item.orders} orders)
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">{item._id}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground h-full">
                No revenue records found yet.
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border border-border rounded-3xl p-6 shadow-sm lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-bold text-foreground font-heading">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Manage your store resources instantly</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Link
              href="/admin/products"
              className="h-24 border border-border rounded-2xl flex flex-col items-center justify-center hover:bg-muted/40 transition-colors gap-2"
            >
              <ShoppingBag className="h-5 w-5 text-[var(--brand-red)]" />
              <span className="text-xs font-semibold">Add Footwear</span>
            </Link>
            <Link
              href="/admin/orders"
              className="h-24 border border-border rounded-2xl flex flex-col items-center justify-center hover:bg-muted/40 transition-colors gap-2"
            >
              <ClipboardList className="h-5 w-5 text-blue-500" />
              <span className="text-xs font-semibold">Manage Orders</span>
            </Link>
            <Link
              href="/admin/coupons"
              className="h-24 border border-border rounded-2xl flex flex-col items-center justify-center hover:bg-muted/40 transition-colors gap-2"
            >
              <Ticket className="h-5 w-5 text-orange-500" />
              <span className="text-xs font-semibold">Create Coupons</span>
            </Link>
            <Link
              href="/admin/users"
              className="h-24 border border-border rounded-2xl flex flex-col items-center justify-center hover:bg-muted/40 transition-colors gap-2"
            >
              <Users className="h-5 w-5 text-purple-500" />
              <span className="text-xs font-semibold">Customers</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background border border-border rounded-3xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
            <p className="text-xs text-muted-foreground">View and check incoming orders</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-red)] hover:underline"
          >
            Manage Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Order No</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 pr-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.length > 0 ? (
                recentOrders.map((order: any) => {
                  const status = (order.status || 'pending').toLowerCase();
                  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = config.icon;

                  return (
                    <tr key={order._id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-4 pl-2 font-mono font-bold text-xs text-muted-foreground">
                        #{order.orderNumber || order._id.substring(0, 8)}
                      </td>
                      <td className="py-4">
                        <div className="font-semibold text-foreground">{order.user?.name || 'Guest User'}</div>
                        <div className="text-xs text-muted-foreground">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                            order.isPaid
                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                              : 'bg-red-500/10 text-red-500 border-red-500/20'
                          )}
                        >
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                            config.className
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 pr-2 text-right font-bold text-foreground">
                        {formatPrice(order.totalPrice)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
