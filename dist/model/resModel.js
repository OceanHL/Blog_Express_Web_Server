"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorModel = exports.SuccessModel = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["SUCCESS"] = 0] = "SUCCESS";
    ErrorType[ErrorType["FAIL"] = -1] = "FAIL";
})(ErrorType || (ErrorType = {}));
class BaseModel {
    constructor(data, message) {
        this.data = data;
        this.message = message;
    }
}
class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message);
        this.errno = ErrorType.SUCCESS;
    }
}
exports.SuccessModel = SuccessModel;
class ErrorModel extends BaseModel {
    constructor(message, data) {
        super(data, message);
        this.errno = ErrorType.FAIL;
    }
}
exports.ErrorModel = ErrorModel;
