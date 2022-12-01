import { useEffect, useRef, useState } from "react";
import { MediaItem } from "../media/mediaProvider";

export interface PlayerPlayState {
    paused: boolean;
    stopped: boolean;
}

export interface PlayerProps {
    // onNext: () => MediaItem;
    // onPrev: () => MediaItem;
}

export function Player(props: PlayerProps) {
    let audioRef = useRef<HTMLAudioElement>();
    let [playURL, setPlayURL] = useState<string>(
        "https://deltarune.com/assets/audio/update2022-town-day.mp3"
    );
    let [playState, setPlayState] = useState<PlayerPlayState>({
        paused: false,
        stopped: true,
    });
    let [audioCtx, setAudioCtx] = useState<AudioContext>();

    const EQFrequencies: number[] = [
        31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000,
    ];
    let [EQGain, setEQGain] = useState<Record<number, number>>({});
    let [EQFilters, setEQFilters] = useState<BiquadFilterNode[]>([]);

    useEffect(() => {
        for (const equalizer of EQFilters) {
            let frequency = equalizer.frequency.value;
            equalizer.gain.value = EQGain[frequency] != undefined ? EQGain[frequency] : 0;
        }
    }, [EQGain, EQFilters]);

    useEffect(() => {
        if (audioCtx) {
            // may fail when already created
            try {
                let source = audioCtx.createMediaElementSource(
                    audioRef.current as HTMLMediaElement
                );

                if (EQFilters[0]) source.connect(EQFilters[0]);
            } catch {}
        }
    }, [EQFilters]);

    useEffect(() => {
        let ctx = new AudioContext();
        setAudioCtx(ctx);

        let equalizerFilters: BiquadFilterNode[] = [];
        let lastFilter: AudioNode;
        for (const frequency of EQFrequencies) {
            let filter = ctx.createBiquadFilter();
            filter.frequency.value = frequency;
            filter.gain.value = 0;
            filter.type = "peaking";
            equalizerFilters.push(filter);
            // not the first one
            if (lastFilter) lastFilter.connect(filter);
            lastFilter = filter;
        }
        if (lastFilter) lastFilter.connect(ctx.destination);
        setEQFilters(equalizerFilters);

        return () => {
            for (const equalizer of EQFilters) {
                equalizer.disconnect();
                setEQFilters([]);
            }
        };
    }, []);

    return (
        <div className="playerbar">
            <p>Equalizer:</p>
            {EQFrequencies.map((frequency) => {
                return (
                    <div key={frequency}>
                        <input
                            type="range"
                            name="equalizer"
                            max={12}
                            min={-12}
                            value={EQGain[frequency] != undefined ? EQGain[frequency] : 0}
                            onChange={(event) => {
                                setEQGain((prevGain) => {
                                    prevGain[frequency] = parseInt(event.target.value);
                                    return { ...prevGain };
                                });
                            }}
                        />
                        <span>
                            {frequency +
                                "Hz " +
                                (EQGain[frequency] != undefined ? EQGain[frequency] : 0) +
                                "dB"}
                        </span>
                    </div>
                );
            })}
            <p>Player:</p>
            <audio
                onPlay={() => {}}
                onPause={() => {}}
                ref={audioRef}
                controls
                loop
                src={playURL}
                crossOrigin="anonymous"
                onTimeUpdate={(event) => {
                    console.log((event.target as HTMLAudioElement).currentTime);
                }}
            ></audio>
            <p>Media file url:</p>
            <input
                type="text"
                value={playURL}
                onChange={(event) => setPlayURL(event.target.value)}
            />
        </div>
    );
}
