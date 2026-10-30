# SmartSip – Arduino Water Dispenser Website

## Project files
- `index.html` – interactive browser simulator
- `style.css` – simulator styling
- `script.js` – working simulator controls and event logging
- `project-guide.html` – project overview, materials, proposed connections, build steps, and operation
- `guide.css` – guide styling
- `photos.html` – webpage photo gallery with image download links
- `photos.css` – photo gallery styling
- `assets/` – generated concept photos, dashboard art, and build infographic

## Run
Extract the folder and open `index.html` in a modern browser. Open `project-guide.html` for documentation and `photos.html` for the image gallery.

## Simulator controls
- Dispense portion: dispenses the selected amount from the simulated tank.
- Auto dispense: repeats the selected portion until stopped or the tank is empty.
- Stop: ends automatic dispensing.
- Refill tank: sets the tank to 100% and resets the session volume.
- Reset simulation: restores the original 70% tank state.
- Export log: downloads the event history as a text file.
- Clear log: clears the displayed event history.

## Important
This is a front-end simulator and does not control physical Arduino hardware. Parts and wiring in the guide are proposed prototype guidance and must be checked against actual component datasheets. The images are generated concept illustrations, not evidence of a completed physical build.
