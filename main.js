const fs = require('fs');
const ytdl = require('ytdl-core');
const exec = require('child_process').execSync
// need to install ffmpeg on your system first
// brew install ffmpeg
const ffmpeg = require('fluent-ffmpeg')

const [node, pwd, url, name, ext] = process.argv
const downloadPath = `./downloads/${name}.${ext || 'mp3'}`

const stream = ytdl(url)
const proc = new ffmpeg({ source: stream })
proc.setFfmpegPath('/usr/local/bin/ffmpeg').withAudioBitrate('192k')

const interval = setInterval(() => {
	console.log('Processing...')}, 3000)

proc.saveToFile(downloadPath)
proc.on('error', err => {
	console.log('Error', err)
	clearTimeout(interval)
	process.exit()
})
proc.on('end', () => {
	clearTimeout(interval)
	console.log('Done')
	process.exit()
})

