const fs = require('fs');
const ytdl = require('ytdl-core');
const exec = require('child_process').execSync

// need to install ffmpeg on your system first
// brew install ffmpeg
const ffmpeg = require('fluent-ffmpeg')
const ffmpeg_bin_path = process.env.FFMPEG || '/usr/local/bin/ffmpeg'

const [node, pwd, dirname, ext] = process.argv

const tracksToDownload = require('./downloadTracks.js')

const namespace = dirname || 'library'

const downloadDir = `./downloads/${namespace}`
if (!fs.existsSync(downloadDir)){
   fs.mkdirSync(downloadDir);
}

// log history of successful downloads
const historyMap = new Map()
// log of errored downloads
const errorMap = new Map()

function readFile (name) {
	return new Promise ((res, rej) => {
		fs.readFile(name, (err, data) => {
			if (err) rej(err)
			res(data)
		})
	})
}

function writeFile (name, data) {
	return new Promise ((res, rej) => {
		fs.writeFile(name, JSON.stringify(data, null, 2), (err) => {
			if (err) res(err)
			res()
		})
	})
}

function mapToObj (aMap) {
	const obj = {}
	aMap.forEach((url, name) => { obj[name] = url })
	return obj
}

async function logHistory () {
	let historyLog = mapToObj(historyMap)

	let history
	try {
		history = await readFile('history.js')		
	} catch (err) {
		console.log('Creating history file...')
	}

	let saveObject = {}

	// typeof history === 'Buffer<bytes>'
	if (history.length !== 0) {
		const stringifiedHistory = history.toString()
		history = JSON.parse(history)
		saveObject = {...history}

		if (saveObject[namespace]) {
			saveObject[namespace] = {...saveObject[namespace], ...historyLog}
		} else {
			saveObject[namespace] = historyLog
		}
	} else {
		saveObject[namespace] = historyLog
	}

	await writeFile('history.js', saveObject)
}


async function pipeErrors () {
	const errorLog = mapToObj(errorMap)
	if (errorMap.size !== 0) {
		console.log('Error map:\n', JSON.stringify(errorLog, null, 2))		
	}
	await writeFile('errors.js', errorLog)
}


async function download (name, url) {
	return new Promise((res, rej) => {
		console.log('Downloading: ', name, url)
		const downloadPath = `${downloadDir}/${name}.${ext || 'mp3'}`
	
		const stream = ytdl(url, { 
			filter: format => format.contentLength
		})
		const proc = new ffmpeg({ source: stream })
		proc
			.setFfmpegPath(ffmpeg_bin_path)
			.withAudioBitrate('192k')
			.saveToFile(downloadPath)
			.on('error', err => {
				console.error(`Error downloading ${name}: ${err}`)
				errorMap.set(name, url)
				res([name, url])
			})

			.on('end', () => {
				console.log(`Downloaded ${name}`)
				historyMap.set(name, url)
				res([name, url])
			})

	})
}

async function downloadAll () {
	const promises = []

	const tracks = Object.keys(tracksToDownload)
	for (const name of tracks) {
		const url = tracksToDownload[name]
		promises.push(download(name, url))
	}

	const interval = setInterval(() => {
		console.log('Processing...')}, 3000)

	await Promise.all(promises)

	clearInterval(interval)

	console.log('Logging history and errors...')

	await pipeErrors()
	await logHistory()

	console.log('Done')

	process.exit()
}

downloadAll()
