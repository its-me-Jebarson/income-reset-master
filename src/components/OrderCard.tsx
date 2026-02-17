import { Clock, AlertTriangle, ChevronRight, CheckCircle2, DollarSign } from "lucide-react";
import type { Order } from "@/hooks/useOrders";
import { foodImages } from "@/data/menuData";

interface OrderCardProps {
  order: Order;
  onAdvance: (id: string) => void;
  onComplete: (id: string) => void;
  onToggleItem: (orderId: string, itemId: string) => void;
}

const statusConfig = {
  delayed: { label: "DELAYED", textClass: "text-kds-delayed", borderClass: "border-kds-border-delayed" },
  new: { label: "NEW", textClass: "text-kds-new", borderClass: "border-kds-border-new" },
  preparing: { label: "PREPARING", textClass: "text-kds-warning", borderClass: "border-kds-warning/30" },
  ready: { label: "READY", textClass: "text-kds-ready", borderClass: "border-kds-border-ready" },
  completed: { label: "COMPLETED", textClass: "text-kds-ready", borderClass: "border-kds-border-ready" },
};

const actionLabels: Record<string, string> = {
  new: "Advance to Preparing",
  delayed: "Advance to Preparing",
  preparing: "Mark as Ready",
  ready: "COMPLETED",
};

export function OrderCard({ order, onAdvance, onComplete, onToggleItem }: OrderCardProps) {
  const config = statusConfig[order.status];

  const handleAction = () => {
    if (order.status === "ready") {
      onComplete(order.id);
    } else {
      onAdvance(order.id);
    }
  };

  const location = order.table
    ? `🍴 ${order.table} T${order.tableNumber}`
    : order.customerName
    ? `👤 ${order.customerName}`
    : order.source
    ? `🚗 ${order.source}`
    : "";

  return (
    <div className={`flex flex-col rounded-lg border-2 ${config.borderClass} bg-card p-4 transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-foreground">#{order.orderNumber}</span>
          {order.isRush && (
            <span className="flex items-center gap-1 rounded-full bg-kds-delayed/20 px-2 py-0.5 text-xs font-bold text-kds-delayed">
              <AlertTriangle className="h-3 w-3" /> RUSH
            </span>
          )}
        </div>
        <span className={`text-sm font-bold ${config.textClass}`}>{config.label}</span>
      </div>

      {/* Location & Timer */}
      <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>{location}</span>
        <span className="flex items-center gap-1 font-mono">
          <Clock className="h-3.5 w-3.5" /> {order.elapsedMinutes}:45
        </span>
      </div>

      {/* Items */}
      <div className="mb-3 flex-1 space-y-2">
        {order.items.map(item => {
          const img = foodImages[item.name];
          return (
            <div key={item.id} className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <button
                  onClick={() => onToggleItem(order.id, item.id)}
                  className={`mt-0.5 h-4 w-4 rounded border transition-colors flex-shrink-0 ${
                    item.completed ? "border-kds-ready bg-kds-ready/20" : "border-muted-foreground/40"
                  }`}
                >
                  {item.completed && <CheckCircle2 className="h-4 w-4 text-kds-ready" />}
                </button>
                {img && (
                  <img src={img} alt={item.name} className="h-8 w-8 rounded object-cover flex-shrink-0" />
                )}
                <div>
                  <span className={`text-sm ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.quantity}× {item.name}
                  </span>
                  {item.notes?.map((note, i) => (
                    <p key={i} className="text-xs text-kds-warning italic">⚡ {note}</p>
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{item.prepTime}m</span>
            </div>
          );
        })}
      </div>

      {/* Price */}
      <div className="mb-3 flex items-center justify-end gap-1 text-sm font-bold text-kds-income">
        <DollarSign className="h-3.5 w-3.5" />
        {order.totalPrice.toFixed(2)}
      </div>

      {/* Action Button */}
      {order.status !== "completed" && (
        <button
          onClick={handleAction}
          className={`flex w-full items-center justify-center gap-1 rounded-md py-2.5 text-sm font-medium transition-colors ${
            order.status === "ready"
              ? "bg-kds-ready text-primary-foreground hover:bg-kds-ready/80"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          {order.status === "ready" && <CheckCircle2 className="h-4 w-4" />}
          {actionLabels[order.status]}
          {order.status !== "ready" && <ChevronRight className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
