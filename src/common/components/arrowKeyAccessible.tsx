import { AriaRole, ReactNode, useEffect, useRef } from "react";

export class ArrowKeyAccessibleControlClass {
    private static setChildAccessible(
        item: HTMLElement,
        accessible: boolean,
        first: boolean = true
    ) {
        if (first) item.tabIndex = accessible ? 0 : -1;
        let childElement = item.firstElementChild as HTMLElement;
        if (childElement)
            do {
                if (!childElement.dataset.oldtabindex)
                    childElement.dataset.oldtabindex = childElement.tabIndex.toString();
                let oldTabIndex = parseInt(childElement.dataset.oldtabindex);
                if (oldTabIndex != -1)
                    childElement.tabIndex = accessible ? oldTabIndex : -1;
                this.setChildAccessible(childElement, accessible, false);
            } while ((childElement = childElement.nextElementSibling as HTMLElement));
    }
    public static registerChild(parent: HTMLElement, item: HTMLElement) {
        item.addEventListener("keydown", (event) => {
            let isUp = event.key == "ArrowUp",
                isDown = event.key == "ArrowDown";
            if (event.key == "Enter" && event.target == item) item.click();
            else if (isUp || isDown) {
                let target: HTMLElement;
                if (isUp) {
                    target = item.previousElementSibling as HTMLElement;

                    // skip separators
                    if (target && target.tagName.toLowerCase() != "li")
                        target = target.previousElementSibling as HTMLElement;

                    // first, go to last
                    if (target == null && parent.dataset.repeat == "true")
                        target = parent.lastElementChild as HTMLElement;
                } else if (isDown) {
                    target = item.nextElementSibling as HTMLElement;

                    // skip separators
                    if (target && target.tagName.toLowerCase() != "li")
                        target = target.nextElementSibling as HTMLElement;

                    // last, go to first
                    if (target == null && parent.dataset.repeat == "true")
                        target = parent.firstElementChild as HTMLElement;
                }
                if (target) {
                    event.preventDefault();
                    this.setChildAccessible(item, false);
                    this.setChildAccessible(target, true);
                    target.focus();
                    target.scrollIntoView({
                        block: "center",
                    });
                }
            }
        });

        // the first element is accessible in initial state
        this.setChildAccessible(item, parent.firstElementChild == item);
    }
    public static registerControl(element: HTMLElement, repeat: boolean = false) {
        let childElement = element.firstElementChild as HTMLElement;
        if (childElement)
            do {
                if (childElement.tagName.toLowerCase() == "li")
                    this.registerChild(element, childElement);
            } while ((childElement = childElement.nextElementSibling as HTMLElement));

        element.dataset.repeat = repeat.toString();
    }
}

export interface ArrowKeyAccessibleControlProps {
    className?: string;
    role: AriaRole;
    // registering a control leads to performance overhead
    disabled?: boolean;
    children: ReactNode;
    repeat?: boolean;
}

export function ArrowKeyAccessibleControl(props: ArrowKeyAccessibleControlProps) {
    let ref = useRef<HTMLUListElement>();

    useEffect(() => {
        if (!props.disabled)
            ArrowKeyAccessibleControlClass.registerControl(ref.current, props.repeat);
    });

    return (
        <ul className={props.className} ref={ref} role={props.role}>
            {props.children}
        </ul>
    );
}
