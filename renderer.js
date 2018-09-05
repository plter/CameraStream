// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

class Main {

    constructor() {
        this._videoInputDevices = [];
        this.VIDEO_WIDTH = 1280;
        this.VIDEO_HEIGHT = 720;

        this.initUI();

        this.findCameras();
    }

    async findCameras() {
        let devices = await navigator.mediaDevices.enumerateDevices();

        devices.forEach(value => {
            if (value.kind === "videoinput") {
                this._videoInputDevices.push(value);
            }
        });

        if (this._videoInputDevices.length > 0) {
            this.showVideo(this._videoInputDevices[0]);

            if (this._videoInputDevices.length > 1) {
                //TODO add select
            }
        } else {
            alert("没有找到摄像头");
        }
    }

    initUI() {
        this._view = document.querySelector("#view");

        this.windowResizeHandler();
        window.onresize = this.windowResizeHandler.bind(this);
    }

    windowResizeHandler() {
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    }

    /**
     *
     * @param {MediaDeviceInfo} videoInputDevice
     */
    async showVideo(videoInputDevice) {
        let stream = await navigator.mediaDevices.getUserMedia({
            video: {
                frameRate: 30,
                deviceId: videoInputDevice.deviceId,
                width: this.VIDEO_WIDTH,
                height: this.VIDEO_HEIGHT
            }
        });
        this._view.src = URL.createObjectURL(stream);
    }
}

new Main();