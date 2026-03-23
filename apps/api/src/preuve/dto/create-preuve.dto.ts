import { IsNotEmpty, IsString } from "class-validator";

export class CreatePreuveDto {
    @IsNotEmpty()
    @IsString()
    signalementId: string;
}
