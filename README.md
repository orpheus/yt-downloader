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

# Add tracks to download

In `downloadTracks.js` create an array with the name and url of the track you want to download.

`[name, url]`

Add as many as you'd like and run the program.

# Run

`node main`

or 

`node main <dir> // directory to store downloads inside the ./downloads
folder`

# Errors

If any errors occure during the process, it will not stop the script. It will add the tracks that errored to a map and when the process is finished will log it as an array so you can copy and paste those tracks back into `downloadTracks.js` to try again with just the tracks that didn't work.

If an error occurs, the specific error will be logged as well so you can decide if you want to try again with that track.
