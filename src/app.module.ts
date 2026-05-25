import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { LaundryServicesModule } from './laundry-services/laundry-services.module';
import { PaymentsModule } from './payments/payments.module';
import { CouriersModule } from './couriers/couriers.module';
import { OutletsModule } from './outlets/outlets.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadsModule } from './uploads/uploads.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    LaundryServicesModule,
    PaymentsModule,
    CouriersModule,
    OutletsModule,
    DashboardModule,
    VouchersModule,
    ReviewsModule,
    UploadsModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}