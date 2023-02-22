import { drawText } from '@asimov/web'

export interface ISubject {
	update(deltaTime: number): void
}

export class SimRunner {
	private subject: ISubject
	private lastTime: number
	private targetRefreshRate: number

	private interval: ReturnType<typeof setInterval> | undefined

	private fpsValueQueue: number[] = []

	constructor(subject: ISubject, targetRefreshRate = 60) {
		this.subject = subject
		this.lastTime = performance.now()
		this.targetRefreshRate = targetRefreshRate
	}

	private loop = () => {
		const time = performance.now()
		const deltaTime = (time - this.lastTime) / 1000 || 0
		this.lastTime = time

		this.subject.update(deltaTime)

		const fps = 1 / deltaTime
		this.fpsValueQueue.push(fps)
		if (this.fpsValueQueue.length > 10) this.fpsValueQueue.shift()
		const avg =
			this.fpsValueQueue.reduce((a, b) => a + b, 0) / this.fpsValueQueue.length
		drawText({
			text: `${avg.toFixed(0)}FPS`,
			x: 10,
			y: 20,
			color: 'red',
			font: '12px monospace',
		})
	}

	public begin(): void {
		this.interval = setInterval(this.loop, 1000 / this.targetRefreshRate)
	}

	public pause(): void {
		if (this.interval) {
			clearInterval(this.interval)
		}

		this.interval = undefined
	}

	public resume(): void {
		this.lastTime = performance.now()
		this.interval = setInterval(this.loop, 1000 / this.targetRefreshRate)
	}

	public togglePause(): void {
		if (this.interval) {
			this.pause()
		} else {
			this.resume()
		}
	}
}
