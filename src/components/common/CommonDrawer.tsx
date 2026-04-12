import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "lucide-react"

export type CommonDrawerSize = "sm" | "md" | "lg"

const SIZE_VW: Record<CommonDrawerSize, string> = {
    sm: "25vw",
    md: "50vw",
    lg: "75vw",
}

const SIZE_VH: Record<CommonDrawerSize, string> = {
    sm: "25vh",
    md: "50vh",
    lg: "75vh",
}

interface CommonDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    side: "top" | "right" | "bottom" | "left";
    size?: CommonDrawerSize;
}

export function CommonDrawer({
    isOpen,
    onClose,
    title,
    description,
    children,
    side,
    size,
}: CommonDrawerProps) {

    const isHorizontal = side === "left" || side === "right"
    const isVertical = side === "top" || side === "bottom"

    const panelStyle =
        isHorizontal && size != null
            ? { width: SIZE_VW[size], maxWidth: SIZE_VW[size] }
            : isVertical && size != null
                ? { height: SIZE_VH[size], maxHeight: SIZE_VH[size] }
                : undefined

    return (
        <Drawer
            direction={side}
            open={isOpen}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose();
            }}
        >
            <DrawerContent
                className={cn(
                    size == null &&
                    "data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]",
                )}
                style={panelStyle}
            >
                {title || description ? (
                    <DrawerHeader>
                        {title && (
                            <DrawerTitle>{title}</DrawerTitle>
                        )}
                        {description && (
                            <DrawerDescription>{description}</DrawerDescription>
                        )}
                    </DrawerHeader>
                ) : (
                    <>
                        <DrawerTitle className="sr-only">Panel</DrawerTitle>
                        <DrawerDescription className="sr-only">
                            Panel content
                        </DrawerDescription>
                    </>
                )}
                <div className="no-scrollbar overflow-y-auto p-4">
                    {children}
                </div>
                <DrawerClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute left-[-40px] top-1 z-10 size-9 shrink-0 rounded-md"
                        aria-label="Close"
                    >
                        <ArrowRightIcon className="size-5" />
                    </Button>

                </DrawerClose>
            </DrawerContent>
        </Drawer>
    )
}
