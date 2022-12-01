import "./mediaList.less";
import { ArrowKeyAccessibleControl } from "../common/components/arrowKeyAccessible";
import { Cover } from "./cover";
import { MediaItem } from "./mediaProvider";
import { timestampToDurationStr } from "../utils/timestamp";

export interface MediaListProps {
    items: MediaItem[];
}

export function MediaList(props: MediaListProps) {
    return (
        <ArrowKeyAccessibleControl className="media_list" role={"list"}>
            {props.items.map((item, index) => {
                return (
                    <li className="media_list_item" key={index} role={"listitem"}>
                        <div className="media_list_item_counter">{index + 1}</div>
                        <Cover
                            className="media_list_item_cover"
                            url={item.album.art}
                        ></Cover>
                        <div className="media_list_item_info">
                            <div className="media_list_item_info_left">
                                <div className="media_list_item_info_title">
                                    {item.title}
                                </div>
                                <button className="media_list_item_info_artist">
                                    {item.artists
                                        .map((artist) => {
                                            return artist.name;
                                        })
                                        .join(" · ")}
                                </button>
                            </div>
                            <div className="media_list_item_info_right">
                                <button className="media_list_item_info_album">
                                    {item.album.title}
                                </button>
                                {item.duration && (
                                    <div className="media_list_item_info_duration">
                                        {timestampToDurationStr(item.duration)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ArrowKeyAccessibleControl>
    );
}
