import { Component, ChangeDetectorRef, Input, Output, EventEmitter, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { defaults, pickModes } from '../config';
export var MONTH_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MonthComponent; }),
    multi: true,
};
import * as moment from 'moment';

var MonthComponent = /** @class */ (function () {
    function MonthComponent(ref) {
        this.ref = ref;
        this.readonly = false;
        this.selectAll = true;
        this.color = defaults.COLOR;
        this.fixedDayRange = { time: null, totalDays: null, endDay: ''};
        this.onChange = new EventEmitter();
        this._date = [null, null];
        this._isInit = false;
    }
    Object.defineProperty(MonthComponent.prototype, "_isRange", {
        get: function () {
            return this.pickMode === pickModes.RANGE || this.pickMode === pickModes.FIXED_RANGE;
        },
        enumerable: true,
        configurable: true
    });
    MonthComponent.prototype.ngAfterViewInit = function () {
        setTimeout(() => {this._isInit = true;});
    };
    MonthComponent.prototype.writeValue = function (obj) {
        if (Array.isArray(obj)) {
            this._date = obj;
        }
    };
    MonthComponent.prototype.registerOnChange = function (fn) {
        this._onChanged = fn;
    };
    MonthComponent.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    MonthComponent.prototype.trackByTime = function (index, item) {
        return item ? item.time : index;
    };
    MonthComponent.prototype.isEndSelection = function (day) {
        if (!day)
            return false;
        if (this.pickMode !== pickModes.RANGE && this.pickMode !== pickModes.FIXED_RANGE || !this._isInit || this._date[1] === null) {
            return false;
        }
        return this._date[1].time === day.time;
    };
    MonthComponent.prototype.isBetween = function (day) {
        if (!day)
            return false;
        if (this.pickMode !== pickModes.RANGE && this.pickMode !== pickModes.FIXED_RANGE || !this._isInit) {
            return false;
        }
        if (this._date[0] === null || this._date[1] === null) {
            return false;
        }
        var start = this._date[0].time;
        var end = this._date[1].time;
        return day.time < end && day.time > start;
    };
    MonthComponent.prototype.isStartSelection = function (day) {
        if (!day)
            return false;
        if (this.pickMode !== pickModes.RANGE && this.pickMode !== pickModes.FIXED_RANGE || !this._isInit || this._date[0] === null) {
            return false;
        }
        if (day && this._date[0] !== null && this._date[1] !== null) {
            if (day.disable && this._date[0].time === day.time) {
                if (Array.isArray(this._date)) {
                    this._date[0] = null;
                    this._date[1] = null;
                    this.onChange.emit(this._date);
                    return false;
                }
            }
        }
        if (this._date[0].time) {
            return this._date[0].time === day.time && this._date[1] !== null;
        }
    };
    MonthComponent.prototype.isSelected = function (time) {
        if (Array.isArray(this._date)) {
            if (this.pickMode !== pickModes.MULTI) {
                if (this._date[0] !== null) {
                    return time === this._date[0].time;
                }
                if (this._date[1] !== null) {
                    return time === this._date[1].time;
                }
            }
            else {
                return this._date.findIndex(function (e) { return e !== null && e.time === time; }) !== -1;
            }
        }
        else {
            return false;
        }
    };
    MonthComponent.prototype.onSelected = function (item, days) {
        if (this.pickMode === pickModes.RANGE) {
            this.pickMode = pickModes.FIXED_RANGE;
        }
        if (this.readonly)
            return;
        item.selected = true;
        if (this.pickMode === pickModes.SINGLE) {
            this._date[0] = item;
            this.onChange.emit(this._date);
            return;
        }

        if (this.pickMode === pickModes.FIXED_RANGE) {
            var totalTmpDays = this.fixedDayRange.totalDays;
            var start = moment(item.time).date();
            var end = start + totalTmpDays;
            var j = moment(item.time);
            var total = j.add(totalTmpDays, 'days').toDate().getTime();
            let finalDayObj = {
                totalDays: totalTmpDays,
                time: total,
                endDay: end.toString()
            };
            var dummy = {
                cssClass: "",
                disable: false,
                isToday: false,
                marked: false,
                selected: item.selected,
                subTitle: "",
                time: finalDayObj.time,
                title: finalDayObj.endDay
            };
            if (this._date[0] !== item) {
                this._date[0] = item;
                this._date[1] = dummy;
                this.onChange.emit(this._date);
                return;
            }
            if (this._date[0] === item) {
                this._date[0] = this._date[1] = null;
                this.onChange.emit(this._date);
                return;
            }
        }

        if (this.pickMode === pickModes.RANGE) {
            if (this._date[0] === null) {
                this._date[0] = item;
            }
            else if (this._date[1] === null) {
                if (this._date[0].time < item.time) {
                    this._date[1] = item;
                }
                else {
                    this._date[1] = this._date[0];
                    this._date[0] = item;
                }
                if (this._date[0].time === this._date[1].time) {
                    this._date[0] = this._date[1] = null;
                }
                if (!this.selectAll) {
                    for (var _i = 0, days_1 = days; _i < days_1.length; _i++) {
                        var day = days_1[_i];
                        if (day !== null) {
                            if (this.isBetween(day)) {
                                if (day.disable) {
                                    this._date[0] = item;
                                    this._date[1] = null;
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            else {
                this._date[0] = item;
                this._date[1] = null;
            }
            this.onChange.emit(this._date);
            return;
        }
        if (this.pickMode === pickModes.MULTI) {
            var index = this._date.findIndex(function (e) { return e !== null && e.time === item.time; });
            if (index === -1) {
                this._date.push(item);
            }
            else {
                this._date.splice(index, 1);
            }
            this.onChange.emit(this._date.filter(function (e) { return e !== null; }));
        }
    };
    MonthComponent.decorators = [
        { type: Component, args: [{
                selector: 'ion-calendar-month',
                providers: [MONTH_VALUE_ACCESSOR],
                template: "\n        <div [class]=\"color\">\n            <ng-template [ngIf]=\"!_isRange\" [ngIfElse]=\"rangeBox\">\n                <div class=\"days-box\">\n                    <ng-template ngFor let-day [ngForOf]=\"month.days\" [ngForTrackBy]=\"trackByTime\">\n                        <div class=\"days\">\n                            <ng-container *ngIf=\"day\">\n                                <button type='button'\n                                        [class]=\"'days-btn ' + day.cssClass\"\n                                        [class.today]=\"day.isToday\"\n                                        (click)=\"onSelected(day)\"\n                                        [class.marked]=\"day.marked\"\n                                        [class.on-selected]=\"isSelected(day.time)\"\n                                        [disabled]=\"day.disable\">\n                                    <p>{{day.title}}</p>\n                                    <small *ngIf=\"day.subTitle\">{{day?.subTitle}}</small>\n                                </button>\n                            </ng-container>\n                        </div>\n                    </ng-template>\n                </div>\n            </ng-template>\n\n            <ng-template #rangeBox>\n                <div class=\"days-box\">\n                    <ng-template ngFor let-day [ngForOf]=\"month.days\" [ngForTrackBy]=\"trackByTime\">\n                        <div class=\"days\"\n                             [class.startSelection]=\"isStartSelection(day)\"\n                             [class.endSelection]=\"isEndSelection(day)\"\n                             [class.between]=\"isBetween(day)\">\n                            <ng-container *ngIf=\"day\">\n                                <button type='button'\n                                        [class]=\"'days-btn ' + day.cssClass\"\n                                        [class.today]=\"day.isToday\"\n                                        (click)=\"onSelected(day,month.days)\"\n                                        [class.marked]=\"day.marked\"\n                                        [class.on-selected]=\"isSelected(day.time)\"\n                                        [disabled]=\"day.disable\">\n                                    <p>{{day.title}}</p>\n                                    <small *ngIf=\"day.subTitle\">{{day?.subTitle}}</small>\n                                </button>\n                            </ng-container>\n\n                        </div>\n                    </ng-template>\n                </div>\n            </ng-template>\n        </div>\n    ",
            },] },
    ];
    /** @nocollapse */
    MonthComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    MonthComponent.propDecorators = {
        'month': [{ type: Input },],
        'pickMode': [{ type: Input },],
        'isSaveHistory': [{ type: Input },],
        'id': [{ type: Input },],
        'readonly': [{ type: Input },],
        'fixedDayRange': [ {type: Input},],
        'selectAll': [{ type: Input },],
        'color': [{ type: Input },],
        'onChange': [{ type: Output },],
    };
    return MonthComponent;
}());
export { MonthComponent };
//# sourceMappingURL=month.component.js.map
