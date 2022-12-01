import "./app.less";
import { createContext, useEffect, useRef, useState } from "react";
import { Route, Routes, Location, useLocation } from "react-router-dom";
import { l } from "../common/language";
import { Home } from "../tabs/home";
import { Test } from "../tabs/test";
import { Sidebar } from "./sidebar";
import { Titlebar } from "./titlebar";
import { DummyScrollbar } from "../common/components/dummyScrollbar";
import { isDev } from "../utils/env";

export let GlobalContext = createContext({
    language: "zh-cn",
    color: "light",
});

export let VerboseRenderingContext = createContext<boolean>(true);

export function App() {
    let detectUserGesture = () => {
        // try creating a AudioContext to detect a user gesture
        let audioCtx = new AudioContext();
        let required = audioCtx.state == "suspended";
        if (required && userGestureRef.current) userGestureRef.current.focus();
        return required;
    };

    let tabRef = useRef<HTMLDivElement>();
    let tabInnerRef = useRef<HTMLDivElement>();
    let userGestureRef = useRef<HTMLDivElement>();
    let location = useLocation();
    let [displayLocation, setDisplayLocation] = useState<Location>(location);
    let [transitionStage, setTransistionStage] = useState<"in" | "out">("in");
    let [isTitlebarTop, setIsTitlebarTop] = useState<boolean>(true);
    let [verboseRendering, setVerboseRendering] = useState<boolean>(true);
    let [isUserGestureRequired, setIsUserGestureRequired] = useState<boolean>(
        detectUserGesture()
    );

    useEffect(() => {
        let fadeOutTimeout = null,
            fadeInTimeout = null;
        if (fadeOutTimeout) {
            clearTimeout(fadeOutTimeout);
            fadeOutTimeout = null;
            setTransistionStage("in");
            setVerboseRendering(true);
            setDisplayLocation(location);
        } else if (location !== displayLocation) {
            setTransistionStage("out");
            fadeOutTimeout = setTimeout(() => {
                tabRef.current.scrollTop = 0;
                fadeOutTimeout = null;
                setDisplayLocation(location);
                setVerboseRendering(false);
                setTransistionStage("in");

                fadeInTimeout = setTimeout(() => {
                    fadeInTimeout = null;
                    setVerboseRendering(true);
                }, 250);
            }, 80);
        }
    }, [location, displayLocation, tabRef]);

    let userGestureHandler = () => {
        if (isUserGestureRequired) setIsUserGestureRequired(false);
    };

    let tabScrollHandler = () => {
        setIsTitlebarTop(tabRef.current.scrollTop < 100);
    };

    return (
        <GlobalContext.Provider value={{ language: "zh-cn", color: "light" }}>
            <GlobalContext.Consumer>
                {(gc) => (
                    <div
                        className={["app", "theme_" + gc.color].join(" ")}
                        onContextMenu={(event) => {
                            if (!isDev) event.preventDefault();
                        }}
                    >
                        {isUserGestureRequired ? (
                            <div
                                className="user_gesture_required"
                                ref={userGestureRef}
                                onKeyDown={userGestureHandler}
                                onMouseDown={userGestureHandler}
                                tabIndex={0}
                            >
                                {l(gc.language, "user_gesture_required")}
                            </div>
                        ) : (
                            <>
                                <Titlebar top={isTitlebarTop}></Titlebar>
                                <div className="clientarea">
                                    <Sidebar
                                        items={[
                                            {
                                                path: "/",
                                                title: l(gc.language, "home"),
                                                icon: "home",
                                            },
                                            {
                                                path: "/testx100",
                                                title: "200 Item Test",
                                                icon: "vial",
                                            },
                                            {
                                                path: "/testx1000",
                                                title: "2000 Item Test",
                                                icon: "vials",
                                            },
                                        ]}
                                    ></Sidebar>
                                    <div className="main">
                                        <VerboseRenderingContext.Provider
                                            value={verboseRendering}
                                        >
                                            <div
                                                className={[
                                                    "tab",
                                                    "tab_fade" + transitionStage,
                                                    "hide_scrollbar",
                                                ].join(" ")}
                                                ref={tabRef}
                                                onScroll={tabScrollHandler}
                                            >
                                                <div
                                                    className="tab_inner"
                                                    ref={tabInnerRef}
                                                >
                                                    <Routes location={displayLocation}>
                                                        <Route
                                                            path="/"
                                                            element={<Home></Home>}
                                                        ></Route>
                                                        <Route
                                                            path="/testx100"
                                                            element={
                                                                <Test
                                                                    testItemCount={100}
                                                                ></Test>
                                                            }
                                                        ></Route>
                                                        <Route
                                                            path="/testx1000"
                                                            element={
                                                                <Test
                                                                    testItemCount={1000}
                                                                ></Test>
                                                            }
                                                        ></Route>
                                                    </Routes>
                                                </div>
                                            </div>
                                        </VerboseRenderingContext.Provider>

                                        <DummyScrollbar
                                            binding={tabInnerRef}
                                            className="tab_scrollbar"
                                        ></DummyScrollbar>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </GlobalContext.Consumer>
        </GlobalContext.Provider>
    );
}
