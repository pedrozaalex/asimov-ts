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

describe('2D Rendering Module', () => {
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('Should be able to initialize itself correctly', () => {
		initialize2DRenderingModule()

		const canvas = getCanvas()
		const context = getContext()

		expect(canvas).toBeInstanceOf(HTMLCanvasElement)
		expect(canvas.width).toBe(window.innerWidth)
		expect(canvas.height).toBe(window.innerHeight)
		expect(context).toBeInstanceOf(CanvasRenderingContext2D)
	})

	it('Should throw an error when attempting to get context or clear the canvas without initialization', () => {
		_resetModule()
		
		expect(getContext).toThrow(
			'Module not initialized. Call initialize2DRenderingModule() first.'
		)
		expect(clearCanvas).toThrow(
			'Module not initialized. Call initialize2DRenderingModule() first.'
		)
	})

	it('Should be able to clear the canvas', () => {
		initialize2DRenderingModule()
		drawRect({ x: 0, y: 0, width: 100, height: 100, color: '#ff0000' })

		clearCanvas()

		const canvas = getCanvas()
		const context = getContext()

		expect(
			context.getImageData(0, 0, canvas.width, canvas.height).data
		).toEqual(new Uint8ClampedArray(canvas.width * canvas.height * 4))
	})

	it('Shoud be able to draw a rectangle', () => {
		initialize2DRenderingModule()

		drawRect({ x: 0, y: 0, width: 100, height: 100, color: '#ff0000' })

		const context = getContext()

		expect(context.fillStyle).toBe('#ff0000')
		expect(context.fillRect).toHaveBeenCalledWith(0, 0, 100, 100)
	})

	it('Should be able to draw a circle', () => {
		initialize2DRenderingModule()

		drawCircle({ x: 50, y: 50, radius: 25, color: '#0000ff' })

		const context = getContext()

		expect(context.fillStyle).toBe('#0000ff')
		expect(context.beginPath).toHaveBeenCalled()
		expect(context.arc).toHaveBeenCalledWith(50, 50, 25, 0, 2 * Math.PI)
		expect(context.fill).toHaveBeenCalled()
	})

	it('Should be able to draw text', () => {
		initialize2DRenderingModule()

		drawText({ x: 50, y: 50, text: 'Hello, world!', color: '#00ff00' })

		const context = getContext()

		expect(context.fillStyle).toBe('#00ff00')
		expect(context.fillText).toHaveBeenCalledWith('Hello, world!', 50, 50)
	})

	it('Should be able to draw an image from a file path', () => {
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
