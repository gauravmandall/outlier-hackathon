

import CanvasComponent from "@/components/smoke-canvas";

export default function Footer() {
    return (
        <>
            <div
                className="relative h-[150px] md:h-[200px] lg:h-[300px] xl:h-[305px] "
                style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
            >
                <hr className="border-neutral-900" />
                <div className="relative -top-[100vh] h-[calc(100vh+150px)] md:-top-[100vh] md:h-[calc(100vh+200px)] lg:h-[calc(100vh+300px)] dark:bg-black">
                    <div className="sticky top-[calc(100vh-150px)] h-[150px] dark:bg-black md:top-[calc(100vh-200px)] md:h-[200px] lg:top-[calc(100vh-300px)] lg:h-[320px] xl:top-[calc(100vh-300px)]">
                        <CanvasComponent />
                    </div>
                </div>
            </div>
        </>
    )
}
