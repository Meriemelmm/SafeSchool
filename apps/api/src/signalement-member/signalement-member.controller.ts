import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SignalementMemberService } from './signalement-member.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AddMembersDto } from './dto/member.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@shared/enums';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('signalement-member')
@UseGuards(JwtAuthGuard)
export class SignalementMemberController {
  constructor(private readonly signalementMemberService: SignalementMemberService) {}

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.STUDENT,UserRole.PARENT)
  async addMembers(
    @Body() addMembersDto: AddMembersDto,
  ) {
     
    const members = await this.signalementMemberService.createMany(
  addMembersDto.members,
  addMembersDto.signalementId
);

return {
  message: "Les membres ont été associés au signalement avec succès",
  data: members
};
  }
}
