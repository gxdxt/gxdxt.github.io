---
layout  : wiki
title   : ViewBuilder, 누구인가?
summary : 
date    : 2023-01-24 23:22:11 +0900
updated : 2023-01-24 23:23:27 +0900
tags    : #ViewBuilder
toc     : true
public  : true
parent  : 
latex   : false
---
* TOC
{:toc}

# ViewBuilder
## What

> A custom parameter attribute that constructs views from closures.

## How

- usage in parameters

```swift
HStack {
	Text("Hi")
	Text("There")
}
```

원래 형태
```swift
// HStack(content: () -> Content)
HStack(content: Group{Text("Hi")Text("There")})
```

@ViewBuilder는 `closures`를 통해 View를 생성할 수 있도록 하는 것

```swift
struct CustomHStack<Content:View>: View {
	let content: Content // 먼저 Generic으로 선언
		
	init(@ViewBuilder content: () -> View) { // 이렇게 생성자를 선언하면, closure를 받을 수 있다.
		self.content = content
	}
	var body: some View {
		HStack {
			content
		}
	}
}
```

```swift
CustomHStack {
	Text("Hi")
	There("There")
}
```


- usage in variables

```swift
var body: some View {
	VStack {
		headerSection
	}
}
```

```swift
private var headerSection: some View {
	switch type {
	case .one:
		viewOne
	case .two:
		viewTwo
	case .three:
		viewThree
	}
}
```

이렇게 쓰면, 

> Function declares an opaque return type, but has no return statements in its body from which to infer an underlying type

이라는 에러 문구가 나타난다.
원인은, headerSection이라는 some View가 생성될 때마다 서로 다른 뷰들이 return이 되기 때문이다.
이를 해결하기 위해서는 Stack 같은 곳에 뷰들을 넣어주면 된다.

```swift
private var headerSection: some View {
	HStack {
		switch type {
		case .one:
			viewOne
		case .two:
			viewTwo
		case .three:
			viewThree
		}
	}
}
```

이렇게 코드를 짜면, headerSection은 HStack 안에 들어가는 요소들은 다르지만, 항상 HStack이라는 some View를 return 해주기 때문에 오류가 해결된다.
(그 이유는, HStack은 parameter로 ViewBuilder를 받기 때문이다.)

하지만, 우리가 Stack 안에 안넣고 switch 문만 가져가고 싶을 땐 어떻게 해야할까?

```swift
@ViewBuilder private var headerSection: some View {
	HStack {
		switch type {
		case .one:
			viewOne
		case .two:
			viewTwo
		case .three:
			viewThree
		}
	}
}
```

이렇게 코드를 작성하면, some View 뒤에 붙은 것들이 `closure`로 쓰이게 된다.




## What is actually doing

## Custom

***

- font(.largeTitle)
- fontWeight(.semibold)
- .font(.callout)
- RoundedRectangle(cornerRadius: 5) 
