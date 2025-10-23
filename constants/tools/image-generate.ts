export const IMAGE_TYPE = {
    PNG: 'png',
    JPG: 'jpg',
    WEBP: 'webp',
    GIF: 'gif',
    SVG: 'svg',
} as const;

export const UNIT = {
    BYTE: 'B',
    MB: 'MB',
} as const;

export const UNIT_CONVERT = {
    [UNIT.MB]: 1024 * 1024,
    [UNIT.BYTE]: 1,
}

export const CANVAS_TYPE_MAP: Record<string, 'pdf'|'svg'|undefined> = {
    [IMAGE_TYPE.SVG]: 'svg',
    [IMAGE_TYPE.PNG]: undefined,
    [IMAGE_TYPE.JPG]: undefined,
    [IMAGE_TYPE.WEBP]: undefined,
    [IMAGE_TYPE.GIF]: undefined,
}