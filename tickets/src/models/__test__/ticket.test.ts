import { Ticket } from '../ticket';

it(' OOC working as expected!', async () => {
    const ticket = Ticket.build({
        title: 'something',
        price: 5,
        userId: '123',
    })
    await ticket.save();
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({price: 10});
    secondInstance!.set({price: 20});

    await firstInstance!.save();

    await secondInstance!.save();
})

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'something',
        price: 5,
        userId: '123',
    })
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})