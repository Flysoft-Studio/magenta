import { ReactNode, useEffect, useState } from "react";

export interface BootstrapperProps {
    libs: string[];
    children: ReactNode;
}

export function Bootstrapper(props: BootstrapperProps) {
    let [ready, setReady] = useState<boolean>(false);
    useEffect(() => {
        let elements: HTMLScriptElement[] = [];
        (async () => {
            let isError = false;

            for (const lib of props.libs) {
                try {
                    let data = await (await fetch(lib)).text();
                    let element = document.createElement("script");
                    element.type = "text/javascript";
                    element.innerHTML = data;
                    document.body.appendChild(element);
                    elements.push(element);
                } catch (exception) {
                    isError = true;
                    alert(
                        "Cannot load library: " +
                            lib +
                            ".\n" +
                            "Error info: " +
                            (window.location.href.startsWith("file:")
                                ? "You are running this app under file protocol"
                                : "Networking error: " + exception) +
                            "."
                    );
                    break;
                }
            }
            setReady(!isError);
        })();

        return () => {
            for (const element of elements) element.remove();
        };
    }, [props.libs]);

    return <>{ready ? props.children : null}</>;
}
