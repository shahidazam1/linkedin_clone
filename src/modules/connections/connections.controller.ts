import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/connections.dto';

@UseGuards(JwtAuthGuard)
@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post()
  addConnection(@Body() connectData: CreateConnectionDto, @Req() req: any) {
    return this.connectionsService.addConnection(connectData, req.user.id);
  }

  @Get()
  findAll() {
    return this.connectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.connectionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConnectionDto: CreateConnectionDto,
    @Req() req: any,
  ) {
    return this.connectionsService.update(id, updateConnectionDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.connectionsService.remove(+id);
  }
}
