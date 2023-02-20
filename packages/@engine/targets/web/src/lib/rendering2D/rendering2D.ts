export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600

const canvas = document.createElement('canvas')
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT
document.body.appendChild(canvas)

const context = canvas.getContext('2d') as CanvasRenderingContext2D

if (!context) {
	throw new Error('Could not get 2D context from canvas.')
}

export function getCanvas() {
	return canvas
}

export function getContext() {
	return context
}

export function clearCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height)
}

export function drawRect(params: {
	x: number
	y: number
	width: number
	height: number
	color: string
}) {
	context.fillStyle = params.color
	context.fillRect(params.x, params.y, params.width, params.height)
}

export function drawCircle(params: {
	x: number
	y: number
	radius: number
	color: string
}) {
	context.fillStyle = params.color
	context.beginPath()
	context.arc(
		params.x + params.radius,
		params.y + params.radius,
		params.radius,
		0,
		2 * Math.PI
	)
	context.fill()
}

export function drawText(params: {
	x: number
	y: number
	text: string
	color: string
	font?: string
}) {
	context.fillStyle = params.color
	context.font = params.font || '30px Arial'
	context.fillText(params.text, params.x, params.y)
}

export function drawImageFromFilePath(params: {
	x: number
	y: number
	width: number
	height: number
	filePath: string
}) {
	const image = new Image()
	image.src = params.filePath
	context.drawImage(image, params.x, params.y, params.width, params.height)
}
