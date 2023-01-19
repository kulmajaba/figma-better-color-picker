# Better Color Picker

## Roadmap

### WCAG Color contrast checks

Possibilities
1. A UI to check if the color meets contrast requirements with a manually set color
2. Another list of colors to test contrast against
3. Calculate the grayscale values needed to fulfill a certain contrast ratio for a given color

[WCAG 2.1 success criterion 1.4.3](https://www.w3.org/TR/WCAG21/#contrast-minimum) defines the minimum contrast ratios for accessible web content color usage. They are as follows:
- 4,5:1 for text and 3:1 for large text and icons (AA)
- 7:1 for text and 4,5:1 for large text and icons (AAA)

Contrast ratio is calculated as

> (L1 + 0.05) / (L2 + 0.05), where

L1 is the relative luminance of the lighter of the colors, and
L2 is the relative luminance of the darker of the colors.
[Source](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio)

Relative luminance is the relative brightness of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white.

For the sRGB colorspace, the relative luminance of a color is defined as L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:

>if RsRGB <= 0.03928 then R = RsRGB/12.92 else R = ((RsRGB+0.055)/1.055) ^ 2.4
>
>if GsRGB <= 0.03928 then G = GsRGB/12.92 else G = ((GsRGB+0.055)/1.055) ^ 2.4
>
>if BsRGB <= 0.03928 then B = BsRGB/12.92 else B = ((BsRGB+0.055)/1.055) ^ 2.4

and RsRGB, GsRGB, and BsRGB are defined as:

>RsRGB = R8bit/255
>
>GsRGB = G8bit/255
>
>BsRGB = B8bit/255

The "^" character is the exponentiation operator. (Formula taken from [sRGB] and [IEC-4WD]). [Source](https://www.w3.org/TR/WCAG21/#dfn-relative-luminance)

### Caching XY picker imagedata

At the moment at every startup the plugin will calculate XY picker image data into memory, taking several seconds.

This is non-trivial to cache due to the architecture of the plugins and the size of the data. For reference, the data for 300px wide picker (300 first component (hue) values and 300x300px XY canvas) is about 105MB

Things that have been tried:
  - Using figma.clientStorage: aborts after timeout due to large size (apparently window.postMessage does send the data?)
  - Saving the data as static JSON file and bundling it with the plugin: big-json does not work in browser out of the box and it sucks to download that much data that could be calculated and saved locally

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

