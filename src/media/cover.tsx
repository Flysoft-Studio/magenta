import "./cover.less";
import { useContext, useRef, useState } from "react";
import { combineClassName } from "../utils/className";
import { VerboseRenderingContext } from "../app/app";

export interface CoverProps {
    url?: string;
    className?: string;
}

export function Cover(props: CoverProps) {
    let verboseRendering = useContext(VerboseRenderingContext);
    let ref = useRef<HTMLImageElement>();
    let [visibility, setVisibility] = useState<boolean>(false);
    let [error, setError] = useState<boolean>(false);

    return (
        <div className={combineClassName("cover", props.className)}>
            {verboseRendering ? (
                props.url ? (
                    <img
                        src={props.url}
                        className="cover_image"
                        draggable={false}
                        ref={ref}
                        decoding="async"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        alt="Artwork"
                        onLoad={(event) =>
                            event.currentTarget.decode().then(() => setVisibility(true))
                        }
                        onError={() => setError(true)}
                        style={{
                            opacity: visibility ? 1 : 0,
                        }}
                    ></img>
                ) : null
            ) : null}
            {verboseRendering && (!props.url || error) ? (
                <svg
                    className="cover_default"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlSpace="preserve"
                    overflow="hidden"
                    viewBox="0 0 1710 1709"
                >
                    <defs>
                        <clipPath id="clip0">
                            <rect x="1345" y="383" width="1710" height="1709" />
                        </clipPath>
                    </defs>
                    <g clip-path="url(#clip0)" transform="translate(-1345 -383)">
                        <rect
                            x="1345"
                            y="383"
                            width="1710"
                            height="1709"
                            fill="#000000"
                            fill-opacity="0"
                        />
                        <path
                            d="M1714.5 1238C1714.5 969.866 1932.09 752.5 2200.5 752.5 2468.91 752.5 2686.5 969.866 2686.5 1238 2686.5 1506.13 2468.91 1723.5 2200.5 1723.5 1932.09 1723.5 1714.5 1506.13 1714.5 1238Z"
                            stroke="currentColor"
                            stroke-width="68.75"
                            stroke-miterlimit="8"
                            fill="none"
                            fill-rule="evenodd"
                        />
                        <path
                            d="M2082 1237.5C2082 1172.05 2134.83 1119 2200 1119 2265.17 1119 2318 1172.05 2318 1237.5 2318 1302.95 2265.17 1356 2200 1356 2134.83 1356 2082 1302.95 2082 1237.5Z"
                            stroke="currentColor"
                            stroke-width="45.8333"
                            stroke-miterlimit="8"
                            fill="none"
                            fill-rule="evenodd"
                        />
                        <path
                            d="M2303.81 937.508C2394.56 969.01 2466.15 1040.02 2498.49 1130.6"
                            stroke="currentColor"
                            stroke-width="45.8333"
                            stroke-linecap="round"
                            stroke-miterlimit="8"
                            fill="none"
                            fill-rule="evenodd"
                        />
                        <path
                            d="M2096.19 1537.49C2005.44 1505.99 1933.85 1434.98 1901.51 1344.4"
                            stroke="currentColor"
                            stroke-width="45.8333"
                            stroke-linecap="round"
                            stroke-miterlimit="8"
                            fill="none"
                            fill-rule="evenodd"
                        />
                    </g>
                </svg>
            ) : null}
        </div>
    );
}
