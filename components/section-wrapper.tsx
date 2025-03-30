"use client"

import type { ReactNode } from 'react';
import { Children, cloneElement, isValidElement } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
}

const SectionWrapper = ({ children, className = "" }: SectionWrapperProps) => {
  // Convert children to array and add dividers between them
  const childrenArray = Children.toArray(children);
  const childrenWithDividers: React.ReactNode[] = [];

  childrenArray.forEach((child, index) => {
    // Add the child
    childrenWithDividers.push(child);

    // Add a divider after each child except the last one
    if (index < childrenArray.length - 1) {
      childrenWithDividers.push(
        <div key={`section-divider-${childrenArray[index].toString()}`} className="my-16">
          <div className="relative h-8 w-full bg-black">
            <hr className="absolute top-1/2 inset-x-0 border-t border-white/10" />
          </div>
        </div>
      );
    }
  });

  return (
    <div className={`relative ${className}`}>
      {/* Content container */}
      <div className="container mx-auto px-4 max-w-6xl relative">
        {/* Top horizontal line that starts all borders - hidden on mobile */}
        <div className="relative mb-16 w-full max-lg:hidden">
          {/* Main horizontal line with extra width to cover borders */}
          <div className="h-[2px] w-[calc(100%+32px)] -ml-4 bg-white/10" />
        </div>
        {/* Left border with pattern */}
        <div className="absolute top-1 bottom-1 left-0 w-8 border-r border-white/10 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-white)]/10 max-lg:hidden" />

        {/* Right border with pattern */}
        <div className="absolute top-1 bottom-1 right-0 w-8 border-l border-white/10 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-white)]/10 max-lg:hidden" />

        {/* Two vertical dashed lines at 1/3 distance from edges */}
        <div className="absolute top-1 bottom-1 left-1/3 border-l border-dashed border-white/10 z-0 opacity-80" />
        <div className="absolute top-1 bottom-1 right-1/3 border-l border-dashed border-white/10 z-0 opacity-80" />

        {/* Content wrapper with padding to prevent overlap with borders */}
        <div className="px-10 relative z-10">
          {childrenWithDividers}
        </div>
        
        {/* Bottom horizontal line that ends all borders - hidden on mobile */}
        <div className="relative mt-16 w-full max-lg:hidden">
          {/* Main horizontal line with extra width to cover borders */}
          <div className="h-[2px] w-[calc(100%+32px)] -ml-4 bg-white/10" />
        </div>
      </div>
      
    </div>
  );
};

export default SectionWrapper;
