"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeService = void 0;
const common_1 = require("@nestjs/common");
const luxon_1 = require("luxon");
let DateTimeService = class DateTimeService {
    getDateTime(timeZoneIanaString) {
        return luxon_1.DateTime.local({
            zone: timeZoneIanaString,
        }).toFormat('yyyy-MM-dd TT');
    }
    getDate(timeZoneIanaString) {
        return luxon_1.DateTime.local({ zone: timeZoneIanaString }).toFormat('yyyy-MM-dd');
    }
    getTime(timeZoneIanaString) {
        return luxon_1.DateTime.local({ zone: timeZoneIanaString }).toFormat('TT');
    }
    setDateTime(dateTime) {
        luxon_1.DateTime;
        let convertDateTime = luxon_1.DateTime.fromISO(dateTime).toFormat('yyyy-MM-dd TT');
        return convertDateTime;
    }
    cuttentTimestamp() {
        let { DateTime } = require('luxon');
        var TimeZoneIanaString = 'Asia/Kolkata';
        var local = DateTime.local({ zone: TimeZoneIanaString });
        var serverLocalDateAndTimeFormate = DateTime.local({
            zone: TimeZoneIanaString,
        }).toFormat('yyyy-MM-dd TT');
        return serverLocalDateAndTimeFormate;
    }
};
DateTimeService = __decorate([
    (0, common_1.Injectable)()
], DateTimeService);
exports.DateTimeService = DateTimeService;
//# sourceMappingURL=date-time.service.js.map