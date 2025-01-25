import { Request } from 'express';
import { THttpError } from '../types/types';
import { responseMessage } from '../constants/responseMessage';
import config from '../config/config';
import { EApplicationEnviroment } from '../constants/application';

export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): THttpError => {
    const errorObj: THttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? err.stack : null
    };

    // generating log
    console.error(`CONTROLLER_ERROR`, {
        meta: errorObj
    });

    // production env check
    if (config.ENV == EApplicationEnviroment.PRODUCTION) {
        delete errorObj.request.ip;
        delete errorObj.trace;
    }
    return errorObj;
};

