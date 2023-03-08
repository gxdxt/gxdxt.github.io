---
layout  : wiki
title   : Point-Free TCA ep.1
summary : 
date    : 2023-03-08 20:07:30 +0900
updated : 2023-03-08 20:08:38 +0900
tags    : tca
toc     : true
public  : true
parent  : [[root-index/tca]]
latex   : false
---
* TOC
{:toc}

# Introduction

## Composable

- It comes with a few basic operators that allows us to build many small features with the architecture, and then pull them back and combine them to form one big feature. This was instrumental in our work to break down a large, complex feature into many smaller, simpler features.
- we showed that we could embrace the compositional operators we developed in order to fully [modularize](https://www.pointfree.co/collections/composable-architecture/modularity) our app.
	- Reducers
	- View State
	- View Actions
	- The Point
- we introduced [side effects](https://www.pointfree.co/collections/composable-architecture/side-effects) to the architecture
	- Synchronous Effect
	- Unidirectional Effect
	- Asynchronous Effect
	- The Point
	- The Combine Framework and Effects
- we showed [how to test](https://www.pointfree.co/collections/composable-architecture/testing) the composable architecture.
	- Reducers
	- Effects
	- Ergonomics
	- The Point

> 3:14 오타?
> We even got some extra exhaustivity checking with effects because the assertion helper forced us to to declare every effect output that was fed back into the system.

- we also showed that the Composable Architecture has a strong opinion on how [dependencies](https://www.pointfree.co/episodes/ep91-dependency-injection-made-composable) are managed.
	- Dependency Injection
- we showed how to make the Composable Architecture more [adaptable](https://www.pointfree.co/collections/composable-architecture/adaptation), so that we could build the core business logic in a fully agnostic manner, while then allowing views to adapt that logic to the domain that makes the most sense for them.



# Getting started

## Import the package
- `https://github.com/pointfreeco/swift-composable-architecture`

## State
- define the state our feature needs to do its job
- The state is typically a struct because it holds a bunch of independent pieces of data, though it does not always need to be a struct.
```swift
struct AppState {
	
}
```

## Action
- define the actions that can take place in our feature
- The actions are typically an enum because it represents one of many different types of actions that a user can perform in the UI, such as tapping a button or entering text into a text field.
```swift
enum AppAction {
	
}
```

## Environment
- define the environment of dependencies that our feature needs to perform effectful work
- The environment is pretty much always a struct, because it holds all of the dependencies our feature needs to do its job, such as API clients, analytics clients, date initializers, schedulers, and more.
```swift
struct AppEnvironment {
	
}
```

## Reducer
- the thing that glues together the state, action and environment into a cohesive package.
- It’s the thing responsible for the business logic that runs the application.
- Creating one for our domain involves providing a closure that is handed the current state, an incoming action, and the environment
```swift
let appReducer = Reducer<AppState, AppAction, AppEnvironment> { state, action, environment in }
```
- In this closure is where we will put all of the logic for our application. We do this by switching over the action:
```swift
let appReducer = Reducer<AppState, AppAction, AppEnvironment> { state, action, environment in
  switch action {
  }
}
```

- we would consider each case in the `AppAction` enum, and for each case we would run the business logic related to that action.
	- business logic we mean something very specific.
- the only two things you are allowed to do in a reducer
	- We will make any mutations to the state necessary for the action.
		- The `state` value passed in here is an `inout` argument. So when an action comes in, say the user tapping the todo checkbox, we can just go into the state and mutate a todo’s `isComplete` field to be `true`.
	- you have performed all of the mutations you want to state, you can return an effect.
		- An effect is a special type that allows you to communicate with the outside world, like executing an API request, writing data to disk, or tracking analytics, and it allows you to feed data from the outside world back into this reducer.
- All the pure logic happens in the state mutations, and all the non-pure logic happens in the effects.

## Store
- The object that does this in the Composable Architecture is known as the `Store`, and each view powered by the Composable Architecture will need to hold onto one of these.
```swift
struct ContentView: View {
  let store: Store<AppState, AppAction>

  var body: some View {
    Text("Hello, World!")
  }
}
```

- To create a store we need the initial state of the application
- the reducer that powers the business logic
- the environment that the store is running in
```swift
struct ContentView_Previews: PreviewProvider {
	static var previews: some View {
	    ContentView(
			store: Store(
				initialState: AppState(),
				reducer: appReducer,
				environment: AppEnvironment()
			)
		)
	}
}
```

## Domain Model

```swift
struct Todo {
  var description = ""
  var isComplete = false
}
```

- our app state should hold an array of these models:
```swift
struct AppState {
  var todos: [Todo] = []
}
```

- we should be able to get something on the screen that is rendered from this state
```swift
List {
  ForEach(self.store.state.todos) { todo in
    Text("Hello")
  }
  Text("Hello")
}
```

## ViewStore

- However, the store does not directly give you access to the state. we require you to go through a secondary object to get access to state, called the `ViewStore`. We did this for 2 primary reasons:
	- the `ViewStore` gave us the opportunity to chisel away the state that the view doesn’t access need access to in order to render its UI.
	- the `ViewStore` allowed us to adapt our features to multiple platforms
		- We could implement the core logic of our feature a single time in the reducer, and then we could form projections of the general business domain into specific domains that make more sense for a platform.

- Previous
	- Previously to use a view store you would add a field to your view to hold the view store and make it an `@ObservedObject`. 
- Present
	- Instead, now you just create a new special view that gives you access to a view store:
```swift
struct ContentView: View {
	let store: Store<AppState, AppAction>
	
	var body: some View {
		NavigationView {
			WithViewStore(self.store) { viewStore in
			 …
			}
		}
	}
}
```

> in order for the view store to know how to deduplicate emissions of state, we should make our state structs `Equatable`.

```swift
struct Todo: Equatable {
  var description = ""
  var isComplete = false
}

struct AppState: Equatable {
  var todos: [Todo]
}
```

> Equatable
> : A type that can be compared for value equality.

```swift
var body: some View {
  NavigationView {
    WithViewStore(self.store) { viewStore in
      List {
        ForEach(viewStore.state.todos) { todo in
          Text("Hello")
        }
        Text("Hello")
      }
      .navigationBarTitle("Todos")
    }
  }
}
```



# Setting up basic infrastructure

# Implementing todo functionality

# Debugging

- Reducer.debug()



***

# Trouble

- Cannot convert value of type 'AppEnvironment' to expected argument type 'Void'
	- AppEnvironment 객체를 초기화 하니, 해당 에러 발생
	- 시연하는 영상에선 해당 오류가 발생하지 않았다.
	- solved
		- 어차피 Void를 요구하니 `{}()`로 변경했다.

- ToDo와 AppState에 Equatable Protocol를 채택한 이유
	- inside here we will have access to all the state in the store and we can send it actions, but in order for the view store to know how to deduplicate emissions of state, we should make our state structs `Equatable`.

- ForEach 안에 enumerated()를 Array로 convert한 이유
	- This is technically not the most correct way to do this. It would be more correct, and more verbose, to zip the `todos` array with its indices collection. In this case we are safe because we are dealing with a simple 0-based index array, but if we were doing this in production we should probably `zip`-based approach.
	- which is that the collection returned by `enumerated()` is not a `RandomAccessCollection`, which `ForEach` requires, and its elements are not `Identifiable`.
		- ForEach를 사용하기 위해선 해당 객체가 RandomAccessCollection이여야 하기 때문에

