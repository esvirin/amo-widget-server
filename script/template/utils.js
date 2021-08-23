define([], function () {
	return {
		formatDate: date => new Intl.DateTimeFormat('ru-RU').format(date),
		isPhone: string => /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(string)
	}
})
