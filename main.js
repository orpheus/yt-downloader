const fs = require('fs');
const ytdl = require('ytdl-core');
const exec = require('child_process').execSync

// need to install ffmpeg on your system first
// brew install ffmpeg
const ffmpeg = require('fluent-ffmpeg')

const [node, pwd, dirname, ext] = process.argv

const errors = new Map()

function printErrorMap () {
	const arr = []
	errors.forEach((url, name) => { arr.push([name, url]) })
	if (arr.length !== 0) {
		console.log('Error map:\n', JSON.stringify(arr, null, 2))		
	}
}

const tracksToDownload = require('./downloadTracks.js')

const downloadDir = `./downloads/${dirname || 'test'}`
if (!fs.existsSync(downloadDir)){
   fs.mkdirSync(downloadDir);
}

async function download (name, url) {
	return new Promise((res, rej) => {
		console.log('Downloading: ', name, url)
		const downloadPath = `${downloadDir}/${name}.${ext || 'mp3'}`
	
		const stream = ytdl(url)
		const proc = new ffmpeg({ source: stream })

		proc.setFfmpegPath('/usr/local/bin/ffmpeg').withAudioBitrate('192k')
		proc.saveToFile(downloadPath)

		proc.on('error', err => {
			console.error(`Error downloading ${name}: ${err}`)
			errors.set(name, url)
			res([name, url])
		})

		proc.on('end', () => {
			console.log(`Downloaded ${name}`)
			res([name, url])
		})
	})
	console.log('?')
}

async function downloadAll () {
	const promises = []
	for (const track of tracksToDownload) {
		const [name, url] = track
		promises.push(download(name, url))
	}

	const interval = setInterval(() => {
		console.log('Processing...')}, 3000)

	await Promise.all(promises)

	clearInterval(interval)
	console.log('Done')
	printErrorMap()
	process.exit()
}

downloadAll()
