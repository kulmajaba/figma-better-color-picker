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

### Converting all current colors when switching color space

This requires that all color spaces have conversions to and from a common color space. This can be sRGB, but on the negative it will then clamp the color range to values within the sRGB gamut.

## Development instructions

Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/setup/

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
