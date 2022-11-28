import { InternalServerErrorException } from '@nestjs/common';
import CompanyEntity from 'src/entities/company.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class CompanySubscriber
  implements EntitySubscriberInterface<CompanyEntity>
{
  listenTo(): string | Function {
    return CompanyEntity;
  }

  async afterInsert(event: InsertEvent<CompanyEntity>): Promise<CompanyEntity> {
    let { id, name } = event.entity;
    const url_id = `${name.replace(' ', '-').toLowerCase()}-${id}`;
    const newCompany = new CompanyEntity();

    Object.assign(newCompany, { ...event.entity, url_id });

    try {
      const company = await event.manager.save(newCompany);

      return company;
    } catch (error) {
      throw new InternalServerErrorException(
        'There was an error after inserting company: ' + error,
      );
    }
  }
}
