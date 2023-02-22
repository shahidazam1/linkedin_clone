import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignupDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/schemas/user.schema';
import { Model } from 'mongoose';
import { SigninDto } from './dto/sign-in.dto';
import { verifyPassword } from 'src/utils/constants';
import { Profile } from '../domain/schemas/profile.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async signup(signupDto: SignupDto) {
    const exists = await this.userModel.findOne({ email: signupDto.email });

    if (exists) {
      throw new BadRequestException('user already exists');
    }

    let user = new this.userModel();
    user.name = signupDto.name;
    user.email = signupDto.email;
    user.mobile = signupDto.mobile;
    user.password = await bcrypt.hash(signupDto.password, 10);
    await user.save();

    let profileDetails = new this.profileModel();
    profileDetails.firstName = signupDto.name;
    profileDetails.userId = user._id;
    await profileDetails.save();

    const payload = { sub: user._id, userId: user._id };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async signin(signinDto: SigninDto) {
    const exists = await this.userModel.findOne({
      $or: [{ email: signinDto.userName }, { name: signinDto.userName }],
    });

    if (!exists) {
      throw new BadRequestException('User Not Found');
    }

    const isValidPassword = await verifyPassword(
      signinDto.password,
      exists.password,
    );
    if (!isValidPassword) {
      throw new UnprocessableEntityException('The password is wrong.');
    }

    const payload = { sub: exists._id, userId: exists._id };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
