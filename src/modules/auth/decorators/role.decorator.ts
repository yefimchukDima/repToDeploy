import { SetMetadata } from '@nestjs/common';

const RolesDecorator = (role: 'admin' | 'common') => SetMetadata('role', role);

export default RolesDecorator;
