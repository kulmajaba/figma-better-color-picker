# Better Color Picker

Figma Plugin: https://www.figma.com/community/plugin/1209779625070339366/better-color-picker

Standalone web app: https://colorpicker.kulmajaba.com/

The same thing, just a bit better.

This is a Figma plugin and a standalone website for color picking with some added features:

1. OKLab color spaces for more accurate control
2. Ability to create color palettes by locking some of the color values and editing others individually
3. Color contrast checks based on WCAG 2.1 guidelines

If you want to ask a question about the picker, head over to [Discussions](https://github.com/kulmajaba/figma-better-color-picker/discussions)!

If you encountered a bug you'd like to report, check the [Issues](https://github.com/kulmajaba/figma-better-color-picker/issues) to see if someone has already reported it, or create a new issue if you can't find one that matches your description.

## TODO:

- Use history state to change all colors and color space when necessary
- Fix dragging indicators

## Roadmap

- Heading for contrast table
  - Mention WCAG somewhere in there (build support for other contrast calculations)
- Label color input components when there is enough space?
- Local storage for current state
  - Save as palette, with autosave and manually saved state
- When a color row/column is deleted and is currently selected for editing, switch selection to the next available row/column
- Moving the entrypoint HTML to separate files
  - Non-trivial, since the entrypoint HTML would need to be bundled to contain the JS, then the bundle needs to be imported as text into `plugin.js`
- Use RPC notifications when possible to avoid unnecessary messages
- Add `"componentName": "[A-Z]+",` back to `.stylelintrc` when a new version of `stylelint-selector-bem-pattern` is available
- Shift-dragging to lock a value in the XY picker
  - Or click and drag on the number inputs
- Variable support
- See if the package could be minified, previously this caused errors but mathjs is also very large

### URL parameters

Adding URL parameters (or storing some parameters locally) would allow the user to continue where they left off, or create a permalink with their color palette for quick contrast checks with new colors.

Parameters would include color space, current colors and comparison colors.

### Coloring contrast check results

WCAG 2.1 has two different passing grades, AA and AAA and the required contrast differs for different elements such as small text, large text, icons and UI elements. It would be nice to color code the contrast results in some way but it might be too difficult and confusing to the user.

### WCAG 3 Color contrast checks

The current implementation is WCAG 2.1 and is useful on its own, but could support multiple options.

### More efficient picker rendering

OkColor achieves this with WebGL rendering, which is the way to go. the picker image data could also be calculated using WebGPU API, making it more performant.

## Development

The plugin is based on Node.js, ensure you have a modern LTS version on your computer or use nvm to manage your Node versions:

```bash
nvm use
npm install
npm start
```

Chrome console filter

```
-/^The resource|\[MultiplayerSession\]|afterJoinEnd/
```

### CSS

CSS follows the SUIT naming convention (https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md) except for variables which are kebab-cased, use Stylelint (standalone or VS Code plugin) to lint. Quick explanation of the class selector pattern (Double-escaped for JS string):

```regexp
^\\.{componentName}(?:-[a-z]+[A-z]*)?(?:--[a-z]+[A-z]*)?(?:\\.is-[a-z]+[A-z]*)?(?:\\[.+\\])?$

# ComponentName
\\.{componentName}

# -descendantName
(?:-[a-z]+[A-z]*)?

# --variantName
(?:--[a-z]+[A-z]*)?

# .is-stateName
(?:\\.is-[a-z]+[A-z]*)?

# type='number' etc.
(?:\\[.+\\])?
```

## Production

Build Figma plugin code and UI code:

```bash
npm run build
```

The UI deploy is done with GitHub Actions, set the repository secrets to match your production environment.
The host SSH fingerprint can be found with `ssh-keyscan <host>`
