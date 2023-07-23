import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  getEstimate(data: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: data.make })
      .andWhere('model = :model', { model: data.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: data.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: data.lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: data.year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(milage - :milage)', 'DESC')
      .setParameters({ milage: data.milage })
      .limit(3)
      .getRawMany();
  }

  create(data: CreateReportDto, user: User) {
    const report = this.repo.create(data);
    report.user = user;
    return this.repo.save(report);
  }

  async approve(id: number, data: ApproveReportDto) {
    const report = await this.repo.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
    console.log(
      '🚀 ~ file: reports.service.ts:25 ~ ReportsService ~ approve ~ report:',
      report,
    );

    if (!report) {
      throw new NotFoundException('report not found!');
    }

    report.approved = data.approved;
    return this.repo.save(report);
  }
}
