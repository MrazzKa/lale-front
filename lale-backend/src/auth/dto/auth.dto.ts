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

  @IsOptional()
  @IsIn(["ADMIN", "CLIENT"])
  role?: "ADMIN" | "CLIENT";
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}