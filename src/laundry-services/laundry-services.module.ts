import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'

import { LaundryServicesController } from './laundry-services.controller'
import { LaundryServicesService } from './laundry-services.service'

@Module({
  imports: [AuthModule],
  controllers: [LaundryServicesController],
  providers: [LaundryServicesService],
  exports: [LaundryServicesService],
})
export class LaundryServicesModule {}