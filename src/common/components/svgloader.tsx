import "./svgloader.less";
import { useEffect, useRef, useState } from "react";
import { combineClassName } from "../../utils/className";

export interface SVGLoaderProps {
    url: string;
    className?: string;
    transition?: boolean;
}

export function SVGLoader(props: SVGLoaderProps) {
    let ref = useRef<HTMLElement>();
    let [visibility, setVisibility] = useState<boolean>(false);

    useEffect(() => {
        fetch(props.url).then((res) =>
            res.text().then((data) => {
                if (ref.current) {
                    setVisibility(true);
                    ref.current.innerHTML = data;
                }
            })
        );
    }, [props.url]);

    return (
        <i
            className={combineClassName(
                combineClassName(
                    "svg_loader",
                    props.transition ? "svg_loader_transition" : null
                ),
                props.className
            )}
            ref={ref}
            style={{
                opacity: visibility ? 1 : 0,
            }}
        ></i>
    );
}
