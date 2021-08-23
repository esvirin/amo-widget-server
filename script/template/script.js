define([
	'./apiCalls.js',
	'./templates.js',
	'./constants.js',
	'./utils.js',
	'./statesManager.js',
	'./statesUpdaters.js',
	'./renders.js'
], function (apiCalls, templates, constants, utils, statesManager, statesUpdaters, renders) {
	var CustomWidget = function () {
		const self = this

		const { createLicence, getTariffs, getPaymentUrl, getPayment } = apiCalls
		const { buyingLicenceTemplate, loaderTemplate } = templates
		const { widgetId, accountId, licenceStatus, firstInit } = statesManager
		const { updateAccountId, updateWidgetId, updateLicenceStatus } = statesUpdaters
		const { formatDate, isPhone } = utils
		const { renderContentInSettings, renderModal, renderPaymentBlock } = renders

		let finishWidgetInit

		this.callbacks = {
			settings: async function () {
				await updateLicenceStatus()
				const settingsArea = document.querySelector('.widget_settings_block__fields')
				settingsArea.insertAdjacentHTML(
					'afterbegin',
					'<div class="widget-content-wrapper"></div>'
				)

				if (licenceStatus().exist) {
					renderContentInSettings(
						`<div style="color: green">Ваша лицензия действительна до ${formatDate(
							new Date(licenceStatus().data.date_end)
						)}</div>`
					)
				} else {
					if (licenceStatus().expired) {
						renderContentInSettings(
							'<div style="color: red">Ваша лицензия истекла</div>' +
								'<div class="payment"></div>'
						)
					} else {
						renderContentInSettings(
							'<div style="color: red">Для использования виджета приобретите или получите тестовую лицензию</div>' +
								'<div class="payment"></div>'
						)
						const saveBtn = document.querySelector(
							`button[id="save_${self.params.widget_code}"]`
						)
						saveBtn.querySelector('span').innerText = 'Получить тестовую лицензию'
					}

					const tariffs = await getTariffs()

					if (!tariffs) {
						renderModal('<h1 style="color: red">Ошибка</h1>')
						return
					}

					let currentTariff = 2
					renderPaymentBlock(buyingLicenceTemplate(tariffs.data, currentTariff))
					const buyBtn = document.querySelector('.payment__buy-btn')

					async function onBuyBtnClick(e) {
						e.target.style.display = 'none'
						e.target.insertAdjacentHTML('afterend', loaderTemplate())
						e.target.removeEventListener('click', onBuyBtnClick)
						const paymentData = await getPaymentUrl(
							tariffs.data[currentTariff].id,
							widgetId(),
							accountId()
						)
						const invId = paymentData.data.invId
						const tempLink = document.createElement('a')
						tempLink.href = paymentData.data.url
						tempLink.target = '_blank'
						tempLink.click()
						tempLink.remove()
						setTimeout(() => {
							const updatingLicenceStatus = setInterval(async () => {
								const payment = await getPayment(invId)
								const paymentStatus = payment.data[0].status
								if (paymentStatus === 'Completed') {
									saveBtn.querySelector('span').innerText = 'Сохранить'
									renderModal(
										'<h1 style="color: green">Оплата прошла успешно. Лицензия выдана</h1>'
									)
									await updateLicenceStatus()
									renderContentInSettings(
										`<div style="color: green">Ваша лицензия действительна до ${formatDate(
											new Date(licenceStatus().data.date_end)
										)}</div>`
									)

									clearInterval(updatingLicenceStatus)
								} else if (paymentStatus === 'Failed') {
									buyBtn.style.display = 'block'
									renderModal('<h1 style="color: red">Ошибка оплаты</h1>')
									clearInterval(updatingLicenceStatus)
									buyBtn.addEventListener('click', onBuyBtnClick)
								}
							}, 5000)
						}, 15000)
					}

					buyBtn.addEventListener('click', onBuyBtnClick)

					const paymentWrapper = document.querySelector('.payment')

					paymentWrapper.addEventListener('click', e => {
						const item = e.target.closest('.payment__tariffs__item')
						if (item) {
							currentTariff = item.getAttribute('data-index')

							renderPaymentBlock(buyingLicenceTemplate(tariffs.data, currentTariff))

							const buyBtn = document.querySelector('.payment__buy-btn')
							buyBtn.addEventListener('click', onBuyBtnClick)
						}
					})
				}
				return true
			},
			init: function () {
				const head = document.querySelector('head')
				const settings = self.get_settings()
				head.insertAdjacentHTML(
					'beforeend',
					`<link href="${settings.path}/index.css?v=${settings.version} type="text/css" rel="stylesheet">`
				)
				if (licenceStatus().exist) {
					console.log('init')
				}
				return true
			},
			bind_actions: async function () {
				await new Promise(resolve => (finishWidgetInit = resolve))
				if (licenceStatus().exist) {
					console.log('bind actions')
				}
				return true
			},
			render: async function () {
				if (firstInit()) {
					await updateWidgetId(self.params.widget_code)
					await updateAccountId()
					await updateLicenceStatus()
					finishWidgetInit()
					firstInit(false)
				}
				if (licenceStatus().exist) {
					console.log('render')
				}

				return true
			},
			dpSettings: function () {},
			advancedSettings: function () {},
			destroy: function () {},
			contacts: {
				selected: function () {}
			},
			onSalesbotDesignerSave: function (handler_code, params) {},
			leads: {
				selected: function () {}
			},
			todo: {
				selected: function () {}
			},
			onSave: async function () {
				const phoneNumberInput = document.querySelector('input[name="phoneNumber"]')

				if (!isPhone(phoneNumberInput.value)) {
					renderModal('<h1 style="color: red">Неверный номер телефона</h1>')
					return false
				}

				if (!licenceStatus().exist) {
					console.log('test')
					const licenceInfo = await createLicence(widgetId(), accountId(), true)
					if (licenceInfo.errors) {
						renderModal('<h1 style="color: red">Ошибка получения лицензии</h1>')
						return false
					}

					licenceStatus({ exist: true, expired: false, data: licenceInfo.data })
					renderModal('<h1 style="color: green">Лицензия успешно выдана</h1>')
				}
				return true
			},
			onAddAsSource: function (pipeline_id) {}
		}
		return this
	}
	return CustomWidget
})
