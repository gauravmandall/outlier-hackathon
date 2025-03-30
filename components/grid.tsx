"use client"
import { SponsorSlider } from '@/components/infinite-sponsors';
import { gsap } from 'gsap';
import debounce from 'lodash/debounce';
import type React from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import styles from './grid.module.css';

// Define types for the Square component props
interface SquareProps {
    isThreeByThreeSquare?: boolean;
    isTwoByTwoSquare?: boolean;
    isTopGradientSquare?: boolean;
    isBottomGradientSquare?: boolean;
    isTwoByOneSquare?: boolean;
    children?: React.ReactNode;
    number: number;
    theme?: 'dark' | 'light';
}

// Define the Square component
const Square = memo(({
    isThreeByThreeSquare,
    isTwoByTwoSquare,
    isTopGradientSquare,
    isBottomGradientSquare,
    isTwoByOneSquare,
    children,
    number,
    theme = 'dark'
}: SquareProps) => {
    // Generate gradient colors for dark theme
    const topGradientStyle = { background: 'linear-gradient(180deg, #0b1019 27%, #000000 90%)' };

    const bottomGradientStyle = { background: 'linear-gradient(180deg, #000000 10%, #0b1019 90%)' };

    return (
        <div
            data-number={number}
            className={[
                styles.square,
                isThreeByThreeSquare ? styles.square3x3 : '',
                isTwoByTwoSquare ? styles.square2x2 : '',
                isTwoByOneSquare ? styles.square2x1 : '',
                isTopGradientSquare ? styles.squareTopGradient : '',
                isBottomGradientSquare ? styles.squareBottomGradient : ''
            ].join(' ')}
            style={{
                backgroundColor: '#000000',
                ...(isTopGradientSquare && topGradientStyle),
                ...(isBottomGradientSquare && bottomGradientStyle)
            }}
        >
            <div
                className={styles.cut}
                style={{ backgroundColor: '#000000' }}
            />
            <div
                className={styles.cut}
                style={{ backgroundColor: '#000000' }}
            />
            {children}
        </div>
    );
});

Square.displayName = 'Square';

// Define types for the Background component props
interface BackgroundProps {
    PassedElement?: React.ComponentType;
    isHero?: boolean;
    gradientType?: string;
    theme?: 'dark' | 'light';
    heroText?: string;
}

// Main Background component
const Background = ({
    PassedElement = () => null,
    isHero,
    gradientType,
    theme = 'dark', // Always use dark theme
    heroText = "The World's Largest Hackathon"
}: BackgroundProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Define the handler type
        let pointerMoveHandler: ((event: PointerEvent) => void) | undefined;

        // Handle responsive layout
        const handleResize = debounce(() => {
            const windowWidth = window.innerWidth;

            if (windowWidth > 880 && !isDesktop) {
                setIsDesktop(true);
                setIsTablet(false);
                setIsMobile(false);
            } else if (windowWidth > 540 && windowWidth <= 880 && !isTablet) {
                setIsDesktop(false);
                setIsTablet(true);
                setIsMobile(false);
            } else if (windowWidth <= 540 && !isMobile) {
                setIsDesktop(false);
                setIsTablet(false);
                setIsMobile(true);
            }
        }, 200);

        handleResize();
        window.addEventListener('resize', handleResize);
        setIsInitialized(true);

        const container = containerRef.current;

        if (isInitialized && container) {
            pointerMoveHandler = (event: PointerEvent) => {
                if (event.pointerType === 'mouse') {
                    const rect = container.getBoundingClientRect();
                    const mouseX = event.clientX - rect.left;
                    const mouseY = event.clientY - rect.top;

                    // Different radial gradient color for light/dark mode
                    const hoverGradient = theme === 'light'
                        ? 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(0, 0, 0, 0.03), transparent 30%)'
                        : 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(240, 240, 255, 0.5), transparent 30%)';

                    // Define custom properties with type assertion to avoid TypeScript errors
                    const customProps = {
                        '--mouse-x': `${mouseX}px`,
                        '--mouse-y': `${mouseY}px`,
                        '--hover-gradient': hoverGradient
                    } as gsap.TweenVars;

                    gsap.to(container, {
                        ...customProps,
                        duration: 0.8
                    });
                }
            };

            container.addEventListener('pointermove', pointerMoveHandler);
        }

        return () => {
            if (isInitialized && container && pointerMoveHandler) {
                container.removeEventListener('pointermove', pointerMoveHandler);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobile, isTablet, isDesktop, isInitialized, theme]);

    // Create a uniform grid of squares
    // For a uniform grid, we'll calculate the number of squares based on the grid template and screen size
    // Desktop: 11 columns × 7 rows = 77 squares for a completely filled grid
    // Mobile: 5 columns × 11 rows = 55 squares for mobile view
    const squaresCount = isHero ?
        (isMobile ? 55 : 77) :
        (isMobile ? 35 : 55);

    const squaresArray = [...Array(squaresCount)];

    return (
        <>
            <div className={styles.container}>
                {isInitialized ? (
                    <div
                        ref={containerRef}
                        className={`${styles.grid} ${isHero ? styles.heroGrid : styles.footerGrid} ${isMobile ? styles.mobileGrid : ''}`}
                        style={{
                            '--before-background': 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(240, 240, 255, 0.5), transparent 30%)'
                        } as React.CSSProperties}
                    >
                        {/* Gradient overlay to fade to black at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/50 to-black pointer-events-none h-85" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none h-25" />

                        {squaresArray.map((_, index) => {
                            // Determine if this square should have a gradient based on its position
                            const isTopGradientSquare = gradientType === 'top' && index < 11;
                            const isBottomGradientSquare = gradientType === 'bottom' && index >= squaresArray.length - 11;

                            return (
                                <Square
                                    key={`bg-square-${isHero ? 'hero' : 'footer'}-${index}`}
                                    number={index}
                                    isThreeByThreeSquare={false}
                                    isTwoByTwoSquare={false}
                                    isTwoByOneSquare={false}
                                    isTopGradientSquare={isTopGradientSquare}
                                    isBottomGradientSquare={isBottomGradientSquare}
                                    theme={theme}
                                >
                                    {false && <PassedElement />}
                                </Square>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default Background;