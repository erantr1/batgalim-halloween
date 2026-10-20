// Halloween decorations in the band above and below the content. Hidden from screen readers,
// never in the way of taps, and still when the visitor asks for reduced motion.
export default function Decorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
      <div className="absolute -end-8 -top-8 size-24 rounded-full bg-amber-100 shadow-[0_0_60px_20px_rgb(254_243_199/0.3)]" />
      <span className="absolute end-20 top-3 animate-float text-2xl motion-reduce:animate-none">🦇</span>
      <span className="absolute end-32 top-8 animate-float text-lg [animation-delay:-3s] motion-reduce:animate-none">🦇</span>
      <span className="absolute -start-2 -top-2 text-6xl opacity-25">🕸️</span>
      <div className="absolute start-1/2 top-0 flex origin-top animate-swing flex-col items-center motion-reduce:animate-none">
        <div className="h-8 w-px bg-stone-400/60" />
        <span className="text-xl">🕷️</span>
      </div>
      <span className="absolute bottom-1 end-4 animate-float text-4xl opacity-30 [animation-delay:-1.5s] motion-reduce:animate-none">
        👻
      </span>
    </div>
  );
}
