import { LayoutGrid, Flame, Coffee, IceCream, Salad } from "lucide-react";

type CategoryKey = "all" | "grill" | "drinks" | "desserts" | "salads";

interface CategoryTabsProps {
  active: CategoryKey;
  onSelect: (cat: CategoryKey) => void;
  counts: Record<CategoryKey, number>;
}

const tabs: { key: CategoryKey; label: string; icon: any }[] = [
  { key: "all", label: "All Orders", icon: LayoutGrid },
  { key: "grill", label: "Grill", icon: Flame },
  { key: "drinks", label: "Drinks", icon: Coffee },
  { key: "desserts", label: "Desserts", icon: IceCream },
  { key: "salads", label: "Salad", icon: Salad },
];

export function CategoryTabs({ active, onSelect, counts }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active === key
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            active === key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}
