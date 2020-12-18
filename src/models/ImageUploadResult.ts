export interface ImageUploadSuccessResult {
    id: string
    size: string;
    url: string;
    fileName: string;
}

export interface ImageUploadFailureResult {
    reason: string
    file: string;
}

export interface ImageUploadResult {
    success?: ImageUploadSuccessResult[];
    failed?: ImageUploadFailureResult[];
}