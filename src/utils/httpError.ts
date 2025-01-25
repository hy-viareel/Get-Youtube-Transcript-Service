import { NextFunction, Request } from 'express';

import errorObject from './errorObject';

export default (nextFunc: NextFunction, err: Error | unknown, req: Request, errorStatusCode: number = 500): void => {
    const errorobj = errorObject(err, req, errorStatusCode);
    return nextFunc(errorobj);
};
