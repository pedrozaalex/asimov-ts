import invariant from 'tiny-invariant'

let canvas: HTMLCanvasElement | null = null
let context: CanvasRenderingContext2D | null = null

export function initialize2DRenderingModule() {
	canvas = document.createElement('canvas')

	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	document.body.appendChild(canvas)

	context = canvas.getContext('2d')
}

export function _resetModule() {
	canvas = null
	context = null
}

export function getCanvas() {
  invariant(
    canvas,
    'Module not initialized. Call initialize2DRenderingModule() first.'
  )
  
	return canvas
}

export function getContext() {
	invariant(
		context,
		'Module not initialized. Call initialize2DRenderingModule() first.'
	)

	return context
}

export function clearCanvas() {
	invariant(
		context && canvas,
		'Module not initialized. Call initialize2DRenderingModule() first.'
	)

	getContext().clearRect(0, 0, canvas.width, canvas.height)
}

export function drawRect(params: {
	x: number
	y: number
	width: number
	height: number
	color: string
}) {
	getContext().fillStyle = params.color
	getContext().fillRect(params.x, params.y, params.width, params.height)
}

export function drawCircle(params: {
	x: number
	y: number
	radius: number
	color: string
}) {
	getContext().fillStyle = params.color
	getContext().beginPath()
	getContext().arc(params.x, params.y, params.radius, 0, 2 * Math.PI)
	getContext().fill()
}

export function drawText(params: {
	x: number
	y: number
	text: string
	color: string
	font?: string
}) {
	getContext().fillStyle = params.color
	getContext().font = params.font || '30px Arial'
	getContext().fillText(params.text, params.x, params.y)
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
	getContext().drawImage(image, params.x, params.y, params.width, params.height)
}
