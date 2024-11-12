# Simple password generator

A simple application that shows how easy it is to create an extension for Google Chrome.

The extension generates a password based on the entered phrase.

The received password can be copied to the clipboard. Settings are stored in localeStorage.

To further dive into writing your own browser extensions, you should pay attention to storing data (for example, settings) in the user account (to synchronize settings on different devices) and interaction with the open page, tabs, etc.

## Installation

1. Clone the repository
2. Go to your browser's extensions settings (or at the url `chrome://extensions/`)
3. Enable developer mode
4. Click on the Load unpacked extension button `Load unpacked` (this will allow you to select the folder with your extension)
5. Select the folder with your extension

Your extension will be downloaded and will appear in the list of extensions. It should now be active and available for use.
