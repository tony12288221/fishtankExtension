document.addEventListener("DOMContentLoaded", function() {
    const streams = [
        { title: "Director Mode", url: "https://ft.3045x.com/9b249j7qlqu0fypg/index.m3u8" },
        { title: "Den", url: "https://ft.3045x.com/d678xcnkn2slngkx/index.m3u8" },
        { title: "Den PTZ", url: "https://ft.3045x.com/8e1arf44e86qa7ru/index.m3u8"},
        { title: "Lounge", url: "https://ft.3045x.com/9f41r40060icglir/index.m3u8" },
        { title: "Locker Room", url: "https://ft.3045x.com/7d3e7e9s5qm5l1uf/index.m3u8" },
        { title: "Deck", url: "https://ft.3045x.com/b4e4iknxyd1u4g0c/index.m3u8" },
        { title: "Yard", url: "https://ft.3045x.com/8ac015orral0pm4c/index.m3u8" },
        { title: "Yard PTZ", url: "https://ft.3045x.com/b51399w8tr5qa0v1/index.m3u8" },
        { title: "Catwalk", url: "https://ft.3045x.com/580elsslerqmt28u/index.m3u8" },
        { title: "Mail Room", url: "https://ft.3045x.com/84485q0ve58ckwm2/index.m3u8" },
        { title: "Kitchen", url: "https://ft.3045x.com/8c8btla37r6nux8f/index.m3u8" },
        { title: "Island", url: "https://ft.3045x.com/d578z2acldqyww5x/index.m3u8" },
        { title: "Dining Room", url: "https://ft.3045x.com/afacw5eipuyfsfny/index.m3u8" },
        { title: "Hallway", url: "https://ft.3045x.com/3760543f053u6c5m/index.m3u8" },
        { title: "Bedroom 1", url: "https://ft.3045x.com/b65269ekvyvfkous/index.m3u8" },
        { title: "Bedroom 2", url: "https://ft.3045x.com/36708jd80gr91018/index.m3u8" },
        { title: "Bedroom 3", url: "https://ft.3045x.com/44daqjc6r1dfxd2e/index.m3u8" },
        { title: "Vanity", url: "https://ft.3045x.com/68f8q4hl8cys37n2/index.m3u8" },
        { title: "Penthouse", url: "https://ft.3045x.com/0c0bun9tebd65k3j/index.m3u8" },
        { title: "Loft", url: "https://ft.3045x.com/9d5ckl8snb01ba6i/index.m3u8" },
        { title: "Jacuzzi", url: "https://ft.3045x.com/122bkgvyrj1f7pk4/index.m3u8" },
        { title: "Bar", url: "https://ft.3045x.com/f77b5hz939s8z89b/index.m3u8" },
        { title: "Flat", url: "https://ft.3045x.com/4fb8to1674q6ht0m/index.m3u8" },
        { title: "Confessional", url: "https://ft.3045x.com/21aflvcz5puavd2e/index.m3u8" },
    ];

    const videoContainer = document.getElementById("videoContainer");
    const checkboxContainer = document.getElementById("checkboxContainer");
    const toggleStates = initializeToggleStates();
    
    addSelectButtons();
    createStreamCheckboxes();
    syncUIWithToggleStates();

    document.getElementById("dropdownButton").addEventListener("click", toggleCheckboxContainer);

    function initializeToggleStates() {
        const urlParams = new URLSearchParams(window.location.search);
        const togglesString = urlParams.get('toggles');
        return togglesString ? togglesString.split(',').map(toggle => toggle.trim() === 'true') : new Array(streams.length).fill(true);
    }

    function addSelectButtons() {
        const buttonRow = document.createElement("div");
        buttonRow.className = "button-row";
        
        const selectAllBtn = createButton("Select All", () => updateAllToggles(true));
        const deselectAllBtn = createButton("Deselect All", () => updateAllToggles(false));
        
        buttonRow.append(selectAllBtn, deselectAllBtn);
        checkboxContainer.appendChild(buttonRow);
    }

    function createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClick);
        return button;
    }

    function updateAllToggles(state) {
        toggleStates.fill(state);
        document.querySelectorAll("input[type='checkbox']").forEach(checkbox => checkbox.checked = state);
        streams.forEach((_, index) => toggleStreamDisplay(index, state));
    }

    function createStreamCheckboxes() {
        streams.forEach((stream, index) => {
            const checkboxItem = document.createElement("div");
            checkboxItem.className = "checkbox-item";
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `streamCheckbox${index}`;
            checkbox.checked = toggleStates[index];
            checkbox.addEventListener("change", () => toggleStream(index, checkbox.checked));
            
            const label = document.createElement("label");
            label.htmlFor = `streamCheckbox${index}`;
            label.textContent = stream.title;
            
            checkboxItem.append(checkbox, label);
            checkboxContainer.appendChild(checkboxItem);
        });
    }

    function toggleStream(index, isChecked) {
        toggleStates[index] = isChecked;
        toggleStreamDisplay(index, isChecked);
    }

    function toggleStreamDisplay(index, isChecked) {
        const videoWrapper = document.getElementById(`videoWrapper${index}`);
        const video = document.getElementById(`fishtankVideo${index}`);
    
        if (isChecked) {
            if (!videoWrapper) {
                createVideoPlayer(index);
            }
        } else {
            if (video) {
                video.pause(); // Pause the video
                video.src = ""; // Clear the source to stop requests
            }
            if (videoWrapper) {
                videoWrapper.remove();
            }
        }
    }
    

    function createVideoPlayer(index) {
        const stream = streams[index];
        const videoWrapper = document.createElement("div");
        videoWrapper.className = "video-player";
        videoWrapper.id = `videoWrapper${index}`;
        
        const title = document.createElement("h2");
        title.textContent = stream.title;
        
        const video = document.createElement("video");
        video.id = `fishtankVideo${index}`;
        video.controls = true;
        video.muted = true;
        
        const expandButton = createButton("Expand", () => expandToFullscreen(index));
        
        videoWrapper.append(title, video, expandButton);
        videoContainer.appendChild(videoWrapper);
        
        setupHlsPlayer(video, stream.url);
    }

    function setupHlsPlayer(video, url) {
        if (Hls.isSupported()) {
            const hls = new Hls({ maxBufferLength: 10, capLevelToPlayerSize: true, minLevel: 1 });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => video.play());
        } else {
            alert("Your browser does not support HLS streaming.");
        }
    }

    function expandToFullscreen(index) {
        const video = document.getElementById(`fishtankVideo${index}`);
        const stream = streams[index];
        video.pause();
        setTimeout(() => {
            window.location.href = `fullscreen.html?url=${encodeURIComponent(stream.url)}&title=${encodeURIComponent(stream.title)}&toggles=${encodeURIComponent(toggleStates)}`;
        }, 100);
    }

    function syncUIWithToggleStates() {
        streams.forEach((_, index) => {
            const checkbox = document.getElementById(`streamCheckbox${index}`);
            checkbox.checked = toggleStates[index];
            toggleStreamDisplay(index, toggleStates[index]);
        });
    }

    function toggleCheckboxContainer() {
        checkboxContainer.style.display = checkboxContainer.style.display === "none" ? "grid" : "none";
    }
});
