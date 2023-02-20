# Better Color Picker

## TODO

- Spacing the lock buttons in grid causes them to drift out of alignment with the color input fields

## Roadmap

### Undo history???

Would be nice if you accidentally delete a color row etc.

### URL parameters

Adding URL parameters (or storing some parameters locally) would allow the user to continue where they left off, or create a permalink with their color palette for quick contrast checks with new colors.

Parameters would include color space, current colors and comparison colors.

### Coloring contrast check results

WCAG 2.1 has two different passing grades, AA and AAA and the required contrast differs for different elements such as small text, large text, icons and UI elements. It would be nice to color code the contrast results in some way but it might be too difficult and confusing to the user.

### WCAG 3 Color contrast checks

The current implementation is WCAG 2.1 and is useful on its own, but could support multiple options.

### Caching XY picker imagedata

At the moment at every startup the plugin will calculate XY picker image data into memory, taking several seconds.

This is non-trivial to cache due to the architecture of the plugins and the size of the data. For reference, the data for 300px wide picker (300 first component (hue) values and 300x300px XY canvas) is about 105MB

Things that have been tried:
  - Using figma.clientStorage: aborts after timeout due to large size (apparently window.postMessage does send the data?)
  - Saving the data as static JSON file and bundling it with the plugin: big-json does not work in browser out of the box and it sucks to download that much data that could be calculated and saved locally

### Better ToolTip component

Currently the tooltip repositions itself on window resizes and when certain props (given to the tooltip) change. it would be nicer to have the tooltip automatically reposition when the page layout changes, but `useLayoutEffect` causes and endless loop that is difficult to stop as the repositioning of the tooltip is a layout change in itself.

## Development

The plugin is based on Node.js, ensure you have a modern LTS version on your computer.

```bash
npm install
npm start
```

## Production

Build Figma plugin code and UI code:

```bash
npm run build:prod
```

The UI deploy is done with GitHub Actions, set the repository secrets to match your production environment.
The host SSH fingerprint can be found with `ssh-keyscan <host>`

