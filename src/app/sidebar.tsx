import "./sidebar.less";
import { useLocation, useNavigate } from "react-router-dom";
import { combineClassName } from "../utils/className";

export interface SidebarItem {
    path: string;
    title: string;
    icon: string;
    including?: string[];
}

export interface SidebarProps {
    items: SidebarItem[];
}

export function Sidebar(props: SidebarProps) {
    let navigate = useNavigate();
    let location = useLocation();

    return (
        <ul className="sidebar">
            {props.items.map((item) => {
                let isChecked =
                    location.pathname == item.path ||
                    (item.including && item.including.includes(location.pathname));
                return (
                    <li
                        className={combineClassName(
                            "sidebar_item",
                            isChecked ? "sidebar_item_checked" : null
                        )}
                        key={item.path}
                        role="button"
                    >
                        <input
                            type="radio"
                            name="sidebar"
                            title={item.title}
                            aria-label={item.title}
                            onClick={() => {
                                if (location.pathname != item.path) navigate(item.path);
                            }}
                        />
                        <i className={"fas fa-" + item.icon}></i>
                    </li>
                );
            })}
        </ul>
    );
}
