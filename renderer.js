// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

class Main {

    constructor() {
        this._videoInputDevices = new Map();
        this.VIDEO_WIDTH = 1280;
        this.VIDEO_HEIGHT = 720;

        this.initUI();

        this.findCameras();
    }

    async findCameras() {
        let devices = await navigator.mediaDevices.enumerateDevices();

        devices.forEach(value => {
            if (value.kind === "videoinput") {
                this._videoInputDevices.set(value.deviceId, value);
            }
        });

        console.log(this._videoInputDevices);
        if (this._videoInputDevices.size > 0) {
            this.showVideo(this._videoInputDevices.values().next());

            if (this._videoInputDevices.size > 1) {
                this.addSelect(this._videoInputDevices);
            }
        } else {
            alert("没有找到摄像头");
        }
    }

    /**
     *
     * @param {Map} devices
     */
    addSelect(devices) {
        let select = document.createElement("select");
        select.style.position = "fixed";
        select.style.left = "0";
        select.style.top = "0";
        document.body.appendChild(select);
        devices.forEach((value, key) => {
            let op = document.createElement("option");
            op.innerHTML = value.label;
            op.value = value.deviceId;
            select.appendChild(op);
        });
        select.onchange = e => {
            this.showVideo(this._videoInputDevices.get(select.value));
        };
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
                groupId: videoInputDevice.groupId,
                width: this.VIDEO_WIDTH,
                height: this.VIDEO_HEIGHT
            }
        });
        this._view.src = URL.createObjectURL(stream);
    }
}

new Main();