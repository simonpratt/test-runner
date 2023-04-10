## Usage

### Round Robin Mode

Define the types for your queue
```ts
type EventTypeDefinition = {
  'KEY.A': { a: number},
  'KEY.B': { b: number},
}
```

Create the instance using your type definition
```ts
const roundRobin = new RabbitMqRoundRobin<EventTypeDefinition>('exchange-01', 'queue-01', 'KEY.#');
```

Subscribe to specific events
```ts
roundRobin.subscribe('KEY.A', (message) => console.log(message.a));
```

### Topic Mode

Define the types for your queue
```ts
type EventTypeDefinition = {
  'KEY.A': { a: number},
  'KEY.B': { b: number},
}
```

Create the instance using your type definition.
For each consumer that you want in parallel and receiving the same messages, you should make a new topic instance
```ts
const topic = new RabbitMqTopic<EventTypeDefinition>('exchange-01', 'KEY.#');
```

Subscribe to specific events
```ts
roundRobin.subscribe('KEY.A', (message) => console.log(message.a));
roundRobin.subscribe('KEY.B', (message) => console.log(message.b));
```