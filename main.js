const fs = require('fs');
const ytdl = require('ytdl-core');
const exec = require('child_process').execSync

const name = 'Gesa Boiler Room.mp4'
const url = 'https://www.youtube.com/watch?v=8k4UzJnH504'
const surdir = 'Music'
const subdir = 'downloads'

const res = ytdl(url)
	.pipe(fs.createWriteStream(`./downloads/${name}`))

res.on('finish', () => {
	try {
		exec(`mkdir ~/${surdir}/${subdir}`)
	} catch (_) {}
	exec(`mv "./downloads/${name}" ~/${surdir}/${subdir}/`)
	console.log('done')
	process.exit()
})

