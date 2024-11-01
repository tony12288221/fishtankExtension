# fishtankLiveViewer

fishtankExtension is a Chromium extension that allows users to view multiple live streams from various locations in a fishtank live website. Users can toggle streams on and off, and expand individual streams to fullscreen.

## Features

- View multiple live streams in a single interface.
- Toggle streams on and off with checkboxes.
- Expand streams to fullscreen for an immersive experience.
- User-friendly interface with a dropdown button for easy navigation.

## Installation

1. **Download the source code:**
   - Clone the repository or download it as a ZIP file.

2. **Load the extension in your browser:**
   - For **Google Chrome**:
     - Open Chrome and go to `chrome://extensions/`.
     - Enable "Developer mode" in the top right corner.
     - Click on "Load unpacked" and select the directory where you saved the source code.
   - Similar steps for all Chromium browsers (e.g. Brave browser has `brave://extensions`).
     
3. **Start using the extension:**
   - Click on the fishtankliveViewer icon in your browser's toolbar to open the extension.

## Usage

- Select streams to display using the checkboxes.
- Click "Expand" to view a stream in fullscreen mode.
- Use the "Select All" and "Deselect All" buttons for quick management of your stream selections.

## Configuration

- The extension automatically saves the state of the toggles using URL parameters, allowing for persistence between sessions of fullscreen and multi video viewing.

## Contributing

This is my first go at this. If you have suggestions for improvements or find bugs, feel free to open an issue (or suggest in the threads, ill be lurking).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the developers of HLS.js for their library that enables HLS streaming in the browser.
