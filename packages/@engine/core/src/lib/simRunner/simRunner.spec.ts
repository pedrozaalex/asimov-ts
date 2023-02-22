import { SimRunner } from './simRunner'

describe('SimRunner', () => {
	let simRunner: SimRunner
	let updateFn: jest.Mock

	beforeEach(() => {
		updateFn = jest.fn()
		simRunner = new SimRunner({ update: updateFn })
	})

	describe('begin()', () => {
		it('Should start the game loop', () => {
			simRunner.begin()

			setTimeout(() => {
				simRunner.pause()
				expect(updateFn).toHaveBeenCalled()
			}, 100)
		})
	})

	describe('pause()', () => {
		it('Should pause the game loop', () => {
			simRunner.begin()
			expect(simRunner['interval']).toBeDefined()
			simRunner.pause()
			expect(simRunner['interval']).toBeUndefined()
			expect(updateFn).not.toHaveBeenCalled()
		})
	})

	describe('resume()', () => {
		it('Should resume the game loop if paused', () => {
			simRunner.begin()
			simRunner.pause()
			expect(simRunner['interval']).toBeUndefined()
			simRunner.resume()
			expect(simRunner['interval']).toBeDefined()

			setTimeout(() => {
				simRunner.pause()
				expect(updateFn).toHaveBeenCalled()
			}, 100)
		})

		it('Should not resume the game loop if already running', () => {
			simRunner.begin()
			expect(simRunner['interval']).toBeDefined()
			simRunner.resume()
			expect(simRunner['interval']).toBeDefined()

			setTimeout(() => {
				simRunner.pause()
				expect(updateFn).toHaveBeenCalled()
			}, 100)
		})
	})

	it('Should try to run at the specified refresh rate', () => {
		simRunner = new SimRunner({ update: updateFn }, 30)
		simRunner.begin()

		setTimeout(() => {
			simRunner.pause()
			expect(updateFn).toHaveBeenCalledTimes(3)
		}, 110)
	})

	it('Should pass the correct deltaTime to the update function (60Hz, run for 1s)', () => {
		const refreshRate = 60
		simRunner = new SimRunner({ update: updateFn }, refreshRate)
		simRunner.begin()

		setTimeout(() => {
			simRunner.pause()

			updateFn.mock.calls.forEach(call => {
				const [deltaTime] = call
				expect(deltaTime).toBeCloseTo(1 / refreshRate)
			})
		}, 1000)
	})

	it('Should pass the correct deltaTime to the update function (30Hz, run for 1s)', () => {
		const refreshRate = 30
		simRunner = new SimRunner({ update: updateFn }, refreshRate)
		simRunner.begin()

		setTimeout(() => {
			simRunner.pause()

			updateFn.mock.calls.forEach(call => {
				const [deltaTime] = call
				expect(deltaTime).toBeCloseTo(1 / refreshRate)
			})
		}, 1000)
	})
})
