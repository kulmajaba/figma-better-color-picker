# Better Color Picker

The same thing, just a bit better.

This is a Figma plugin and a standalone website for color picking with some added features:

1. OKLab color spaces for more accurate control
2. Ability to create color palettes by locking some of the color values and editing others individually
3. Color contrast checks based on WCAG 2.1 guidelines

If you want to ask a question about the picker, head over to [Discussions](https://github.com/kulmajaba/figma-better-color-picker/discussions)!

If you encountered a bug you'd like to report, check the [Issues](https://github.com/kulmajaba/figma-better-color-picker/issues) to see if someone has already reported it, or create a new issue if you can't find one that matches your description.

## Roadmap

- Nested styles with SUIT css (e.g. Button svg)
- ContrastCheckerCell style

- Heading for contrast table
  - Mention WCAG somewhere in there (build support for other contrast calculations)
- Label color input components when there is enough space?
- Using Figma theme when available
  - For a Figma plugin with the `themeColors` option set, Figma sets a style element into the iframe with color variables prefixed with `--figma-`. However the plugin code is hosted so the style, along with any other HTML in the iframe, is discarded as soon as the plugin navigates to the hosted site.
  - One option would be to use `postMessage` to send the colors to the plugin logic, navigate to the hosted UI and then post the colors back to the UI where they would be set via JS. Quite complicated for some theme colors.
  - Any changes in the theme colors (changing from/to dark mode) are not detected either

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

## Development

The plugin is based on Node.js, ensure you have a modern LTS version on your computer or use nvm to manage your Node versions:

```bash
nvm use
npm install
npm start
```

## Production

Build Figma plugin code and UI code:

```bash
npm run build
```

The UI deploy is done with GitHub Actions, set the repository secrets to match your production environment.
The host SSH fingerprint can be found with `ssh-keyscan <host>`
