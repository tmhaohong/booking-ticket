import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DATABASE_URL in .env!');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Populate the database with initial seed data for users, an event, and seats.
 *
 * Deletes existing orderItem, order, seat, event, and user records, creates a single user and an event,
 * generates and inserts seats for rows A, B, and C with configured counts and prices, updates the
 * seat with code `VIP-A1` to `PENDING`, and logs insertion progress.
 */
async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: 'Alex Nguyen',
      email: 'alex@example.com',
      phoneNumber: '+15550000000',
    },
  });

  const event = await prisma.event.create({
    data: {
      title: 'The Sonic Pulse Tour',
      description: 'Access exclusive backstage passes and feel the rhythm of the city.',
      venue: 'My Dinh Stadium',
      startTime: new Date('2026-10-15T20:00:00Z'),
      status: 'UPCOMING',
    },
  });

  const seatsData = [];
  const rows = ['A', 'B', 'C'];
  const seatsPerRow: Record<string, number> = {
    A: 100,
    B: 1000,
    C: 10000,
  };
  const pricePerRow: Record<string, number> = {
    A: 2000,
    B: 1000,
    C: 500,
  };

  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow[row]; i++) {
      seatsData.push({
        eventId: event.id,
        seatCode: `${row === 'A' ? 'VIP' : 'REG'}-${row}${i}`,
        price: pricePerRow[row],
        status: 'AVAILABLE',
      });
    }
  }

  const createSeats = await prisma.seat.createMany({
    data: seatsData,
  });

  console.log(`${createSeats.count} seats created.`);

  await prisma.seat.update({
    where: {
      eventId_seatCode: { eventId: event.id, seatCode: 'VIP-A1' },
    },
    data: { status: 'PENDING' },
  });

  console.log('Complete inserting!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
