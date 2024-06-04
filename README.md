# TinyMCE Footnotes Plugin

This is a FOSS (Free and Open Source Software) plugin for TinyMCE 6.2+ that allows you to easily create footnotes that conform to WCAG ARIA specifications.

## Features

- Easily create and manage footnotes
- WCAG ARIA compliant

## Setup Guide

Follow these steps to set up the plugin in your TinyMCE environment:

### Prerequisites

- TinyMCE environment [running on your machine](https://www.tiny.cloud/docs/tinymce/latest/installation/)

### Installation

1. **Edit your index.html file like this:**

   ```bash
   tinymce.init({
          selector: 'textarea',
          external_plugins: {
                'a11y-footnotes': 'https://wittjeff.github.io/tinymce-accessible-footnotes-plugin/a11y-footnotes/scratch/compiled/plugin.min.js'
                },
          toolbar: 'a11y-footnotes',
   });

## Usage
Once imported, the plugin will be available in the TinyMCE editor toolbar. You can use it to create footnotes that comply with WCAG ARIA specifications.


Contributions are welcome! Please feel free to submit a pull request or open an issue if you encounter any problems or have suggestions for improvements.
