import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  OrderStatus,
} from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class WhatsappService {
  constructor(private readonly prisma: PrismaService) {}

  async generateOrderWhatsapp(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        customer: true,
      },
    })

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      )
    }

    let message = ''

    switch (order.status) {
      case OrderStatus.DIPROSES:
        message =
          'Halo, laundry Anda saat ini sedang diproses oleh LaundryGo.'
        break

      case OrderStatus.SELESAI_DIPROSES:
        message =
          'Halo, laundry Anda telah selesai diproses dan siap diambil atau diantar.'
        break

      case OrderStatus.SEDANG_DIANTAR:
        message =
          'Halo, laundry Anda sedang diantar oleh kurir LaundryGo.'
        break

      case OrderStatus.SELESAI:
        message =
          'Halo, pesanan laundry Anda telah selesai. Terima kasih telah menggunakan LaundryGo.'
        break

      default:
        message =
          'Halo, berikut informasi terbaru mengenai pesanan laundry Anda.'
        break
    }

    const phone = order.customer.phone.replace(
      /^0/,
      '62',
    )

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      message,
    )}`

    return {
      url,
    }
  }
}