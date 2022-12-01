import logo from "../images/logo.svg";
import codicon from "@vscode/codicons/dist/codicon.svg";
import "./titlebar.less";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { window } from "@tauri-apps/api";
import { isTauri } from "../utils/env";
import { combineClassName } from "../utils/className";

export interface TitlebarProps {
    top: boolean;
}

export function Titlebar(props: TitlebarProps) {
    let navigate = useNavigate();
    let [maximized, setMaximized] = useState<boolean>(false);

    if (isTauri)
        useEffect(() => {
            let isGetMaximizedPromisePending = false;
            let onResized = window.appWindow.onResized(() => {
                if (isGetMaximizedPromisePending) return;
                isGetMaximizedPromisePending = true;
                window.appWindow.isMaximized().then((value) => {
                    isGetMaximizedPromisePending = false;
                    setMaximized(value);
                });
            });
            return () => {
                onResized.then((unlisten) => unlisten());
            };
        }, []);

    return (
        <div
            className={combineClassName("titlebar", props.top ? "titlebar_top" : null)}
            onMouseDown={() => {
                if (isTauri) window.appWindow.startDragging();
            }}
        >
            <div className="titlebar_left">
                <button
                    className="titlebar_back"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    <svg>
                        <use xlinkHref={codicon + "#arrow-left"} />
                    </svg>
                </button>
                <div className="titlebar_title">
                    <img
                        src={logo}
                        className="titlebar_icon"
                        draggable={false}
                        alt="Logo"
                    />
                    <div className="titlebar_text">Magenta</div>
                </div>
            </div>
            {isTauri && (
                <div className="titlebar_btns">
                    <button
                        className="titlebar_btn"
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={() => {
                            if (isTauri) window.appWindow.minimize();
                        }}
                    >
                        <svg>
                            <use xlinkHref={codicon + "#chrome-minimize"} />
                        </svg>
                    </button>
                    <button
                        className="titlebar_btn"
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={() => {
                            if (isTauri) window.appWindow.toggleMaximize();
                        }}
                    >
                        {maximized ? (
                            <svg>
                                <use xlinkHref={codicon + "#chrome-restore"} />
                            </svg>
                        ) : (
                            <svg>
                                <use xlinkHref={codicon + "#chrome-maximize"} />
                            </svg>
                        )}
                    </button>
                    <button
                        className="titlebar_btn titlebar_btn_close"
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={() => {
                            if (isTauri) window.appWindow.close();
                        }}
                    >
                        <svg>
                            <use xlinkHref={codicon + "#chrome-close"} />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
