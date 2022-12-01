import libFontAwesome from "./lib/fontawesome.all.lib.js";
import "./index.less";
import { createRoot, Root } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./app/app";
import { Bootstrapper } from "./bootstrapper";
import { StrictMode } from "react";

class AppDOM {
    private container: Root;

    public load() {
        this.container = createRoot(document.querySelector("#root") as HTMLElement);
        this.container.render(
            <StrictMode>
                <Bootstrapper libs={[libFontAwesome]}>
                    <HashRouter>
                        <App></App>
                    </HashRouter>
                </Bootstrapper>
            </StrictMode>
        );
    }
    public unload() {
        this.container.unmount();
    }
    public reload() {
        this.unload();
        this.load();
    }
}

export let appDOM = new AppDOM();

appDOM.load();
