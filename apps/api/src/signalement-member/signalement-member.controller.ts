import { Controller, Post, Body, UseGuards ,Get,Param} from '@nestjs/common';
import { SignalementMemberService } from './signalement-member.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AddMembersDto } from './dto/member.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@shared/enums';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

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
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMembers(@Param('id') id: string, @CurrentUser() currentUser) {
    console.log('ID', id);
    const members = await this.signalementMemberService.findMembersBySignalment(id, currentUser);
    return {
      message: "Les membres sont récupérés avec succès",
      data: members
    }
  }
}
