function daydream() {
    const self = this
    const system = self.system;

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
            console.log('эта хрень рaботает')
            return true;
        },
        bind_actions: function () {
            return true;
        },
        render: function () {
            self.render_template({
                caption: {
                    class_name: 'js-ac-caption',
                    html: ''
                },
                body: '',
                render: `
           <div class="ac-form">
           <div id="js-ac-sub-lists-container"></div>
           <div id="js-ac-sub-subs-container"></div>
           <div class="ac-form-button ac_sub">SEND</div>
           </div>
       <div class="ac-already-subs"></div>`
            });
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

