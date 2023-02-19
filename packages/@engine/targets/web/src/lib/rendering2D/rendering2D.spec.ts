import 'jest-canvas-mock'

import {
	clearCanvas,
	drawRect,
	drawCircle,
	drawText,
	drawImageFromFilePath,
	getContext,
	getCanvas,
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
		const canvas = getCanvas()
		const context = getContext()

		expect(canvas).toBeInstanceOf(HTMLCanvasElement)
		expect(canvas.width).toBe(window.innerWidth)
		expect(canvas.height).toBe(window.innerHeight)
		expect(context).toBeInstanceOf(CanvasRenderingContext2D)
	})

	it('Should be able to clear the canvas', () => {
		drawRect({ x: 0, y: 0, width: 100, height: 100, color: '#ff0000' })

		clearCanvas()

		const canvas = getCanvas()
		const context = getContext()

		expect(
			context.getImageData(0, 0, canvas.width, canvas.height).data
		).toEqual(new Uint8ClampedArray(canvas.width * canvas.height * 4))
	})

	describe('drawRect', () => {
		it('Should draw a rectangle', () => {
			drawRect({ x: 0, y: 0, width: 100, height: 100, color: '#ff0000' })

			const context = getContext()

			expect(context.fillStyle).toBe('#ff0000')
		})
	})

	it('Should be able to draw a circle', () => {
		drawCircle({ x: 50, y: 50, radius: 25, color: '#0000ff' })

		const context = getContext()

		expect(context.fillStyle).toBe('#0000ff')
		expect(context.beginPath).toHaveBeenCalled()
		expect(context.arc).toHaveBeenCalledWith(75, 75, 25, 0, 2 * Math.PI)
		expect(context.fill).toHaveBeenCalled()
	})

	it('Should be able to draw text', () => {
		drawText({ x: 50, y: 50, text: 'Hello, world!', color: '#00ff00' })

		const context = getContext()

		expect(context.fillStyle).toBe('#00ff00')
		expect(context.fillText).toHaveBeenCalledWith('Hello, world!', 50, 50)
	})

	it('Should be able to draw an image from a file path', () => {
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
