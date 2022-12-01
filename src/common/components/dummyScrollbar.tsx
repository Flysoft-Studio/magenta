import "./dummyScrollbar.less";
import { MutableRefObject, useEffect, useRef } from "react";
import { combineClassName } from "../../utils/className";

export interface DummyScrollbarProps {
    binding: MutableRefObject<HTMLElement>;
    className?: string;
}

export function DummyScrollbar(props: DummyScrollbarProps) {
    let outerRef = useRef<HTMLDivElement>();
    let innerRef = useRef<HTMLDivElement>();

    useEffect(() => {
        let resizeObserver = new ResizeObserver(() => {
            let height =
                (props.binding.current.offsetParent.scrollHeight /
                    props.binding.current.offsetParent.clientHeight) *
                outerRef.current.clientHeight;
            // fix some known precision problems
            if (height == outerRef.current.clientHeight)
                height = outerRef.current.clientHeight - 1;
            innerRef.current.style.height = height + "px";
        });

        let ignoreContentScrollEvent: boolean = false,
            ignoreContentDummyScrollbarScrollEvent: boolean = false;
        let contentScrollEventAnimationID: number,
            contentDummyScrollbarScrollEventAnimationID: number;

        let contentScrollEventHandler = () => {
            if (ignoreContentScrollEvent) return;
            if (contentScrollEventAnimationID) {
                cancelAnimationFrame(contentScrollEventAnimationID);
                contentScrollEventAnimationID = null;
            }
            outerRef.current.scrollTop =
                (props.binding.current.offsetParent.scrollTop /
                    props.binding.current.offsetParent.scrollHeight) *
                outerRef.current.scrollHeight;
            ignoreContentDummyScrollbarScrollEvent = true;
            contentScrollEventAnimationID = requestAnimationFrame(
                () =>
                    (contentScrollEventAnimationID = requestAnimationFrame(() => {
                        contentScrollEventAnimationID = null;
                        ignoreContentDummyScrollbarScrollEvent = false;
                    }))
            );
        };

        let contentDummyScrollbarScrollEventHandler = () => {
            if (ignoreContentDummyScrollbarScrollEvent) return;
            if (contentDummyScrollbarScrollEventAnimationID) {
                cancelAnimationFrame(contentDummyScrollbarScrollEventAnimationID);
                contentDummyScrollbarScrollEventAnimationID = null;
            }
            props.binding.current.offsetParent.scrollTop =
                (outerRef.current.scrollTop / outerRef.current.scrollHeight) *
                props.binding.current.offsetParent.scrollHeight;
            ignoreContentScrollEvent = true;
            contentDummyScrollbarScrollEventAnimationID = requestAnimationFrame(
                () =>
                    (contentDummyScrollbarScrollEventAnimationID = requestAnimationFrame(
                        () => {
                            contentDummyScrollbarScrollEventAnimationID = null;
                            ignoreContentScrollEvent = false;
                        }
                    ))
            );
        };

        resizeObserver.observe(props.binding.current, {
            box: "content-box",
        });
        resizeObserver.observe(outerRef.current, {
            box: "content-box",
        });

        props.binding.current.offsetParent.addEventListener(
            "scroll",
            contentScrollEventHandler
        );
        outerRef.current.addEventListener(
            "scroll",
            contentDummyScrollbarScrollEventHandler
        );

        return () => {
            resizeObserver.disconnect();

            props.binding.current.removeEventListener(
                "scroll",
                contentScrollEventHandler
            );
            outerRef.current.removeEventListener(
                "scroll",
                contentDummyScrollbarScrollEventHandler
            );
        };
    }, []);

    return (
        <div className={combineClassName("scrollbar", props.className)} ref={outerRef}>
            <div ref={innerRef}></div>
        </div>
    );
}
