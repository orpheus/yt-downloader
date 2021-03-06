# Get Started

```
git clone https://github.com/orpheus/yt-downloader.git
cd yt-downloader
npm install
```
# ffmpeg

You need to install `ffmpeg` onto your system. For mac, just do 

`brew install ffmpeg`

If you have the location, you can either harcode it in or set it via an env var

`FFMPEG=path/to/ffmpeg node main.js`

# Add tracks to download

In `downloadTracks.js` create and export an object with the name as the key and the youtube url as the value.

`module.exports = {
	'A*S*Y*S - The Acid (Acid 2019)': 'https://www.youtube.com/watch?v=n2PIhVwh3yA'
}`

Add as many as you'd like and run the program.

# Run

`node main`

# Use namespaces

You can pass a namespace to the main command and it will download your files into a folder with the specified namespace name. The default namespace is `library` and will be used if one is not passed.

`node main.js <namespace> // directory to store downloads inside the ./downloads/<namespace>
folder`

# Errors and History Logs

If any errors occure during the process, it will not stop the script. You will see a log of the error in the process and the elements that errored will be logged to an `errors.js` file which you can use to keep track of which elements were not downloaded. Copy and paste this object into `tracksToDownload` if you want to retry. The errors object will always be for the last process. It does not keep a history of all errors for every time ran.

Each succesffuly downloaded track will be logged to a `history.js` file and set according to the namespace used. See `history.js` after a download for an example. This can be used to share with friends to easily copy/paste track data to download.