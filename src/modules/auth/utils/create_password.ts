import { InternalServerErrorException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PASSWORD_CREATION } from 'src/utils/error-messages';

export const createPassword = async (plainText: string): Promise<string> => {
  try {
    return await hash(plainText, 10);
  } catch (e) {
    throw new InternalServerErrorException(PASSWORD_CREATION + e);
  }
};
