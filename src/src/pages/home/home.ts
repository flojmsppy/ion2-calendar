import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { CalendarController } from '../../components/ion2-calendar';
import {
    CalendarComponentOptions, CalendarModalOptions,
    DayConfig
} from '../../components/ion2-calendar/calendar.model';
import * as moment from 'moment';
import { CalendarModal } from '../../components/ion2-calendar';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    days: Array<any> = [];
    date: any = moment(moment().format('YYYY-MM-DD')).add(1, 'month');
    dateMulti = [];
    // dateRangeObj = {from: moment().format('YYYY-MM-DD'), to: moment().add(4, 'd').format('YYYY-MM-DD')};
    dateRangeObj = {from: '', to: ''};
    format = 'YYYY-MM-DD';
    optionsBasic: CalendarComponentOptions = {};
    optionsMulti: CalendarComponentOptions = {
        pickMode: 'multi',
        defaultSubtitle: 'hello',
        monthPickerFormat: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    _daysConfig: DayConfig[] = [{date: new Date(2017, 10, 22), disable: true, subTitle: 'disabled'},{date: new Date(2017, 10, 24), disable: true, subTitle: 'disabled'},];
    optionsRange: CalendarComponentOptions = {
        from: new Date(2000, 0),
        to: new Date(2020, 11, 31),
        pickMode: 'range',
        weekStart: 1,
        weekdays: ['0', '1', '2', '3', '4', '5', '6'],
        daysConfig: this._daysConfig
    };

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public calendarCtrl: CalendarController,
    ) {

    }

    basic() {
        const options = {
            title: 'BASIC',
            canBackwardsSelected: true,
            color: 'cal-color',
            doneIcon: true,
            closeIcon: true,
            defaultSubtitle: 'hello'
        };
        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss((date, type) => {
            console.log(date);
            console.log(type);
        });
    }

    dateChange($event) {

        this.optionsBasic = {
            pickMode: 'multi',
            defaultSubtitle: 'hello',
            showMonthPicker: false,
            daysConfig: [
                {
                    date: new Date(2017, 11, 1),
                    marked: true
                },
                {
                    date: new Date(2017, 11, 2),
                    marked: true
                },
                {
                    date: new Date(2017, 11, 3),
                    marked: true
                }
            ]
        };
        console.log($event);
    }

    multi() {
        const options = {
            pickMode: 'multi',
            title: 'MULTI',
            defaultDates: [moment(), moment().add(1, 'd'), moment().add(2, 'd')]
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss(date => {
            console.log(date);
        });
    }

    dateRange() {
        let _daysConfig: DayConfig[] = [{date: new Date(2017, 10, 22), disable: true, subTitle: 'disabled'},{date: new Date(2017, 10, 24), disable: true, subTitle: 'disabled'},];
        const options: CalendarModalOptions = {
            pickMode: 'range',
            title: 'RANGE',
            canBackwardsSelected: true,
            color: 'danger',
            daysConfig : _daysConfig
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss(date => {
            console.log(date);
        });
    }

    setDefaultDate() {
        const options: CalendarModalOptions = {
            from: new Date(2017, 1, 1),
            defaultScrollTo: new Date(2017, 4, 1),
            defaultDate: new Date(2017, 4, 1)
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss(date => {
            console.log(date);
        });

    }

    setCssClass() {
        const options: CalendarModalOptions = {
            cssClass: 'my-class',
            color: 'secondary',
            pickMode: 'range',
            autoDone: true
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss(date => {
            console.log(date);
        });
    }

    optional() {
        const options: CalendarModalOptions = {
            from: new Date(2017, 1, 1),
            to: new Date(2017, 2, 5),
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss(date => {
            console.log(date);
        });
    }

    disableWeekdays() {
        const options: CalendarModalOptions = {
            disableWeeks: [0, 6],
            canBackwardsSelected: true,
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss(date => {
            console.log(date);
        });
    }

    local() {
        const options: CalendarModalOptions = {
            monthFormat: 'yyyy 年 MM 月 ',
            weekdays: ['天', '一', '二', '三', '四', '五', '六'],
            weekStart: 1,
            color: 'light',
            defaultDate: new Date()
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss(date => {
            console.log(date);
        });
    }

    daysConfig() {
        let _daysConfig: DayConfig[] = [];
        for (let i = 0; i < 31; i++) {
            _daysConfig.push({
                date: new Date(2017, 0, i + 1),
                subTitle: `$${i + 1}`
            });
        }

        _daysConfig.push({
            date: new Date(2017, 1, 1),
            disable: true,
            subTitle: 'disable'
        });
        const options: CalendarModalOptions = {
            from: new Date(2017, 0, 1),
            to: new Date(2017, 11.1),
            daysConfig: _daysConfig,
            cssClass: 'my-cal',
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss(date => {
            console.log(date);
        });
    }

}
