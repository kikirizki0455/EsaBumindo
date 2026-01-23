import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SendContactEmailDto {
  @IsNotEmpty({ message: 'Nama harus diisi' })
  @IsString({ message: 'Nama harus berupa teks' })
  name: string;

  @IsNotEmpty({ message: 'Email harus diisi' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Telepon harus berupa teks' })
  phone?: string;

  @IsNotEmpty({ message: 'Pesan harus diisi' })
  @IsString({ message: 'Pesan harus berupa teks' })
  @MinLength(10, { message: 'Pesan minimal 10 karakter' })
  message: string;
}
