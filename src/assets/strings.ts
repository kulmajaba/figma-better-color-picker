const strings = {
  color: {
    hex: 'Hex'
  },
  tooltip: {
    copyColor: 'Copy color to clipboard in hex format',
    addColor: 'Add color to your styles',
    addColorToComparison: 'Add color to contrast comparison',
    deleteColorFromComparison: 'Delete color from contrast comparison'
  },
  label: {
    colorSpace: 'Color space',
    showContrastComparison: 'Show contrast comparison'
  },
  info: {
    info_1: `The Better Color Picker does a few things that make it better:
    <ol>
      <li>OKLab-based color spaces for more accurate control</li>
      <li>Ability to create palettes with multiple shades and lock desired values to the main controls</li>
      <li>Color contrast checks against a list of colors (in standalone mode)</li>
    </ol>
    You can select the color space from the header, as well as show or hide the color contrast checks. The graphical
    pickers, eyedropper and the two text inputs in the main section are all tied together and also control the
    locked sections of the color table. You can start creating different shades of the same hue by unlocking some of
    the sections of the table, and inputting individual values.`,
    info_2_figma: 'Use the plus button to add the color to your style library.',
    info_2_standalone: 'Use the double arrow button to add a color into the color contrast checks.',
    info_3_plugin: `This picker is currently in plugin mode. Visit <a href="https://colorpicker.kulmajaba.com" target="_blank" rel="noopener noreferrer">colorpicker.kulmajaba.com</a> to use the picker in standalone mode.`
  }
};

export default strings;
