define(['./apiCalls.js', './statesManager.js', './renders.js'], function (
	apiCalls,
	statesManager,
	renders
) {
	const {
		createAccount,
		createLicence,
		getAccount,
		getLicence,
		getWidget,
		createWidget,
		getTariffs,
		getPaymentUrl
	} = apiCalls
	const { renderModal } = renders

	const { widgetId, accountId, licenceStatus, firstInit } = statesManager

	async function updateWidgetId(amoWidgetId) {
		let widget = await getWidget(amoWidgetId)
		if (!widget) {
			renderModal('<h1 style="color: red">Ошибка</h1>')
			return null
		}

		if (!widget.data) {
			widget = await createWidget(amoWidgetId, 'Тест виджет', 'Описание для теста')

			if (!widget) {
				renderModal('<h1 style="color: red">Ошибка</h1>')
				return null
			}
		}
		widgetId((widget.data[0] || widget.data).id)
	}

	async function updateAccountId() {
		const amoId = AMOCRM.constant('account').id
		let account = await getAccount(amoId)

		if (!account) {
			renderModal('<h1 style="color: red">Ошибка</h1>')
			return true
		}
		if (!account.data) {
			const domain = AMOCRM.constant('account').subdomain

			account = await createAccount(amoId, domain)

			if (!account) {
				renderModal('<h1 style="color: red">Ошибка</h1>')
				return true
			}
		}
		accountId((account.data[0] || account.data).id)
	}
	async function updateLicenceStatus() {
		const licenseInfo = await getLicence(widgetId(), accountId())

		if (licenseInfo.data) {
			licenceStatus({ exist: true, expired: false, data: licenseInfo.data })
		} else if (licenseInfo.msg && licenseInfo.msg.includes('expired')) {
			licenceStatus({ exist: true, expired: true, data: null })
		} else {
			licenceStatus({ exist: false, expired: false, data: null })
		}
	}

	async function updateFirstInit() {
		firstInit(false)
	}
	return { updateAccountId, updateWidgetId, updateLicenceStatus, updateFirstInit }
})
