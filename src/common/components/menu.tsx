import "./menu.less";
import { ArrowKeyAccessibleControl } from "./arrowKeyAccessible";
import { combineClassName } from "../../utils/className";
import { useEffect, useState } from "react";

export interface MenuItem {
    title: string;
}

export type MenuSection = MenuItem[];

export interface MenuProps {
    visible: boolean;
    sections: MenuSection[];
}

export function Menu(props: MenuProps) {
    let [displaySections, setDisplaySections] = useState<MenuSection[]>([]);

    useEffect(() => {
        console.log(props.visible);
        if (props.visible) setDisplaySections(props.sections);
        else setTimeout(() => setDisplaySections([]), 3000);
    }, [props.visible]);

    console.log("rendered");

    return (
        <ArrowKeyAccessibleControl
            className={combineClassName("menu", props.visible ? "menu_show" : null)}
            role={"menu"}
            disabled={!props.visible}
            repeat={true}
        >
            {displaySections.map((section, i, sections) => {
                let items = section.map((item, j) => {
                    return (
                        <li className="menu_item" key={i + "," + j} role={"menuitem"}>
                            {item.title}
                        </li>
                    );
                });
                if (i < sections.length - 1) items.push(<hr key={"separator," + i}></hr>);
                return items;
            })}
        </ArrowKeyAccessibleControl>
    );
}
