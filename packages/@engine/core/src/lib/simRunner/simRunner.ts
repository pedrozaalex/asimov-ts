export interface ISubject {
	update(deltaTime: number): void
}

export class SimRunner {
	private subject: ISubject
	private isPaused: boolean
	private lastTime: number
	private targetRefreshRate: number

	constructor(subject: ISubject, targetRefreshRate = 60) {
		this.subject = subject
		this.isPaused = true
		this.lastTime = performance.now()
		this.targetRefreshRate = targetRefreshRate
	}

	private loop = () => {
		const time = performance.now()
		const deltaTime = (time - this.lastTime) / 1000 || 0
		this.lastTime = time

		if (!this.isPaused) {
			this.subject.update(deltaTime)
		}
	}

	public begin(): void {
		this.isPaused = false

		setInterval(this.loop, 1000 / this.targetRefreshRate)
	}

	public pause(): void {
		this.isPaused = true
	}

	public resume(): void {
		this.isPaused = false
	}
}
