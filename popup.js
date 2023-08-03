const btn_elm = document.getElementById("btn");

btn_elm.addEventListener("click", () => {
    if (btn_elm.src.endsWith("apple_black.jpg")) {
        return;
    }
    btn_elm.src = "apple_black.jpg"
    document.body.style.backgroundColor = "black";
    fetch("apple.json")
		.then( response => response.json())
		.then( data => badApple(data));
});

function badApple(data) {
    const bgm = new Audio("badapple.wav");
    bgm.play();
    const starttime = new Date().getTime();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => {
                const cvs = document.getElementsByTagName("canvas");
                for (let i = 0; i < cvs.length; i++) {
                    cvs[i].width = cvs[i].width;
                    cvs[i].height = cvs[i].height;
                }
            },
        });
        const clearid = setInterval(() => {
            const now = Math.trunc((new Date().getTime() - starttime) / 100 )
            if (now > data.length){
                clearInterval(clearid);
                btn_elm.src = "apple_white.jpg"
                document.body.style.backgroundColor = "white";
                return;
            }
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: (src) => {
                    const img = new Image();
                    img.src = src;
                    const cvs = document.getElementsByTagName("canvas");
                    for (let i = 0; i < cvs.length; i++) {
                        const ct = cvs[i].getContext("2d");
                        let witdh, height;
                        if (cvs[i].width / cvs[i].height > img.width / img.height) {
                            witdh = img.width * cvs[i].height / img.height;
                            height = cvs[i].height;
                        }
                        else {
                            witdh = cvs[i].width;
                            height = img.height * cvs[i].width / img.width;
                        }
                        ct.drawImage(img, (cvs[i].width - witdh) / 2, (cvs[i].height - height) / 2, witdh, height);
                    }
                },
                args: [data[now] ? data[now] : data[now - 1]]
            });
        }, 10);
    });
}
