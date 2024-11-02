document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoUrl = urlParams.get('url');
    const title = urlParams.get('title');
    const togglesString = urlParams.get('toggles');
    const columnNum = urlParams.get('columns');
    const videoorderString = urlParams.get('videoOrder');

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

    // Parse the toggles parameter
    let toggleStates = [];
    if (togglesString) {
        toggleStates = togglesString.split(',').map(toggle => toggle.trim() === 'true');
    }

    let videoorder = [];
    if (videoorder) {
        videoorder = videoorderString.split(',');
        videoWrapperIDs = indexFromvideoWrapper();
    }

    // Filter active streams based on toggle states
    //const activeStreams = streams.filter((_, index) => toggleStates[index]);
    const activeStreams = videoWrapperIDs.map(index => streams[index]);

    let currentIndex = activeStreams.findIndex(stream => stream.url === videoUrl);
    const video = document.getElementById('fullscreenVideo');
    let hls; // Declare HLS instance globally

    // Set the title in the document
    if (title) {
        document.getElementById('fullscreenTitle').textContent = title;
    }

    function indexFromvideoWrapper() {
        const videoNumbers = videoorder.map(wrapper => {
            const match = wrapper.match(/\d+/); // Match one or more digits
            return match ? parseInt(match[0], 10) : null; // Convert to integer or return null if no match
        }).filter(num => num !== null); // Filter out any null values
        return videoNumbers
    }

    function loadVideo(index) {
        // Cleanup previous HLS instance if it exists
        if (hls) {
            hls.destroy(); // Destroy previous instance
        }

        // Adjust the index to wrap around cyclically
        if (index >= activeStreams.length) {
            index = 0; // If index exceeds the length, go back to the first stream
        } else if (index < 0) {
            index = activeStreams.length - 1; // If index is negative, go to the last stream
        }
        
        if (index >= 0 && index < activeStreams.length) {
            const stream = activeStreams[index];
            hls = new Hls({
                maxBufferLength: 20,
                capLevelToPlayerSize: true,
                minLevel: 1 // Adjust according to your stream quality levels
            });
            hls.loadSource(stream.url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
            document.getElementById('fullscreenTitle').textContent = stream.title;
        } else {
            alert("Invalid video index.");
        }
    }

    function updateURL(currentIndex) {
        const params = new URLSearchParams(window.location.search);
        const stream = activeStreams[currentIndex]
        params.set('url', stream.url)
        params.set('title', stream.title)
        params.set('toggles', toggleStates);
        params.set('columns', columnNum);
        params.set('videoOrder', videoorder);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        history.replaceState({}, '', newUrl);
    }

    // Load the initial video
    loadVideo(currentIndex);
    updateURL(currentIndex);

    // Add event listeners for the navigation buttons
    document.querySelector('.left-button').addEventListener('click', function() {
        video.pause(); // Pause the video before redirecting
        currentIndex = (currentIndex - 1 + activeStreams.length) % activeStreams.length; // Cycle left
        loadVideo(currentIndex);
        updateURL(currentIndex);
    });

    document.querySelector('.right-button').addEventListener('click', function() {
        video.pause(); // Pause the video before redirecting
        currentIndex = (currentIndex + 1) % activeStreams.length; // Cycle right
        loadVideo(currentIndex);
        updateURL(currentIndex);
    });

    // Add event listener for the exit button
    document.querySelector('.exit-button').addEventListener('click', function() {
        video.pause(); // Pause the video before redirecting
        setTimeout(() => {
            const prevToggles = toggleStates.map((state, index) => (state ? 'true' : 'false')).join(',');
            window.location.href = `player.html?toggles=${prevToggles}&columns=${columnNum}&videoOrder=${videoorder}`; // Redirect back to the main player page with previous toggle states        
        }, 100);
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowLeft':
                // Trigger left button functionality
                document.querySelector('.left-button').click();
                break;
            case 'ArrowRight':
                // Trigger right button functionality
                document.querySelector('.right-button').click();
                break;
            case 'Escape':
                // Trigger exit button functionality
                document.querySelector('.exit-button').click();
                break;
        }
    });
});
