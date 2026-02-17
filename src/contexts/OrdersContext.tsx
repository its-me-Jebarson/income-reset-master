import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Order, OrderStatus } from "@/hooks/useOrders";

const initialOrders: Order[] = [
  {
    id: "1", orderNumber: 1044, table: "Table 3", tableNumber: 3, status: "delayed", isRush: true, category: "grill",
    items: [
      { id: "i1", name: "Ribeye Steak", quantity: 1, prepTime: 18, notes: ["Medium-rare"], completed: false },
      { id: "i2", name: "Caesar Salad", quantity: 1, prepTime: 5, completed: false },
      { id: "i3", name: "Garlic Bread", quantity: 2, prepTime: 4, completed: false },
    ],
    createdAt: new Date(), elapsedMinutes: 34, totalPrice: 68.50,
  },
  {
    id: "2", orderNumber: 1049, table: "Table 9", tableNumber: 9, status: "delayed", isRush: false, category: "grill",
    items: [
      { id: "i4", name: "Grilled Salmon", quantity: 1, prepTime: 15, notes: ["Gluten-free"], completed: false },
    ],
    createdAt: new Date(), elapsedMinutes: 22, totalPrice: 34.00,
  },
  {
    id: "3", orderNumber: 1043, customerName: "Sarah M.", status: "delayed", isRush: false, category: "drinks",
    items: [
      { id: "i5", name: "Mango Smoothie", quantity: 3, prepTime: 4, completed: false },
      { id: "i6", name: "Espresso Martini", quantity: 1, prepTime: 3, completed: false },
    ],
    createdAt: new Date(), elapsedMinutes: 20, totalPrice: 42.00,
  },
  {
    id: "4", orderNumber: 1045, table: "Table 12", tableNumber: 12, status: "delayed", isRush: false, category: "desserts",
    items: [
      { id: "i7", name: "Chocolate Lava Cake", quantity: 2, prepTime: 10, completed: false },
      { id: "i8", name: "Crème Brûlée", quantity: 1, prepTime: 8, completed: false },
    ],
    createdAt: new Date(), elapsedMinutes: 18, totalPrice: 45.00,
  },
  {
    id: "5", orderNumber: 1048, table: "Table 5", tableNumber: 5, status: "delayed", isRush: false, category: "desserts",
    items: [
      { id: "i9", name: "Tiramisu", quantity: 1, prepTime: 5, completed: false },
      { id: "i10", name: "Cappuccino", quantity: 2, prepTime: 3, completed: false },
    ],
    createdAt: new Date(), elapsedMinutes: 12, totalPrice: 28.00,
  },
  {
    id: "6", orderNumber: 1047, source: "DoorDash #882", status: "new", isRush: true, category: "grill",
    items: [
      { id: "i11", name: "BBQ Chicken Wings", quantity: 3, prepTime: 14, completed: false },
      { id: "i12", name: "Coleslaw", quantity: 2, prepTime: 3, completed: false },
    ],
    createdAt: new Date(), elapsedMinutes: 13, totalPrice: 52.00,
  },
  {
    id: "7", orderNumber: 1042, table: "Table 7", tableNumber: 7, status: "new", isRush: false, category: "grill",
    items: [
      { id: "i13", name: "Wagyu Burger", quantity: 2, prepTime: 12, notes: ["No onions", "Extra cheese"], completed: false },
      { id: "i14", name: "Truffle Fries", quantity: 1, prepTime: 6, completed: false },
    ],
    createdAt: new Date(), elapsedMinutes: 14, totalPrice: 78.00,
  },
  {
    id: "8", orderNumber: 1046, customerName: "Mike D.", status: "ready", isRush: false, category: "drinks",
    items: [
      { id: "i15", name: "Iced Latte", quantity: 2, prepTime: 3, completed: true },
    ],
    createdAt: new Date(), elapsedMinutes: 22, totalPrice: 14.00,
  },
];

interface OrdersContextValue {
  orders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];
  stats: {
    totalIncome: number;
    avgPrep: string;
    completed: number;
    active: number;
    delayed: number;
    peak: string;
    efficiency: number;
  };
  categoryCounts: Record<string, number>;
  advanceOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  toggleItemComplete: (orderId: string, itemId: string) => void;
  addOrder: (order: Omit<Order, "id">) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const markCompleted = useCallback((order: Order) => {
    setCompletedCount(c => c + 1);
    setTotalIncome(inc => inc + order.totalPrice);
  }, []);

  const advanceOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const nextStatus: Record<string, OrderStatus> = {
        new: "preparing",
        delayed: "preparing",
        preparing: "ready",
        ready: "completed",
      };
      const newStatus = nextStatus[order.status] || order.status;
      if (newStatus === "completed" && order.status !== "completed") {
        setTimeout(() => markCompleted(order), 0);
      }
      return { ...order, status: newStatus };
    }));
  }, [markCompleted]);

  const completeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      if (order.status !== "completed") {
        setTimeout(() => markCompleted(order), 0);
      }
      return { ...order, status: "completed" as OrderStatus };
    }));
  }, [markCompleted]);

  const toggleItemComplete = useCallback((orderId: string, itemId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        items: order.items.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
      };
    }));
  }, []);

  const addOrder = useCallback((newOrder: Omit<Order, "id">) => {
    setOrders(prev => [...prev, { ...newOrder, id: crypto.randomUUID() }]);
  }, []);

  const activeOrders = useMemo(() => orders.filter(o => o.status !== "completed"), [orders]);
  const completedOrders = useMemo(() => orders.filter(o => o.status === "completed"), [orders]);
  const delayedCount = useMemo(() => orders.filter(o => o.status === "delayed").length, [orders]);

  const stats = useMemo(() => ({
    totalIncome,
    avgPrep: "11.4m",
    completed: completedCount,
    active: activeOrders.length,
    delayed: delayedCount,
    peak: "12:00 PM",
    efficiency: 92,
  }), [totalIncome, completedCount, activeOrders.length, delayedCount]);

  const categoryCounts = useMemo(() => ({
    all: activeOrders.length,
    grill: activeOrders.filter(o => o.category === "grill").length,
    drinks: activeOrders.filter(o => o.category === "drinks").length,
    desserts: activeOrders.filter(o => o.category === "desserts").length,
    salads: activeOrders.filter(o => o.category === "salads").length,
  }), [activeOrders]);

  return (
    <OrdersContext.Provider value={{ orders, activeOrders, completedOrders, stats, categoryCounts, advanceOrder, completeOrder, toggleItemComplete, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrdersContext() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrdersContext must be used within OrdersProvider");
  return ctx;
}
