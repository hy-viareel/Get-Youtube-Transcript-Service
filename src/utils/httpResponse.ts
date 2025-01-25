// strcuting the http response object

import { Request, Response } from 'express';
import { THttpResponse } from '../types/types';
import { EApplicationEnviroment } from '../constants/application';
import config from '../config/config';

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null) => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.url
        },
        message: responseMessage,
        data: data
    };

    // log
    console.info(`CONTROLLER_RESPONSE`, {
        meta: response
    });

    if (config.ENV == EApplicationEnviroment.PRODUCTION) {
        delete response.request.ip;
    }

    res.status(responseStatusCode).json(response);
};

