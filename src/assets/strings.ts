const strings = {
  color: {
    hex: 'Hex',
    hexWithAlpha: 'Hex with alpha',
    rgba: 'RGBA'
  },
  tooltip: {
    copyColor: 'Copy color to clipboard',
    addColorRow: 'Add a color row',
    addColorToStyles: 'Add color to your styles',
    addColorToChecker: 'Add color to contrast checker',
    deleteColorFromChecker: 'Delete color from contrast checker'
  },
  label: {
    colorSpace: 'Color space',
    copyFormat: 'Copy format',
    contrastChecker: 'Contrast checker',
    hsv: 'HSV',
    hsl: 'HSL',
    hex: 'Hex'
  },
  info: {
    title: 'Help',
    info_1: `The Better Color Picker does a few things that make it better:
    <ol>
      <li>OKLab-based color spaces for more accurate control</li>
      <li>Ability to create palettes with multiple shades and lock desired values together</li>
      <li>Color contrast checks against user-definable colors (WCAG 2.1)</li>
    </ol>
    You can select the color space from the header as well as show or hide the color contrast checks. The graphical
    pickers, eyedropper and the two text inputs in the main section are all tied together and also control the
    locked sections of the color table.
    <br /><br />
    You can start creating different shades of the same hue by unlocking some of the sections of the table,
    selecting the color rows and editing them individually. Use the double arrow buttons to add color rows or
    contrast colors.`,
    info_2_figma: 'Use the plus button to add the color to your style library.',
    info_2_standalone: 'Set the copy format from the header and copy a color to clipboard by clicking the copy button.',
    info_3_plugin: `This picker is currently in plugin mode. Visit <a href="https://colorpicker.kulmajaba.com" target="_blank" rel="noopener noreferrer">colorpicker.kulmajaba.com</a> to use the picker in standalone mode.`
  }
};

export default strings;
