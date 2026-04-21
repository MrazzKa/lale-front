import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  // We keep role as an option for internal use/scripts, 
  // but frontend will stop sending it during registration.
  @IsOptional()
  @IsIn(["ADMIN", "CLIENT"])
  role?: "ADMIN" | "CLIENT";
}

export class LoginDto {
  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  password: string;
}