// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

class Main {

    constructor() {
        this._videoInputDevices = new Map();
        this.VIDEO_WIDTH = 1280;
        this.VIDEO_HEIGHT = 720;
        this.KEY_SELECTED_VIDEO_DEVICE_ID = "selectedVideoDeviceId";
        this._viewRotation = 0;

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

        if (this._videoInputDevices.size > 1) {
            this.addSelect(this._videoInputDevices);
            let storedDeviceId = localStorage.getItem(this.KEY_SELECTED_VIDEO_DEVICE_ID);
            if (storedDeviceId) {
                this.select.value = storedDeviceId
            }
            let device = this._videoInputDevices.get(this.select.value);
            if (device) {
                this.showVideo(device);
            }
        } else if (this._videoInputDevices.size > 0) {
            this.showVideo(this._videoInputDevices.values().next());
        } else {
            alert("没有找到摄像头");
        }
    }

    /**
     *
     * @param {Map} devices
     */
    addSelect(devices) {
        let select = this.select = document.createElement("select");
        devices.forEach((value, key) => {
            let op = document.createElement("option");
            op.innerHTML = value.label;
            op.value = value.deviceId;
            select.appendChild(op);
        });
        select.onchange = e => {
            this.showVideo(this._videoInputDevices.get(select.value));
            localStorage.setItem(this.KEY_SELECTED_VIDEO_DEVICE_ID, select.value);
        };
        this._controlsContriner.appendChild(select);
    }

    initUI() {
        this._view = document.querySelector("#view");
        this._controlsContriner = document.querySelector("#controls-container");
        this._rootContainer = document.querySelector("#root-container");
        this._btnRotate90 = document.querySelector("#btn-rotate");
        this._btnRotate90.onclick = e => {
            this._viewRotation += 180;
            this._view.style.transform = `rotate(${this._viewRotation}deg)`;
        };

        this.windowResizeHandler();
        window.onresize = this.windowResizeHandler.bind(this);
    }

    windowResizeHandler() {
        this._rootContainer.style.width = window.innerWidth + "px";
        this._rootContainer.style.height = window.innerHeight + "px";
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight - 20;
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
        this._view.srcObject = stream;
    }
}

new Main();