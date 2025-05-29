function BulletList({ children }: { children: React.ReactNode }) {
  return <ul className="ml-6 list-disc [&>li]:mb-2 text-sm">{children}</ul>;
}

export default BulletList;
