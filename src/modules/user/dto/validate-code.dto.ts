import { IsString } from "class-validator";

export default class ValidateCodeDTO {
    @IsString()
    mobile_number: string;

    @IsString()
    code: string;
}