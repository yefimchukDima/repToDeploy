import VerificationCodeEntity from 'src/entities/verification_code.entity';

export default function isVerificationCodeExpired(
  verificationCode: VerificationCodeEntity,
) {
  return (
    +verificationCode.expTime - Math.floor(new Date().getTime() / 1000) <= 0
  );
}
