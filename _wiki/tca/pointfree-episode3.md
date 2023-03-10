---
layout  : wiki
title   : Point-Free TCA ep.3
summary : 
date    : 2023-03-10 14:45:31 +0900
updated : 2023-03-10 14:46:12 +0900
tags    : 
toc     : true
public  : true
parent  : [[tca]]
latex   : false
---
* TOC
{:toc}

- We are currently plucking a random `UUID` out of thin air by calling its initializer.
- Problems
	- we discussed how to test the reducers in isolation.
- showed how to test the second responsibility of the reducers: the side effects.
- We showed how to marry the reducer testing and the effect testing into one cohesive, ergonomic package.

# Test

- AppState is already conform 'Equatable' Protocol, AppAction needs to conform that too.

> the `TestStore` requires both the state and the actions of our domain to be equatable so that we can properly assert on how the system evolves.

> `assert` is deprecated

- testAddTodo
	- UUID에 대한 Test 불가
		- Environment 이용 - Dependency Injection

```swift
struct AppEnvironment {
	// for the test
	var uuid: () -> UUID
}
```

```swift
let appReducer = AnyReducer<AppState, AppAction, AppEnvironment>.combine(
	todoReducer.forEach(
		state: \AppState.todos, // Key Path skip the function
		action: /AppAction.todo(index:action:),
		environment: { _ in TodoEnvironment() }
	),
	AnyReducer { state, action, environment in
		switch action {
		case .todo(index: let index, action: let action):
			return .none
		case .addButtonTapped:
			state.todos.insert(Todo(id: environment.uuid()), at: 0)
			return .none
		}
	}
)
	.debug()
```

- in the preview
```swift
environment: AppEnvironment(
		uuid: UUID.init
	)
```

- in the scene delegate
```swift
environment: AppEnvironment(
		uuid: UUID.init
	)
```

- in the test
```swift
func testAddTodo() {
		let store = TestStore(
			initialState: AppState(),
			reducer: appReducer,
			environment: AppEnvironment(
				uuid: { UUID(uuidString: "DEADBEEF-DEAD-BEEF-DEAD-DEADBEEFDEAD")! }
			)
		)

		store.assert(
			.send(.addButtonTapped) {
				$0.todos = [
					Todo(
						description: "",
						id: UUID(uuidString: "DEADBEEF-DEAD-BEEF-DEAD-DEADBEEFDEAD")!,
						isComplete: false
					)
				]
			}
		)
	}
```

# Feature

## Sort when the todo is completed

- Couldn't do this job, in the `TodoReducer`
```swift
let appReducer = AnyReducer<AppState, AppAction, AppEnvironment>.combine(
	todoReducer.forEach(
		state: \AppState.todos, // Key Path skip the function
		action: /AppAction.todo(index:action:),
		environment: { _ in TodoEnvironment() }
	),
	AnyReducer { state, action, environment in
		switch action {

		case .todo(index: _, action: .checkboxTapped): // switch여서 순서도 중요하다.
			// naive way -> We couldn't guarantee that they are shuffled in their own group.
//			state.todos.sort { lhs, rhs in
//				!lhs.isComplete && rhs.isComplete
//			}
			state.todos = state.todos
				.enumerated()
				.sorted { lhs, rhs in
					(!lhs.element.isComplete && rhs.element.isComplete)
					|| lhs.offset < rhs.offset
				}
				//.map { $0.element } // pluck out the offset
				.map(\.element) // using a key path
			return .none
		case .addButtonTapped:
			state.todos.insert(Todo(id: environment.uuid()), at: 0)
			return .none
		case .todo(index: let index, action: let action):
			return .none
		}
	}
)
	.debug()
```

## Test

```swift
func testTodoSorting() {
	let store = TestStore(
		initialState: AppState(
			todos: [
				Todo(
					description: "Milk",
					id: UUID(uuidString: "00000000-0000-0000-0000-000000000000")!,
					isComplete: false
				),
				Todo(
					description: "Eggs",
					id: UUID(uuidString: "00000000-0000-0000-0000-000000000001")!,
					isComplete: false
				)
			]
		),
		reducer: appReducer,
		environment: AppEnvironment(
			uuid: { fatalError("unimplemented") } // leave this bc the dependency needs to be called
		)
	)
	store.assert(
		.send(.todo(index: 0, action: .checkboxTapped)) {
			$0.todos = [
				Todo(
					description: "Eggs",
					id: UUID(uuidString: "00000000-0000-0000-0000-000000000001")!,
					isComplete: false
				),
				Todo(
					description: "Milk",
					id: UUID(uuidString: "00000000-0000-0000-0000-000000000000")!,
					isComplete: true
				)

			]
		}
	)
}
```

```swift
	store.assert(
		.send(.todo(index: 0, action: .checkboxTapped)) {
			$0.todos.swapAt(0, 1)
		}
	)
```

```swift
	store.assert(
		.send(.todo(index: 0, action: .checkboxTapped)) {
			$0.todos = [
				$0.todos[1],
				$0.todos[0]
			]
		}
	)
```

# Effect

- Delaying the sort
- Since we are involving time here and want to do something outside the lifetime of our reducer being called, we definitely need to use `effects`
- Effects are modeled in the Composable Architecture as Combine publishers that are returned from the reducer. After a reducer finishes its state mutation logic, it can return an effect publisher that will later be run by the store, and any data those effects produce will be fed back into the store so that we can react to it.
- We can’t return just any type of publisher, it has to be the `Effect` type that the library provides. We can still use all of the publishers and operators that Combine gives us, but at the end of the day we gotta convert that publisher to an effect, which is easy to do.

```swift
AnyReducer { state, action, environment in
	switch action {

	case .todo(index: _, action: .checkboxTapped): // switch여서 순서도 중요하다.
		return Effect.fireAndForget {
			// after a second, and then the codes below will be happened
			
		}
		.delay(for: 1, scheduler: DispatchQueue.main)
		.eraseToEffect()
		
		(...)
}
```

> Escaping closure captures 'inout' parameter 'state'

- Add a new action : `todoDelayCompleted`
```swift
enum AppAction: Equatable {
	case todo(index: Int, action: TodoAction)
	//	case todoCheckboxTapped(index: Int)
	//	case todoTextFieldChanged(index: Int, text: String)
	case addButtonTapped
	case todoDelayCompleted
}
```

- this action are going to return in our effect 
```swift
return Effect(value: AppAction.todoDelayCompleted)
```
- and this line means is that this reducer runs,
- and the store gets this effect,
- it will immediately execute that effect that will produce this value sending it right back into the reducer which we now have to handle down here.
```swift
AnyReducer { state, action, environment in
	switch action {

	case .todo(index: _, action: .checkboxTapped): // switch여서 순서도 중요하다.
		// naive way -> We couldn't guarantee that they are shuffled in their own group.
//			state.todos.sort { lhs, rhs in
//				!lhs.isComplete && rhs.isComplete
//			}
		return Effect(value: AppAction.todoDelayCompleted)

		state.todos = state.todos
			.enumerated()
			.sorted { lhs, rhs in
				(!lhs.element.isComplete && rhs.element.isComplete)
				|| lhs.offset < rhs.offset
			}
			//.map { $0.element } // pluck out the offset
			.map(\.element) // using a key path
		return .none
	case .addButtonTapped:
		state.todos.insert(Todo(id: environment.uuid()), at: 0)
		return .none
	case .todo(index: let index, action: let action):
		return .none
	case .todoDelayCompleted: // <- here
		return .none
	}
```
- and we put the code here
```swift
AnyReducer { state, action, environment in
	switch action {

	case .todo(index: _, action: .checkboxTapped): // switch여서 순서도 중요하다.
		return Effect(value: AppAction.todoDelayCompleted)
	case .addButtonTapped:
		state.todos.insert(Todo(id: environment.uuid()), at: 0)
		return .none
	case .todo(index: let index, action: let action):
		return .none
	case .todoDelayCompleted:
		state.todos = state.todos
			.enumerated()
			.sorted { lhs, rhs in
				(!lhs.element.isComplete && rhs.element.isComplete)
				|| lhs.offset < rhs.offset
			}
			.map(\.element) // using a key path

		return .none
	}
}
```

- to delay the completion, add some operators
```swift
case .todo(index: _, action: .checkboxTapped): // switch여서 순서도 중요하다.
	return Effect(value: AppAction.todoDelayCompleted)
		.delay(for: 1, scheduler: DispatchQueue.main)
		.eraseToEffect()
```

- we should cancel any in-flight delayed effect that might be out there
```swift
case .todo(index: _, action: .checkboxTapped): // switch여서 순서도 중요하다.

	Effect.cancel(id: "completion effect")

	return Effect(value: AppAction.todoDelayCompleted)
		.delay(for: 1, scheduler: DispatchQueue.main)
		.eraseToEffect()
		.cancellable(id: "completion effect")
```

So what we want to do here is first cancel our todo completion effect, and then fire off a new, delayed completion effect.

- Publisher `.concatenate`
```swift
case .todo(index: _, action: .checkboxTapped):
	return .concatenate(
		.cancel(id: "completion effect"), // we could erase the 'Effect' bc it's explicit
		Effect(value: AppAction.todoDelayCompleted)
		.delay(for: 1, scheduler: DispatchQueue.main)
		.eraseToEffect()
		.cancellable(id: "completion effect")
	)
```
- use another `cancellable`
```swift
case .todo(index: _, action: .checkboxTapped):
	return Effect(value: AppAction.todoDelayCompleted)
		.delay(for: 1, scheduler: DispatchQueue.main)
		.eraseToEffect()
		.cancellable(id: "completion effect", cancelInFlight: true)
```

- The problem when using the ID as String
	- if we needed to use this identifier in a few spots of our reducer we would be susceptible to typos, and that could cause subtle bugs. But, even if we extracted this string to a constant to be shared we could accidentally use the same identifier in this reducer that we were using in another reducer. Then we accidentally cancel an effect from another reducer if we happen to use the same identifier.

- then, we can 
	- in Swift, we can define structures in a function
	- no one can access this struct out of this scope.
```swift
case .todo(index: _, action: .checkboxTapped):
	struct CancelDelayId: Hashable {}
	return Effect(value: AppAction.todoDelayCompleted)
		.delay(for: 1, scheduler: DispatchQueue.main)
		.eraseToEffect()
		.cancellable(id: CancelDelayId(), cancelInFlight: true)
```
