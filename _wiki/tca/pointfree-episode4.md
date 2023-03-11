---
layout  : wiki
title   : Point-Free TCA ep.4
summary : 
date    : 2023-03-11 13:15:33 +0900
updated : 2023-03-11 13:16:08 +0900
tags    : 
toc     : true
public  : true
parent  : [[/tca]]
latex   : false
---
* TOC
{:toc}

# Test

## Sort Test

- Because of the Effect which is still running, the test will fail.

> An effect returned for this action is still running. It must complete before the end of the test. …

- The only way to make that happen is to literally have the test suite wait for a second. The `assert` method supports inserting little imperative tasks like that in between steps, and it’s called a `do` block

```swift
store.assert(
			.send(.todo(index: 0, action: .checkboxTapped)) {
				(...)
			},
			.do {
				// Do any imperative work
			}
		)
```

```swift
.do {
	// Do any imperative work
	_ = XCTWaiter.wait(for: [self.expectation(description: "wait")], timeout: 1)
}
```

- Now if we run tests we get a new failure:

> failed - Received 1 unexpected action: … Unhandled actions: 
> \[ AppAction.todoDelayCompleted, \]

- to prove that we expected to receive this action we need to add an additional step to our assertion

```swift
.do {
	// Do any imperative work
	_ = XCTWaiter.wait(for: [self.expectation(description: "wait")], timeout: 1)
},
.receive(.todoDelayCompleted)
```

- Now we can see the logic properly
- For this, we add the closure.

```swift
.receive(.todoDelayCompleted) {
	$0.todos.swapAt(0, 1)
}
```

## Complete ToDo

- same as the upper case, we need to add the `.do` thing

```swift
store.assert(
	.send(.todo(index: 0, action: .checkboxTapped)) {
		// make the mutations we expect to happen to the value passed to the closure.
		$0.todos[0].isComplete = true
	},
	.do {
		// Do any imperative work
		_ = XCTWaiter.wait(for: [self.expectation(description: "wait")], timeout: 1)
	}
)
```

- And then, we can face the error message:

> testCompletingTodo(): The store received 1 unexpected action after this one: …
	Unhandled actions: \[
	  [0]: .todoDelayCompleted
	\]

- the solution is the same, too.

```swift		
store.assert(
	.send(.todo(index: 0, action: .checkboxTapped)) {
		// make the mutations we expect to happen to the value passed to the closure.
		$0.todos[0].isComplete = true
	},
	.do {
		// Do any imperative work
		_ = XCTWaiter.wait(for: [self.expectation(description: "wait")], timeout: 1)
	},
	.receive(.todoDelayCompleted)
)
```

## Cancellation

- Paste the test function of sorting
- We want to test the cancellation, so we need to tap the checkbox twice.

```swift
store.assert(
			.send(.todo(index: 0, action: .checkboxTapped)) {
				$0.todos[0].isComplete = true
			},
			.do {
				// Do any imperative work
				_ = XCTWaiter.wait(for: [self.expectation(description: "wait")], timeout: 0.5)
			},
			.send(.todo(index: 0, action: .checkboxTapped)) {
				$0.todos[0].isComplete = false
			},
			.do {
				// Do any imperative work
				_ = XCTWaiter.wait(for: [self.expectation(description: "wait")], timeout: 1)
			},
			.receive(.todoDelayCompleted)
		)
```

  
# Debounce

- The combination of delaying an effect and cancelling inflight effects when starting a new one has a name that is well-known in the reactive programming communities: it’s called debounce.

```swift
case .todo(index: _, action: .checkboxTapped):
	struct CancelDelayId: Hashable {}
	return Effect(value: AppAction.todoDelayCompleted)
		.delay(for: 1, scheduler: DispatchQueue.main)
		.eraseToEffect()
		.cancellable(id: CancelDelayId(), cancelInFlight: true)
```

- This code can be simplified in 1 line.

```swift
case .todo(index: _, action: .checkboxTapped):
	struct CancelDelayId: Hashable {}
	return Effect(value: AppAction.todoDelayCompleted)
		.debounce(id: CancelDelayId(), for: 1, scheduler: DispatchQueue.main)
```

- There are also other type of `debounce` which hasn't the `id` as a parameter.

## The Reason why debouncing is problematic

- It takes 3.5 seconds to running the test

> **Test Suite 'TCA_ToDoListTests' passed at 2023-03-10 15:23:10.790.**
> **Executed 4 tests, with 0 failures (0 unexpected) in 3.532 (3.536) seconds**

- That means 99.5% of the test suite time is spent waiting. Worse, if we have dozens or hundreds of these tests that time could easily add up to minutes of wasted time.

- So we need the tool for `time controlling`
- Before using this tool, we need to know well about the Scheduler in Combine

- `Scheduler` is a protocol in the Combine framework, and it represents a type that can describe when and how to execute a closure. Many types that ship with Foundation conform to this protocol because they can also schedule work, for example `DispatchQueue`, `RunLoop` and `OperationQueue`.

```swift
DispatchQueue.main.schedule {
  print("DispatchQueue")
}
```

```swift
DispatchQueue.main.schedule(after: .init(.now() + 1)) {
  print("DispatchQueue", "delayed")
}
```

- We can use `.asyncAfter` instead of `.schedule`, btw

```swift
var cancellables: Set<AnyCancellable> = []

OperationQueue.main.schedule(after: .init(Date()), interval: 1) {
  print("OperationQueue", "timer")
}.store(in: &cancellables)
```

> DispatchQueue -> now()
> RunLoop -> Date()
> OperationQueue -> Date()

- The `Scheduler` protocol is the way Combine abstracts away the responsibility of when and how to execute a unit of work. Any Combine operator that involves time or threading takes a scheduler as an argument, including delaying, throttling, timeouts, debouncing, and more:

- Here is the operators that have the Scheduler as a parameter.
```swift
Just(1)
  .receive(on: Scheduler)
  .subscribe(on: Scheduler)
  .timeout(SchedulerTimeIntervalConvertible & Comparable & SignedNumeric, scheduler: Scheduler)
  .throttle(for: SchedulerTimeIntervalConvertible & Comparable & SignedNumeric, scheduler: Scheduler, latest: Bool)
  .debounce(for: SchedulerTimeIntervalConvertible & Comparable & SignedNumeric, scheduler: Scheduler)
  .delay(for: SchedulerTimeIntervalConvertible & Comparable & SignedNumeric, scheduler: Scheduler)
```

- Anytime we use a `DispatchQueue`, `RunLoop` or `OperationQueue` we are hopelessly in the realm of the real world, with all of its complexities and vagaries, and we have no way to control the scheduler except for literally waiting for time to pass.

## TestScheduler

```swift
let scheduler = DispatchQueue.testScheduler
```

```swift
scheduler.schedule {
  print("TestScheduler")
}
```

- Nothing will be printed until the code below is added.

```swift
scheduler.advance()
```

- The Upper code will be changed too.
- Previous
```swift
scheduler.schedule(after: init(.now() + 1)) {
  print("TestScheduler", "delayed")
}
```

- Present
```swift
scheduler.schedule(after: scheduler.now.advanced(by: 1)) {
  print("TestScheduler", "delayed")
}
```

- We can control the time like this:
```swift
scheduler.advance(by: 1)
```

- We can do it in Timer too
```swift
scheduler.schedule(after: scheduler.now, interval: 1) {
  print("TestScheduler", "delayed")
}

scheduler.advance()
scheduler.advance(by: 1000) // the 1000 lines will be printed
```

- the use of `DispatchQueue.main` in our reducer is an unintended side-effect, and it must be controlled. This means we need to move it to be a dependency in our environment just like the `UUID` function.

```swift
struct AppEnvironment {
  var mainQueue: ???
  var uuid: () -> UUID
}
```

- ??? wouldn't be `DispatchQueue`
	- Because then we couldn’t substitute in a test scheduler when we are in tests.
- ??? wouldn't be `Scheduler`
	- because the protocol has associated types.
> 🛑 Protocol ‘Scheduler’ can only be used as a generic constraint because it has Self or associated type requirements

- ??? wouldn't be like this:
```swift
var mainQueue: Scheduler where .SchedulerTimeType == DispatchQueue.SchedulerTimeType, .SchedulerOptions == DispatchQueue.SchedulerOptions
```
- until now,,,,

- so we have to turn to `a more ad hoc solution`.
- We need one of those “Any” type erasers for the `Scheduler` protocol. The standard library and various frameworks from Apple has multiple type erased wrappers, such as:
```swift
// AnyHashable
// AnyIterator
// AnyCollection
// AnySubscriber
// AnyCancellable
// AnyPublisher
// AnyView
```
- You use them in places where you’d like to be able to use the bare protocol.

```swift
var mainQueue: AnyScheduler<DispatchQueue.SchedulerTimeType, DispatchQueue.SchedulerOptions>
```
- this code is too verbose, so

```swift
var mainQueue: AnySchedulerOf<DispatchQueue>
```

```swift
case .todo(index: _, action: .checkboxTapped):
	struct CancelDelayId: Hashable {}
	return Effect(value: AppAction.todoDelayCompleted)
		.debounce(id: CancelDelayId(), for: 1, scheduler: environment.mainQueue)
```

- We need to match the type, so we use `.eraseToAnyScheduler()` in the real App
```swift
environment: AppEnvironment(
	mainQueue: DispatchQueue.main.eraseToAnyScheduler(),
	uuid: UUID.init
)
```

- We will use the different Scheduler in the Test Suite.
```swift
environment: AppEnvironment(
	mainQueue: DispatchQueue.testScheduler.eraseToAnyScheduler(),
	uuid: { fatalError("unimplemented") }
)
```

- But when we use `.eraseToAnyScheduler()`,  this erase all the info that we had that identified it as a `TestScheduler`.
	- We don't have access to anything that allows us need to advance time on this test scheduler.
- So we store this in our scheduler variable.
```swift
let scheduler = DispatchQueue.testScheduler
```

```swift
//_ = XCTWaiter.wait(for: [self.expectation(description: "wait")], timeout: 0.5)
self.scheduler.advance(by: 0.5)
```

- Now, Check the test suite time!

> **Test Suite 'TCA_ToDoListTests' passed at 2023-03-10 16:26:37.384.**
> **Executed 4 tests, with 0 failures (0 unexpected) in 0.036 (0.042) seconds**
