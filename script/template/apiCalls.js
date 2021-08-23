define(['./constants.js'], function (constants) {
	const { ROOT_URL } = constants

	async function getPayment(invId) {
		try {
			return await (await fetch(`${ROOT_URL}/payment?inv_id=${invId}`)).json()
		} catch {
			return null
		}
	}
	async function getPaymentUrl(tariffId, widgetId, accountId) {
		try {
			return await (
				await fetch(
					`${ROOT_URL}/robokassa/payment-url?tariff_id=${tariffId}&account_id=${accountId}&widget_id=${widgetId}`
				)
			).json()
		} catch {
			return null
		}
	}

	async function getWidget(amo_widget_id) {
		try {
			return await (await fetch(`${ROOT_URL}/registerWidget?amo_id=${amo_widget_id}`)).json()
		} catch {
			return null
		}
	}

	async function getAccount(amo_id) {
		try {
			return await (await fetch(`${ROOT_URL}/registerAccount?amo_id=${amo_id}`)).json()
		} catch {
			return null
		}
	}

	async function getLicence(widgetId, accountId) {
		try {
			return await (await fetch(`${ROOT_URL}/licence/${widgetId}/${accountId}`)).json()
		} catch {
			return null
		}
	}

	async function getTariffs() {
		try {
			return await (await fetch(`${ROOT_URL}/tariff`)).json()
		} catch {
			return null
		}
	}

	async function createAccount(amo_id, domain) {
		try {
			return await (
				await fetch(`${ROOT_URL}/registerAccount`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ amo_id, domain })
				})
			).json()
		} catch {
			return null
		}
	}

	async function createWidget(
		amo_widget_id,
		name = 'Название виджета',
		description = 'Описание'
	) {
		try {
			return await (
				await fetch(`${ROOT_URL}/registerWidget`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						amo_id: amo_widget_id,
						name,
						description
					})
				})
			).json()
		} catch {
			return null
		}
	}

	async function createLicence(widgetId, accountId, test) {
		try {
			return await (
				await fetch(`${ROOT_URL}/licence`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						widget_id: widgetId,
						account_id: accountId,
						test
					})
				})
			).json()
		} catch {
			return null
		}
	}

	return {
		createAccount,
		createLicence,
		createWidget,
		getAccount,
		getLicence,
		getWidget,
		getTariffs,
		getPaymentUrl,
		getPayment
	}
})
