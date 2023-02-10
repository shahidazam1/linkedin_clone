import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@Body() createEducationDto: CreateEducationDto, @Req() req: any) {
    return this.educationService.create(createEducationDto, req.user.id);
  }

  @Get()
  findOneByProfile() {
    return this.educationService.findOneByProfile();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEducationDto: CreateEducationDto,
  ) {
    return this.educationService.update(+id, updateEducationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationService.remove(+id);
  }
}
