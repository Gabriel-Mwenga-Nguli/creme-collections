
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListOrdered, FileText } from 'lucide-react';
import Link from 'next/link';

const mockOrders = [
  { id: 'ORD746352', date: 'June 20, 2024', status: 'Delivered', total: 15498 },
  { id: 'ORD741988', date: 'June 15, 2024', status: 'Shipped', total: 2499 },
  { id: 'ORD739812', date: 'June 1, 2024', status: 'Delivered', total: 850 },
  { id: 'ORD735110', date: 'May 25, 2024', status: 'Cancelled', total: 3200 },
];

const statusVariantMap = {
  Delivered: 'default',
  Shipped: 'secondary',
  Processing: 'outline',
  Pending: 'outline',
  Cancelled: 'destructive',
} as const;


export default function OrdersPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
            <ListOrdered className="mr-2 h-5 w-5 text-primary" /> My Orders
        </CardTitle>
        <CardDescription>View your order history and track current orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[order.status as keyof typeof statusVariantMap] || 'default'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">KES {order.total.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                   <Button asChild variant="outline" size="sm">
                       <Link href={`/profile/orders/${order.id}`}>
                         <FileText className="mr-2 h-4 w-4" /> View
                       </Link>
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
