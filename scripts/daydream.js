function daydream() {
    var self = this,
        system = self.system;

    //Сбор информации из карточки контакта
    this.get_ccard_info = function () {
        return true
    };

    // Отправка собранной информации
    this.sendInfo = function () {
        return true
    };

    this.callbacks = {
        settings: function () {
        },
        dpSettings: function () {
        },
        init: function () {
            console.log('эта хрень рботает')
            return true;
        },
        bind_actions: function () {
            return true;
        },
        render: function () {
            var lang = self.i18n('userLang');
            w_code = self.get_settings().widget_code; //в данном случае w_code='new-widget'


            self.render_template(
                {
                    caption: {
                        class_name: 'new_widget'
                    },
                    body: '',
                    render:  '<div class="nw_form">' +
                        '<div id="w_logo">' +
                        `<img src="/widgets/${w_code}/images/logo.png" id="firstwidget_image"></img>` +
                        '</div>' +
                        '<div id="js-sub-lists-container">' +
                        '</div>' +
                        '<div id="js-sub-subs-container">' +
                        '</div>' +
                        '<div class="nw-form-button">{{b_name}}</div></div>' +
                        '<div class="already-subs"></div>'
                },
                {
                    name: "widget_name",
                    w_code: self.get_settings().widget_code,
                    b_name: "BUTTON" // в данном случае лучше передать ссылку на lang через self.i18n()
                }
            );
            return true

        },
        contacts: {},
        leads: {
            selected: function () {

            }
        },
        onSave: function () {

            return true;
        }
    };
    return this;
};

