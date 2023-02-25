export function mapPointsToTimeBetweenTicks(points: number) {
	return 0.4 * Math.pow(0.95, points)
}
