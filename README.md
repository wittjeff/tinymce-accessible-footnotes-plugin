# TinyMCE Footnotes Plugin

This is a FOSS (Free and Open Source Software) plugin for TinyMCE 6.2+ that allows you to easily create footnotes that conform to WCAG ARIA specifications.

## Features

- Easily create and manage footnotes
- WCAG ARIA compliant

## Setup Guide

Follow these steps to set up the plugin in your TinyMCE environment:

### Prerequisites

- TinyMCE environment running on your machine

### Installation

1. **Edit your index.html file like this:**

   ```bash
   tinymce.init({
          selector: 'textarea',
          external_plugins: {
                'new-footnotes': 'https://wittjeff.github.io/tinymce-accessible-footnotes-plugin/new-footnotes/scratch/compiled/plugin.min.js',
                },
          plugins: 'new-footnotes',
          toolbar: 'new-footnotes',
   });

Usage
Once imported, the plugin will be available in the TinyMCE editor toolbar. You can use it to create footnotes that comply with WCAG ARIA specifications.

Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue if you encounter any problems or have suggestions for improvements.
