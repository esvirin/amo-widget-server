define([], function () {
	const states = {}

	function createState(name, initialValue) {
		let value = initialValue
		const state = setter =>
			setter
				? typeof setter === 'function'
					? (value = setter(value))
					: (value = setter)
				: value
		states[name] = state
	}

	createState('widgetId', null)
	createState('accountId', null)
	createState('licenceStatus', { exist: false, expired: false, data: null })
	createState('firstInit', true)
	return states
})
