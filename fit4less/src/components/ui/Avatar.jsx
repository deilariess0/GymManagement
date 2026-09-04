// src/components/ui/Avatar.jsx
const PALETTE = [
  "bg-gold-500/20 text-gold-600",
  "bg-sky-500/20 text-sky-600",
  "bg-emerald-500/20 text-emerald-600",
  "bg-violet-500/20 text-violet-600",
  "bg-rose-500/20 text-rose-600",
];

function initials(name) {
  if (!name) return "?"; // Fallback if name is missing
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function paletteFor(name) {
  if (!name) return PALETTE[0]; // Fallback if name is missing
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export default function Avatar({ name = "User", size = "md", className }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
  };

  // Manually combine classes WITHOUT using cn
  const finalClassName = [
    "flex shrink-0 items-center justify-center rounded-full font-semibold",
    sizes[size],
    paletteFor(name),
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={finalClassName}>
      {initials(name)}
    </div>
  );
}