define(['lib/components/base/modal'], function (Modal) {
	function renderContentInSettings(template) {
		const contentWrapper = document.querySelector('.widget-content-wrapper')
		contentWrapper.innerHTML = template
	}

	function renderPaymentBlock(template) {
		const paymentWrapper = document.querySelector('.payment')
		paymentWrapper.innerHTML = template
	}

	function renderModal(msg) {
		modal = new Modal({
			class_name: 'modal-window',
			init: function ($modal_body) {
				$modal_body.trigger('modal:loaded').html(msg).trigger('modal:centrify').append('')
			},
			destroy: function () {}
		})
	}

	return { renderContentInSettings, renderModal, renderPaymentBlock }
})
