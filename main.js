const fs = require('fs');
const ytdl = require('ytdl-core');
const exec = require('child_process').execSync

const name = 'Runway_Christy-Turlington.mp4'
const url = 'https://www.youtube.com/watch?v=eyo45BPtL_w&list=PLM_UnpAX9rCnv32YxhNUtObfx2GoFcd3S&index=15&t=6s'
const subdir = 'Runway'

const res = ytdl(url)
	.pipe(fs.createWriteStream(`${name}`))

res.on('finish', () => {
	try {
		exec(`mkdir ~/Video/${subdir}`)
	} catch (_) {}
	exec(`mv ${name} ~/Video/${subdir}/`)
	console.log('done')
	process.exit()
})

