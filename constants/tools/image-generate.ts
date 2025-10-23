export const IMAGE_TYPE = {
    PNG: 'png',
    JPEG: 'jpeg',
    WEBP: 'webp',
    GIF: 'gif',
} as const;

export const UNIT = {
    BYTE: 'B',
    MB: 'MB',
} as const;

export const UNIT_CONVERT = {
    [UNIT.MB]: 1024 * 1024,
    [UNIT.BYTE]: 1,
}