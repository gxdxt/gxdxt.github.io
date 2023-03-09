---
layout  : wiki
title   : TCA episode 2
summary : 
date    : 2023-03-09 13:15:40 +0900
updated : 2023-03-09 13:44:49 +0900
tags    : 
toc     : true
public  : true
parent  : [[tca]]
latex   : false
---
* TOC
{:toc}

# Collections of Domain
- Right now we’re doing a lot of index juggling. Let’s see what the Composable Architecture gives us to simplify that
- Present
	- handling those actions in the reducer we are going to repeatedly bind the `index` from the action and subscript into `state.todos`.
```swift
enum AppAction {
  case todoCheckboxTapped(index: Int)
  case todoTextFieldChanged(index: Int, text: String)
}

let appReducer = Reducer<AppState, AppAction, AppEnvironment> { state, action, _ in
  switch action {
  case let .todoCheckboxTapped(index: index):
    state.todos[index].isComplete.toggle()
    return .none

  case let .todoTextFieldChanged(index: index, text: text):
    state.todos[index].description = text
    return .none
  }
}
```
- With TCA
- Action (TodoAction)
	- we could write a reducer that focuses only on the domain of a single todo.
		- Well, the Composable Architecture absolutely supports this use case, and it’s called the `forEach` operator. What we can do is define a new domain for just the todo row, starting with the actions that can be performed
```swift
enum TodoAction {
  case checkboxTapped
  case textFieldChanged(String)
}
```
- Environment
	- We also need an environment to hold all of this feature’s dependencies
```swift
struct TodoEnvironment {}
```

- Reducer (todoReducer)
	- a reducer that operates on just a single todo and just with `TodoAction`s, which means we don’t have to do any index subscripting
```swift
let todoReducer = Reducer<Todo, TodoAction, TodoEnvironment> { state, action, _ in
  switch action {
  case .checkboxTapped:
    state.isComplete.toggle()
    return .none

  case .textFieldChanged(let text):
    state.description = text
    return .none
  }
}
```

- Action (AppAction)
	- Next we adapt the app’s domain so that it works with a `TodoAction` at a particular index instead of spelling out each individual action
```swift
enum AppAction {
  case todo(index: Int, action: TodoAction)
}
```

- Reducer (appReducer)
	- The core idea of this function is that it wants to transform the `todoReducer` that only knows about a small piece of domain, in particular a single todo, into a reducer that knows about a much more complicated domain, in particular a whole collection of todos.
```swift
let appReducer = todoReducer.forEach(
  state: WritableKeyPath<GlobalState, MutableCollection>,
  action: CasePath<GlobalAction, (Comparable, TodoAction)>,
  environment: (GlobalEnvironment) -> TodoEnvironment
)
```


- In order to do this you have to hand `forEach` a transformation for each of the domain constituents: a state transformation that goes from some global state to a collection of todos, an action transformation that goes from some global action into a pair of index and local todo action, and then finally an environment transformation that turns the global environment into the local todo environment.

> Key Path
> : For state the transformation takes the form of a writable key path, because we want to be able to pluck out the collection from the global state, mutate any element in that collection, and then plug the whole collection back into the global state.

- the `state` key path just needs to pluck out the `todos` field from the `AppState`
```swift
todoReducer.forEach(
  state: \AppState.todos,
  action: `CasePath<GlobalAction, (Comparable, TodoAction)>`,
  environment: `(GlobalEnvironment) -> TodoEnvironment`
)
```

- an `action` case path that can extract out an index and todo action from the `AppAction`.
```swift
todoReducer.forEach(
  state: \AppState.todos,
  action: /AppAction.todo(index:action:),
  environment: `(GlobalEnvironment) -> TodoEnvironment`
)
```

- transform the global environment into the todo environment.
```swift
let appReducer: Reducer<AppState, AppAction, AppEnvironment> = todoReducer.indexed(
  state: \.todos,
  action: /AppAction.todo(index:action:),
  environment: { _ in TodoEnvironment() }
)
```

> Reducer.forEach <- Deprecated
> ForEachStore <- Deprecated

```swift
ForEachStore (
	self.store.scope (
		state: { $0.todos }
		action: { AppAction.todo(index: $0, action: $1) }
	)
) { todoStore in
	
}
```

> 결국 simplify -> indices를 ToDo Domain에서 제거 (== 해당 도메인에 집중할 수 있게 하는 것)

- scope
	- The Composable Architecture comes with an operator that performs this transformation, and it’s called `scope`. It allows us to transform stores that operate on global domains into stores that operate on smaller, local domains. And we do this by specifying two transform functions
	- The first function describes how we want to transform the global state into local state, and that is to simply pluck out the array of `todos` from the app state
	- The second function describes how to transform the local action into the global action. Notice that it goes in the opposite direction as we did for state.
		- we need wrap everything in a `WithViewStore` so that we can actually observe changes to this store.

- All of the views being constructed are working with very simple domains.

# Adding todos

- combine


# Writing our first test

- problem
	- something isn’t quite right with our reducer. We are currently plucking a random `UUID` out of thin air by calling its initializer. To see why this is problematic, let’s try writing some tests.
		- how to test the reducers in isolation
