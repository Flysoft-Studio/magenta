import { useEffect, useState } from "react";
import { Player } from "../app/player";
import { Menu } from "../common/components/menu";
import { MediaList } from "../media/mediaList";

export function Home() {
    return (
        <div className="tab_content">
            <Player></Player>
            <MediaList
                items={[
                    {
                        provider: { id: null, sourceInfo: null },
                        title: "Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world",
                        album: {
                            art: "http://p3.music.126.net/njCU7D_y3hRqQQSQmIW1lg==/109951163695044017.jpg",
                            title: "Lorem ipsum dolor sit amet",
                            provider: { id: null, sourceInfo: null },
                        },
                        artists: [
                            {
                                name: "Lorem ipsum",
                                provider: { id: null, sourceInfo: null },
                            },
                            {
                                name: "Lorem ipsum",
                                provider: { id: null, sourceInfo: null },
                            },
                        ],
                        duration: 501000,
                    },
                    {
                        provider: { id: null, sourceInfo: null },
                        title: "Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world",
                        album: {
                            art: "http://p3.music.126.net/njCU7D_y3hRqQQSQmIW1lg==/109951163695044017.jpg",
                            title: "Lorem ipsum dolor sit amet",
                            provider: { id: null, sourceInfo: null },
                        },
                        artists: [
                            {
                                name: "Lorem ipsum",
                                provider: { id: null, sourceInfo: null },
                            },
                            {
                                name: "Lorem ipsum",
                                provider: { id: null, sourceInfo: null },
                            },
                        ],
                        duration: 501000,
                    },
                    {
                        provider: { id: null, sourceInfo: null },
                        title: "Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world",
                        album: {
                            art: "http://p3.music.126.net/njCU7D_y3hRqQQSQmIW1lg==/109951163695044017.jpg",
                            title: "Lorem ipsum dolor sit amet",
                            provider: { id: null, sourceInfo: null },
                        },
                        artists: [
                            {
                                name: "Lorem ipsum",
                                provider: { id: null, sourceInfo: null },
                            },
                            {
                                name: "Lorem ipsum",
                                provider: { id: null, sourceInfo: null },
                            },
                        ],
                        duration: 501000,
                    },
                    {
                        provider: { id: null, sourceInfo: null },
                        title: "Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world",
                        album: {
                            art: "http://p3.music.126.net/njCU7D_y3hRqQQSQmIW1lg==/109951163695044017.jpg",
                            title: "Lorem ipsum dolor sit amet",
                            provider: { id: null, sourceInfo: null },
                        },
                        artists: [
                            {
                                name: "Lorem ipsum",
                                provider: { id: null, sourceInfo: null },
                            },
                            {
                                name: "Lorem ipsum",
                                provider: { id: null, sourceInfo: null },
                            },
                        ],
                        duration: 501000,
                    },
                    {
                        provider: { id: null, sourceInfo: null },
                        title: "Test",
                        album: {
                            art: "http://p3.music.126.net/njCU7D_y3hRqQQSQmIW1lg==/109951163695044017.jpg",
                            title: "Lorem ipsum dolor sit amet",
                            provider: { id: null, sourceInfo: null },
                        },
                        artists: [
                            {
                                name: "Flysoft",
                                provider: { id: null, sourceInfo: null },
                            },
                        ],
                    },
                ]}
            ></MediaList>
        </div>
    );
}
