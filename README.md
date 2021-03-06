# Get Started

```
git clone https://github.com/orpheus/yt-downloader.git
cd yt-downloader
mkdir downloads
npm install
```
# ffmpeg

You need to install `ffmpeg` onto your system. For mac, just do 

`brew install ffmpeg`

Else, install `ffmpeg`, get the path to the binary, and then update
line: 37 in `main.js` to update the path to the correct binary location.

# Run

`node main`

or 

`node main <dir> // directory to store downloads inside the ./downloads
folder`


