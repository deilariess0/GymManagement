// Tiny classnames helper so components can compose conditional Tailwind
// classes without pulling in a dependency.
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
