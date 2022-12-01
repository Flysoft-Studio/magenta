import { Cover } from "../media/cover";

export function Test({ testItemCount }) {
    return (
        <div className="tab_content">
            <p>Test page - {testItemCount * 2} items</p>
            {new Array(testItemCount).fill(null).map((value, i) => {
                return (
                    <>
                        <Cover key={i * 2}></Cover>
                        <Cover
                            key={i * 2 + 1}
                            url="http://p3.music.126.net/njCU7D_y3hRqQQSQmIW1lg==/109951163695044017.jpg"
                        ></Cover>
                    </>
                );
            })}
        </div>
    );
}
