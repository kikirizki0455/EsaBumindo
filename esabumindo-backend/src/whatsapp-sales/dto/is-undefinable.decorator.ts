import { ValidateIf } from 'class-validator';

/**
 * Seperti @IsOptional(), tetapi hanya melewatkan `undefined`.
 * `null` tetap divalidasi (dan ditolak oleh validator tipe), supaya tidak
 * lolos ke kolom database yang NOT NULL.
 */
export const IsUndefinable = () =>
  ValidateIf((_object, value) => value !== undefined);
