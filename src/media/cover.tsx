import "./cover.less";
import { useContext, useRef, useState } from "react";
import { combineClassName } from "../utils/className";
import { VerboseRenderingContext } from "../app/app";

export interface CoverProps {
    url?: string;
    className?: string;
    type: "artist" | "media";
}

export function Cover(props: CoverProps) {
    let verboseRendering = useContext(VerboseRenderingContext);
    let ref = useRef<HTMLImageElement>();
    let [visibility, setVisibility] = useState<boolean>(false);
    let [error, setError] = useState<boolean>(false);

    return (
        <div
            className={combineClassName(
                combineClassName("cover", props.type == "artist" ? "cover_artist" : null),
                props.className
            )}
        >
            {verboseRendering ? (
                props.url ? (
                    <img
                        className="cover_image"
                        src={props.url}
                        draggable={false}
                        ref={ref}
                        decoding="async"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        alt={props.type == "media" ? "Album Cover" : "Artist"}
                        style={{
                            opacity: visibility && !error ? 1 : 0,
                        }}
                        onLoad={(event) =>
                            event.currentTarget.decode().then(() => setVisibility(true))
                        }
                        onError={() => setError(true)}
                        aria-hidden="true"
                    ></img>
                ) : null
            ) : null}
            {(!props.url || error) &&
                (props.type == "media" ? (
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
                        <g clipPath="url(#clip0)" transform="translate(-1345 -383)">
                            <rect
                                x="1345"
                                y="383"
                                width="1710"
                                height="1709"
                                fill="#000000"
                                fillOpacity="0"
                            />
                            <path
                                d="M1714.5 1238C1714.5 969.866 1932.09 752.5 2200.5 752.5 2468.91 752.5 2686.5 969.866 2686.5 1238 2686.5 1506.13 2468.91 1723.5 2200.5 1723.5 1932.09 1723.5 1714.5 1506.13 1714.5 1238Z"
                                stroke="currentColor"
                                strokeWidth="68.75"
                                strokeMiterlimit="8"
                                fill="none"
                                fillRule="evenodd"
                            />
                            <path
                                d="M2082 1237.5C2082 1172.05 2134.83 1119 2200 1119 2265.17 1119 2318 1172.05 2318 1237.5 2318 1302.95 2265.17 1356 2200 1356 2134.83 1356 2082 1302.95 2082 1237.5Z"
                                stroke="currentColor"
                                strokeWidth="45.8333"
                                strokeMiterlimit="8"
                                fill="none"
                                fillRule="evenodd"
                            />
                            <path
                                d="M2303.81 937.508C2394.56 969.01 2466.15 1040.02 2498.49 1130.6"
                                stroke="currentColor"
                                strokeWidth="45.8333"
                                strokeLinecap="round"
                                strokeMiterlimit="8"
                                fill="none"
                                fillRule="evenodd"
                            />
                            <path
                                d="M2096.19 1537.49C2005.44 1505.99 1933.85 1434.98 1901.51 1344.4"
                                stroke="currentColor"
                                strokeWidth="45.8333"
                                strokeLinecap="round"
                                strokeMiterlimit="8"
                                fill="none"
                                fillRule="evenodd"
                            />
                        </g>
                    </svg>
                ) : (
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
                        <g clipPath="url(#clip0)" transform="translate(-1345 -383)">
                            <rect
                                x="1345"
                                y="383"
                                width="1710"
                                height="1709"
                                fill="#000000"
                                fillOpacity="0"
                            />
                            <path
                                d="M1980 1005.5C1980 884.274 2078.5 786 2200 786 2321.5 786 2420 884.274 2420 1005.5 2420 1126.73 2321.5 1225 2200 1225 2078.5 1225 1980 1126.73 1980 1005.5Z"
                                fill="#A6A6A6"
                                fillRule="evenodd"
                            />
                            <path
                                d="M1884.69 1320 2515.31 1320C2571.47 1320 2617 1382.52 2617 1459.65L2617 1468.13 2616.98 1468.13 2611.41 1512.57C2585.79 1613.26 2475.03 1689 2342.27 1689L2057.7 1689C1924.95 1689 1814.19 1613.26 1788.57 1512.57L1783 1468.13 1783 1459.65C1783 1382.52 1828.53 1320 1884.69 1320Z"
                                fill="#A6A6A6"
                                fillRule="evenodd"
                            />
                        </g>
                    </svg>
                ))}
        </div>
    );
}
