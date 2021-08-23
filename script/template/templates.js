define([], function () {
	return {
		licenceInfoTemplate: (dataBegin, dataEnd, isTest) => {
			const formatDate = new Intl.DateTimeFormat('ru-RU').format

			return `
            <div class="licence-status" style="background-color: green">Лицензия действительна</div>
		        <div class="licence-info">
		            <div>Дата начала: ${formatDate(new Date(dataBegin))}</div>
		            <div>Дата конца: ${formatDate(new Date(dataEnd))}</div>
                    ${isTest ? '<div>Лицензия является тестовой</div>' : ''}
		        </div>
		    `
		},
		licenceIsExpiredTemplate: () => {
			return '<div class="licence-status" style="background-color: red">Лицензия истекла</div>'
		},
		getTestLicenceTemplate: () => {
			return '<div class="licence-status" style="background-color: green; cursor: pointer">Получить тестовую лицензию</button></div>'
		},
		buyingLicenceTemplate: (tariffs, currentTariff, paymentUrl) => {
			const formatDate = new Intl.DateTimeFormat('ru-RU').format

			return `
				<div class="payment__tariffs">
					${tariffs
						.map((tariff, index) => {
							return `
							<div class="payment__tariffs__item ${
								index === +currentTariff && 'payment__tariffs__item--current'
							}" data-index="${index}">
								<div class="payment__tariffs__item__title">${tariff.title}</div>
								<div class="payment__tariffs__item__description">${tariff.description}</div>
							</div>							
						`
						})
						.join('')}
				</div>
				<div class="payment__info">
					<div class="payment__info__date">До ${formatDate(
						new Date(Date.now() + tariffs[currentTariff].duration * 1000)
					)}</div>
					<div class="payment__info__price">${tariffs[currentTariff].price} руб.</div>
				</div>
				<div class="payment__buy-btn">Оплатить онлайн</в>
			`
		},
		loaderTemplate: () => `
			<div class="gd-widget-body__loader-wrapper">
				<div id="amocrm-spinner" style="both:clear;">
					<span style="width: 20px;height: 20px;margin: 0 auto;display: block;position: static;" class="pipeline_leads__load_more__spinner spinner-icon spinner-icon-abs-center">
					</span>
				</div>
			</div>
        `
	}
})
