export type THttpResponse = {
    success: boolean;
    statusCode: number;
    request: {
        ip?: string | null; // kept optional to avoid leaking sensitive information during prodcution
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
};

export type THttpError = {
    success: boolean;
    statusCode: number;
    request: {
        ip?: string | null;
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
    trace?: string | null; // kept optional to avoid leaking sensitive information during prodcution
};

