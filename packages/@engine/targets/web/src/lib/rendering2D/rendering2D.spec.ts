import 'jest-canvas-mock'

import {
	initialize2DRenderingModule,
	getCanvas,
	getContext,
	clearCanvas,
	drawRect,
	drawCircle,
	drawText,
	drawImageFromFilePath,
	_resetModule,
} from './rendering2D'

jest.mock('tiny-invariant', () => ({
	default: jest.fn((condition, message) => {
		if (!condition) {
			throw new Error(message)
		}

		return condition
	}),
}))

describe('2D rendering module', () => {
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('initializes correctly', () => {
		initialize2DRenderingModule()

		const canvas = getCanvas()
		const context = getContext()

		expect(canvas).toBeInstanceOf(HTMLCanvasElement)
		expect(canvas.width).toBe(window.innerWidth)
		expect(canvas.height).toBe(window.innerHeight)
		expect(context).toBeInstanceOf(CanvasRenderingContext2D)
	})

	it('throws an error when attempting to get context or clear the canvas without initialization', () => {
		_resetModule()
		
		expect(getContext).toThrow(
			'Module not initialized. Call initialize2DRenderingModule() first.'
		)
		expect(clearCanvas).toThrow(
			'Module not initialized. Call initialize2DRenderingModule() first.'
		)
	})

	it('clears the canvas', () => {
		initialize2DRenderingModule()
		drawRect({ x: 0, y: 0, width: 100, height: 100, color: '#ff0000' })

		clearCanvas()

		const canvas = getCanvas()
		const context = getContext()

		expect(
			context.getImageData(0, 0, canvas.width, canvas.height).data
		).toEqual(new Uint8ClampedArray(canvas.width * canvas.height * 4))
	})

	it('draws a rectangle', () => {
		initialize2DRenderingModule()

		drawRect({ x: 0, y: 0, width: 100, height: 100, color: '#ff0000' })

		const context = getContext()

		expect(context.fillStyle).toBe('#ff0000')
		expect(context.fillRect).toHaveBeenCalledWith(0, 0, 100, 100)
	})

	it('draws a circle', () => {
		initialize2DRenderingModule()

		drawCircle({ x: 50, y: 50, radius: 25, color: '#0000ff' })

		const context = getContext()

		expect(context.fillStyle).toBe('#0000ff')
		expect(context.beginPath).toHaveBeenCalled()
		expect(context.arc).toHaveBeenCalledWith(50, 50, 25, 0, 2 * Math.PI)
		expect(context.fill).toHaveBeenCalled()
	})

	it('draws text', () => {
		initialize2DRenderingModule()

		drawText({ x: 50, y: 50, text: 'Hello, world!', color: '#00ff00' })

		const context = getContext()

		expect(context.fillStyle).toBe('#00ff00')
		expect(context.fillText).toHaveBeenCalledWith('Hello, world!', 50, 50)
	})

	it('draws an image from a file path', () => {
		initialize2DRenderingModule()

		drawImageFromFilePath({
			x: 0,
			y: 0,
			width: 100,
			height: 100,
			filePath: 'path/to/image.png',
		})

		const context = getContext()

		expect(context.drawImage).toHaveBeenCalled()
		expect(context.drawImage).toHaveBeenCalledWith(
			expect.any(Image),
			0,
			0,
			100,
			100
		)
	})
})
