import VerificationCodeEntity from 'src/entities/verification_code.entity';

const MILLISECONDS_TO_SECONDS = 1000;

export default function isVerificationCodeExpired(
  verificationCode: VerificationCodeEntity,
) {
  return (
    +verificationCode.expTime - Math.floor(new Date().getTime() / MILLISECONDS_TO_SECONDS) <= 0
  );
}
