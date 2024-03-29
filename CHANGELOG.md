### Version 6 (unreleased)

- Added: Drag-and-drop reordering of color rows
- Changed: Migrated to Vite for plugin logic builds
- Changed: Separated JSON-RPC API to the `figma-plugin-api` npm package
- Fixed: Hex inputs no longer change the component values on blur if the resulting hex value remains the same

### Version 5 (2023-08-09)

- Changed: Adjusted network access declaration in manifest

### Version 4 (2023-08-09)

- Added: arithmetic support for number inputs
- Added: Highlight rows and columns in the contrast table based on selected color
- Added: Figma theme support in plugin mode
  - Only updates when the plugin is restarted
- Added: Network access in Figma's plugin manifest
- Changed: Use Figma theme for picker ball colours
- Changed: Selected color's inputs are synced to the main inputs so either can be edited
- Changed: Improved hue stability when inputting hex colors
- Changed: Imperceptible changes from hex color input are discarded
- Changed: Migrated UI-plugin communication to JSON-RPC 2.0

### Version 3 (2023-03-13)

- Added: Color contrast checks in plugin mode
- Added: Popup for naming color styles when adding them to Figma
- Fixed: Layout fixes related to scroll bars and tooltips

### Version 2 (2023-02-24)

- Added: Touch support
- Added: Copy formatting (in standalone mode).
- Changed: Editable color is now selected by clicking on the color tile

### Version 1 (2023-02-21)
