import { Ticket } from "../ticket";

it("save handles concurency requests", async () => {
  const ticket = Ticket.build({
    title: "footbal",
    price: 50,
    userId: "test",
  });
  await ticket.save();

  const firstTicketInstance = await Ticket.findById(ticket.id);
  const secondTicketInstance = await Ticket.findById(ticket.id);

  firstTicketInstance?.set("price", 100);
  secondTicketInstance?.set("price", 200);

  await firstTicketInstance!.save();

  const errMessage = `No matching document found for id "${ticket.id}" version 0 modifiedPaths "price"`;
  expect(async () => {
    await secondTicketInstance!.save();
  }).rejects.toThrow(errMessage);
});

it("increases version on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "footbal",
    price: 50,
    userId: "test",
  });

  await ticket.save();
  expect(ticket.version).toBe(0);

  await ticket.set("price", 100).save();
  expect(ticket.version).toBe(1);

  await ticket.set("price", 200).save();
  expect(ticket.version).toBe(2);
});
