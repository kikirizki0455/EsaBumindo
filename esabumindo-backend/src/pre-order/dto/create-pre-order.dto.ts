import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidPackaging', async: false })
export class IsValidPackagingConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const object = args.object as any;
    const orderType = object.orderType;

    if (orderType === 'sample') {
      return ['botol', 'galon', 'pail', 'drum50kg'].includes(value);
    } else if (orderType === 'direct') {
      return [
        'cartongTong50kg',
        'cartongTong40kg',
        'plainDrum200kg',
        'boneDrum200kg',
        'bulltank1ton',
      ].includes(value);
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as any;
    const orderType = object.orderType;

    if (orderType === 'sample') {
      return 'Packaging sample harus: botol, galon, pail, atau drum50kg';
    } else {
      return 'Packaging direct order harus: cartongTong50kg, cartongTong40kg, plainDrum200kg, boneDrum200kg, atau bulltank1ton';
    }
  }
}

export class CreatePreOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['direct', 'sample'])
  orderType: 'direct' | 'sample';

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsOptional()
  industri?: string;

  @IsNumber()
  @Min(1, { message: 'Jumlah minimal 1 kg' })
  @ValidateIf((o) => o.orderType === 'sample')
  @Max(100, { message: 'Jumlah sample maksimal 100 kg' })
  quantityKg: number;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidPackagingConstraint)
  packaging: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['email', 'whatsapp'])
  contactMethod: 'email' | 'whatsapp';
}
