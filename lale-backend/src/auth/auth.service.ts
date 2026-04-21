import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingLogin = await this.usersService.findByLogin(data.login);
    if (existingLogin) {
      throw new BadRequestException("User with this login already exists");
    }

    const existingEmail = await this.usersService.findByEmail(data.email);
    if (existingEmail) {
      throw new BadRequestException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.create({
      login: data.login,
      email: data.email,
      password: hashedPassword,
      avatarUrl: data.avatarUrl,
      role: data.role ?? "CLIENT",
    });

    const { password, ...userWithoutPassword } = user;

    const tokens = await this.generateTokens(
      user.id,
      user.login,
      user.email,
      user.role,
    );

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByLogin(data.login);

    if (!user) {
      throw new UnauthorizedException("Invalid login or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid login or password");
    }

    const { password, ...userWithoutPassword } = user;

    const tokens = await this.generateTokens(
      user.id,
      user.login,
      user.email,
      user.role,
    );

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async refreshTokens(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException("Access denied");
    }

    return this.generateTokens(user.id, user.login, user.email, user.role);
  }

  private async generateTokens(
    userId: string,
    login: string,
    email: string,
    role: string,
  ) {
    const payload = {
      sub: userId,
      login,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: "7d",
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}