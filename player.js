(function loadPlayerScript(retries = 3) {
    document.addEventListener("DOMContentLoaded", function () {
        try {
            const streams = [
                { title: "Director Mode", url: "https://ft-hetzner.flowstreams.cx/9b249j7qlqu0fypg/index.m3u8" },
                { title: "Den", url: "https://ft-hetzner.flowstreams.cx/d678xcnkn2slngkx/index.m3u8" },
                { title: "Den PTZ", url: "https://ft-hetzner.flowstreams.cx/8e1arf44e86qa7ru/index.m3u8" },
                { title: "Lounge", url: "https://ft-hetzner.flowstreams.cx/9f41r40060icglir/index.m3u8" },
                { title: "Locker Room", url: "https://ft-hetzner.flowstreams.cx/7d3e7e9s5qm5l1uf/index.m3u8" },
                { title: "Deck", url: "https://ft-hetzner.flowstreams.cx/b4e4iknxyd1u4g0c/index.m3u8" },
                { title: "Yard", url: "https://ft-hetzner.flowstreams.cx/8ac015orral0pm4c/index.m3u8" },
                { title: "Yard PTZ", url: "https://ft-hetzner.flowstreams.cx/b51399w8tr5qa0v1/index.m3u8" },
                { title: "Catwalk", url: "https://ft-hetzner.flowstreams.cx/580elsslerqmt28u/index.m3u8" },
                { title: "Mail Room", url: "https://ft-hetzner.flowstreams.cx/84485q0ve58ckwm2/index.m3u8" },
                { title: "Kitchen", url: "https://ft-hetzner.flowstreams.cx/8c8btla37r6nux8f/index.m3u8" },
                { title: "Island", url: "https://ft-hetzner.flowstreams.cx/d578z2acldqyww5x/index.m3u8" },
                { title: "Dining Room", url: "https://ft-hetzner.flowstreams.cx/afacw5eipuyfsfny/index.m3u8" },
                { title: "Hallway", url: "https://ft-hetzner.flowstreams.cx/3760543f053u6c5m/index.m3u8" },
                { title: "Bedroom 1", url: "https://ft-hetzner.flowstreams.cx/b65269ekvyvfkous/index.m3u8" },
                { title: "Bedroom 2", url: "https://ft-hetzner.flowstreams.cx/36708jd80gr91018/index.m3u8" },
                { title: "Bedroom 3", url: "https://ft-hetzner.flowstreams.cx/44daqjc6r1dfxd2e/index.m3u8" },
                { title: "Vanity", url: "https://ft-hetzner.flowstreams.cx/68f8q4hl8cys37n2/index.m3u8" },
                { title: "Penthouse", url: "https://ft-hetzner.flowstreams.cx/0c0bun9tebd65k3j/index.m3u8" },
                { title: "Loft", url: "https://ft-hetzner.flowstreams.cx/9d5ckl8snb01ba6i/index.m3u8" },
                { title: "Jacuzzi", url: "https://ft-hetzner.flowstreams.cx/122bkgvyrj1f7pk4/index.m3u8" },
                { title: "Bar", url: "https://ft-hetzner.flowstreams.cx/f77b5hz939s8z89b/index.m3u8" },
                { title: "Flat", url: "https://ft-hetzner.flowstreams.cx/4fb8to1674q6ht0m/index.m3u8" },
                { title: "Confessional", url: "https://ft-hetzner.flowstreams.cx/21aflvcz5puavd2e/index.m3u8" },
            ];

            const proxyUrl = 'https://corsproxy.io/?';

            const videoContainer = document.getElementById("videoContainer");
            const checkboxContainer = document.getElementById("checkboxContainer");
            const toggleStates = initializeToggleStates();
            initializeColumnStates();
            let videoOrder = initializeVideoOrder();
            let videoWrapperIDs = indexFromvideoWrapper();
            let activeStreams = videoWrapperIDs.map(index => streams[index]);
            addSelectButtons();
            createStreamCheckboxes();
            initializeSyncUIWithToggleStates(activeStreams, videoWrapperIDs);
            syncUIWithToggleStates();
            updateVideoGrid();
            getVideoOrder();
            updateURL();

            document.getElementById("dropdownButton").addEventListener("click", toggleCheckboxContainer);

            document.addEventListener("click", function () {
                const columnSelect = document.getElementById("columnSelect");
                columnSelect.addEventListener("change", updateVideoGrid);
                updateButtonVisibility();
                getVideoOrder();
                updateURL();
            });

            function initializeToggleStates() {
                const urlParams = new URLSearchParams(window.location.search);
                const togglesString = urlParams.get('toggles');
                return togglesString ? togglesString.split(',').map(toggle => toggle.trim() === 'true') : new Array(streams.length).fill(false);
            }

            function initializeSyncUIWithToggleStates(activeStreams, videoWrapperIDs) {
                activeStreams.forEach((_, index) => {
                    index_streams = videoWrapperIDs[index];
                    const checkbox = document.getElementById(`streamCheckbox${index_streams}`);
                    checkbox.checked = toggleStates[index_streams];
                    toggleStreamDisplay(index_streams, toggleStates[index_streams]);
                });
                updateVideoGrid();  // Adjust grid layout after syncing UI
            }

            function initializeColumnStates() {
                const urlParams = new URLSearchParams(window.location.search);
                const columnSelectString = urlParams.get('columns');
                const columnSelect = document.getElementById("columnSelect");
                if (columnSelectString) {
                    columnSelect.value = columnSelectString;
                } else {
                    columnSelect.value = "auto";
                }
            }

            function initializeVideoOrder() {
                const urlParams = new URLSearchParams(window.location.search);
                const orderString = urlParams.get('videoOrder');
                let videoOrder0;

                if (orderString) {
                    videoOrder0 = orderString.split(',');
                } else {
                    videoOrder0 = Array.from(videoContainer.children).map(wrapper => wrapper.id);
                }
                return videoOrder0;
            }

            function indexFromvideoWrapper() {
                const videoNumbers = videoOrder.map(wrapper => {
                    const match = wrapper.match(/\d+/); // Match one or more digits
                    return match ? parseInt(match[0], 10) : null; // Convert to integer or return null if no match
                }).filter(num => num !== null); // Filter out any null values
                return videoNumbers
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
                updateVideoGrid();
                updateURL();
            }

            function createVideoPlayer(index) {
                const stream = streams[index];
                const videoWrapper = document.createElement("div");
                videoWrapper.className = "video-player";
                videoWrapper.id = `videoWrapper${index}`;
                videoWrapper.style.gridColumn = 'span 1'; // Default to 1 column

                const title = document.createElement("h2");
                title.textContent = stream.title;

                const video = document.createElement("video");
                video.id = `fishtankVideo${index}`;
                video.controls = true;
                video.muted = true;
                video.crossOrigin = "anonymous";

                const buttonContainer = document.createElement("div");
                buttonContainer.className = "button-container";

                // Create left buttons (Expand and Hide)
                const leftButtons = document.createElement("div");
                leftButtons.appendChild(createButton("Expand", () => expandToFullscreen(index)));
                leftButtons.appendChild(createButton("Hide", () => {
                    toggleStream(index, false);
                    syncUIWithToggleStates();
                }));
                leftButtons.appendChild(createButton("<", () => moveVideoUp(index)));
                leftButtons.appendChild(createButton(">", () => moveVideoDown(index)));

                // Create right buttons (+ColumnSpan, Reset Column Span, -ColumnSpan)
                const rightButtons = document.createElement("div");
                rightButtons.className = "right"; // For right alignment
                rightButtons.appendChild(createButton("+ColumnSpan", () => {
                    increaseVideoSize(index);
                    updateButtonVisibility();
                }));
                rightButtons.appendChild(createButton("Reset Column Span", () => {
                    resetVideoSize(index);
                    updateButtonVisibility();
                }));
                rightButtons.appendChild(createButton("-ColumnSpan", () => {
                    decreaseVideoSize(index);
                    updateButtonVisibility();
                }));

                // Append left and right buttons to the button container
                buttonContainer.appendChild(leftButtons);
                buttonContainer.appendChild(rightButtons);

                // Append all elements to the video wrapper
                videoWrapper.append(title, video, buttonContainer);
                videoContainer.appendChild(videoWrapper);

                setupHlsPlayer(video, stream.url);
            }

            function setupHlsPlayer(video, url0, retries = 3) {
                url = proxyUrl + url0;
                if (Hls.isSupported()) {
                    const hls = new Hls({
                        startLevel: -1, // Start at auto quality
                        maxBufferLength: 10, // Reduce buffer size
                        capLevelToPlayerSize: true,
                        minAutoBitrate: 1000000, // Set minimum bitrate to prioritize lower-quality streams
                        manifestLoadingRetryDelay: 500, // Retry delay for loading the manifest
                        levelLoadingRetryDelay: 500, // Retry delay for levels
                        maxMaxBufferLength: 20,
                        maxBufferSize: 60 * 1000 * 500, // 500KB max buffer size
                        maxBackBufferLength: 30,
                        lowLatencyMode: true, // Enable low-latency playback
                        liveSyncDuration: 3,  // Synchronize more closely with the live stream
                        liveMaxLatencyDuration: 5,
                        xhrSetup: function (xhr, url) {
                            xhr.withCredentials = false;
                            //xhr.mode = "no-cors";
                        }
                    });
                    hls.loadSource(url);  // Load the source after a delay
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
                    hls.on(Hls.Events.ERROR, (event, data) => {
                        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && retries > 0) {
                            console.log(`Retrying stream ${url} (${retries} retries left)...`);
                            setTimeout(() => setupHlsPlayer(video, url0, retries - 1), 2000);
                        }
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                    video.addEventListener('loadedmetadata', () => video.play());
                    video.addEventListener('error', () => {
                        if (retries > 0) {
                            console.log(`Retrying stream ${url} (${retries} retries left)...`);
                            setTimeout(() => setupHlsPlayer(video, url0, retries - 1), 2000);
                        }
                    });
                } else {
                    alert("Your browser does not support HLS streaming.");
                }
            }

            function getVideoOrder() {
                videoOrder = Array.from(videoContainer.children).map(wrapper => wrapper.id);
            }

            function moveVideoUp(index) {
                const videoWrapper = document.getElementById(`videoWrapper${index}`);
                const parent = videoWrapper.parentNode;
                const previousWrapper = videoWrapper.previousElementSibling;
                if (previousWrapper) {
                    parent.insertBefore(videoWrapper, previousWrapper);
                    updateURL();
                }
            }

            function moveVideoDown(index) {
                const videoWrapper = document.getElementById(`videoWrapper${index}`);
                const parent = videoWrapper.parentNode;
                const nextWrapper = videoWrapper.nextElementSibling;
                if (nextWrapper) {
                    parent.insertBefore(nextWrapper, videoWrapper); // Move it after the next sibling
                    updateURL();
                }
            }

            function expandToFullscreen(index) {
                const video = document.getElementById(`fishtankVideo${index}`);
                const stream = streams[index];
                video.pause();
                setTimeout(() => {
                    window.location.href = `fullscreen.html?url=${encodeURIComponent(stream.url)}&title=${encodeURIComponent(stream.title)}&toggles=${encodeURIComponent(toggleStates)}&columns=${encodeURIComponent(columnSelect.value)}&videoOrder=${encodeURIComponent(videoOrder)}`;
                }, 100);
            }

            function updateButtonVisibility() {
                const selectedValue = document.getElementById("columnSelect").value;
                const videoPlayers = document.querySelectorAll(".video-player");

                videoPlayers.forEach(videoPlayer => {
                    // Get the column span for the current video player
                    const columnSpan = parseInt(videoPlayer.style.gridColumn.split(' ')[1]);

                    const buttons = videoPlayer.querySelectorAll("button");

                    buttons.forEach(button => {
                        // Always show Expand and Hide buttons
                        if (button.textContent === "Expand" || button.textContent === "Hide" || button.textContent === "<" || button.textContent === ">") {
                            button.style.display = "block";
                        } else if (selectedValue === "auto") {
                            // Hide +ColumnSpan, -ColumnSpan, and Reset Column Span buttons when auto is selected
                            if (button.textContent === "+ColumnSpan" || button.textContent === "-ColumnSpan" || button.textContent === "Reset Column Span") {
                                button.style.display = "none";
                            }
                        } else {
                            // Logic for showing +ColumnSpan and -ColumnSpan based on columnSpan comparison
                            if (columnSpan < selectedValue && button.textContent === "+ColumnSpan") {
                                button.style.display = "block"; // Show +ColumnSpan
                            } else if (columnSpan > 1 && button.textContent === "-ColumnSpan") {
                                button.style.display = "block"; // Show -ColumnSpan
                            } else {
                                if (button.textContent === "+ColumnSpan" || button.textContent === "-ColumnSpan") {
                                    button.style.display = "none"; // Hide them if conditions aren't met
                                }
                            }

                            // Show Reset Column Span if columnSpan is not 1
                            if (columnSpan !== 1 && button.textContent === "Reset Column Span") {
                                button.style.display = "block";
                            } else if (button.textContent === "Reset Column Span") {
                                button.style.display = "none";
                            }
                        }
                    });
                });
            }

            function increaseVideoSize(index) {
                const videoWrapper = document.getElementById(`videoWrapper${index}`);
                let currentColumnSpan = parseInt(videoWrapper.style.gridColumn.split(' ')[1]);
                if (currentColumnSpan < columnSelect.value) {
                    currentColumnSpan++;
                    videoWrapper.style.gridColumn = `span ${currentColumnSpan}`;
                }
            }

            function resetVideoSize(index) {
                const videoWrapper = document.getElementById(`videoWrapper${index}`);
                videoWrapper.style.gridColumn = `span ${1}`;
            }

            function decreaseVideoSize(index) {
                const videoWrapper = document.getElementById(`videoWrapper${index}`);
                let currentColumnSpan = parseInt(videoWrapper.style.gridColumn.split(' ')[1]);
                if (currentColumnSpan > 1) {
                    currentColumnSpan--;
                    videoWrapper.style.gridColumn = `span ${currentColumnSpan}`;
                }
            }

            function syncUIWithToggleStates() {
                streams.forEach((_, index) => {
                    const checkbox = document.getElementById(`streamCheckbox${index}`);
                    checkbox.checked = toggleStates[index];
                    toggleStreamDisplay(index, toggleStates[index]);
                });
                updateVideoGrid();
            }

            function toggleCheckboxContainer() {
                checkboxContainer.style.display = checkboxContainer.style.display === "none" ? "grid" : "none";
            }

            function updateVideoGrid() {
                const selectedValue = columnSelect.value;
                const activePlayers = toggleStates.filter(state => state).length;

                if (selectedValue === "auto") {
                    const videoPlayers = document.querySelectorAll(".video-player");

                    videoPlayers.forEach(videoPlayer => {
                        videoPlayer.style.gridColumn = `span ${1}`;
                    });
                    // Default auto layout logic
                    const columns = Math.ceil(Math.sqrt(activePlayers));
                    videoContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
                } else {
                    // Fixed columns based on dropdown selection
                    videoContainer.style.gridTemplateColumns = `repeat(${selectedValue}, 1fr)`;
                }
                document.querySelectorAll(".video-player").forEach(player => {
                    player.style.width = 100;
                });
                updateButtonVisibility();
            }

            function updateURL() {
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.set('toggles', toggleStates);
                urlParams.set('columns', columnSelect.value);
                urlParams.set('videoOrder', videoOrder.join(','));
                urlParams.set('videoBrowsing', true);
                history.replaceState(null, "", "?" + urlParams.toString());
            }
        } catch (error) {
            //console.error("Error in player.js execution:", error);
            if (retries > 0) {
                //console.log(`Retrying player.js... (${retries} attempts left)`);
                setTimeout(() => loadPlayerScript(retries - 1), 1000); // Retry after 1 second
            } else {
                console.error("Failed to execute player.js after multiple attempts.");
            }
        }
    });
})();