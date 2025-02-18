
export const Footer = () => {
  return (
    <footer className="bg-neutral-950 py-8 mt-auto hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center text-neutral-500 text-sm">
            © {new Date().getFullYear()} Romer Garcia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
