---
layout  : post
title   : Opaque Type 
summary : 명확한 프로그래밍에 애매한 타입?! 
date    : 2022-12-04 18:00:40 +0900
tag     : study swift type 
resource: 38/90F574-7578-4942-B299-A6D54199006F
toc     : true
comment : true
public  : true
---
* TOC
{:toc}


# 명확한 프로그래밍 언어에 '불투명한 타입'?

처음 SwiftUI로 프로젝트를 만들면 나타나는 특이한 단어가 있었습니다.
구조체를 의미하는 `struct` 라던가, 변수를 의미하는 `var` 등의 단어는 다른 프로그래밍 언어에서 흔히 볼 수 있는 것들이었지만, `some` 은 그렇지 않았습니다.
모든 게 딱딱 떨어지는 칼 같은 프로그래밍 언어에서 `some`과 같은 단어는 어울리지 않았습니다.
여기서 의문을 느꼈지만 당시에는 구현에만 집중하고 뷰(View)를 구성할 때만 한 번 사용하는 이 `some`의 의미에 관심을 가지지 않았습니다.

그러다 풀리지 않는 문제가 발생했습니다. 하나의 뷰를 Drag 하여 이리 저리 움직이고자 하는데, 그동안 사용하던 Gesture modifier 및 Gesture var로 구현했을 때는 동작하지 않았습니다.


하지만 이를 `some`을 이용해 변수로 만들자, 원하는 바 대로 동작하였습니다.
```swift
    var drag: some Gesture {
        DragGesture()
            .onChanged { value in
                self.hotKeyLoc = value.location
                self.hotKeyColor = .red
            }
            .onEnded { value in
                self.hotKeyColor = .blue
            }
    }
```

> 이후 확인 결과 some이 해당 오류를 해결하는 근본적인 해결책은 아니었습니다,,,

하지만, 앞으로도 자주 쓸 `some` 이기 때문에 무엇인지 알아보도록 하겠습니다!

# Some ?!

`some` 이 무엇인지 알아보기 위해, 구글에 검색을 해보면 Swift에서 이를 `opaque type` 이라고 정의하는 것을 쉽게 알 수 있습니다.
그렇다면 이 `opaque type`에 대해 Apple 에서 무엇이라 정의하는지 먼저 알아보도록 하겠습니다.

- Instead of providing a concrete type as the function’s return type, the return value is described in terms of the protocols it supports.

> opaque type이 concrete type 과 상반된다는 느낌을 받을 수 있었습니다.
> 구체적인 return 타입을 제시하지 않고, 해당 return type 이 채택한 protocol만을 묘사한다.
> 프로그래밍 언어에서 '명확'하고'논리'적인 느낌이 아닌 '불투명한' 이라는 단어를 쓰게될 줄 몰랐는데, Swift에서는 이러한 타입도 존재하는 것이 신기할 따름입니다.

- Hiding type information is useful at boundaries between a module and code that calls into the module, because the underlying type of the return value can remain private.

> 모듈과 이 모듈을 호출하는 코드 사이에 타입 정보를 숨기는 것이 유용하다고 할 수 있는데, 이 숨겨진 타입이 private하게 남겨질 수 있다고 하네요!
> 확실히 와닿진 않지만, 정보의 은닉화와 관련이 있을 것 같기도 하네요!

- An opaque type lets the function implementation pick the type for the value it returns in a way that’s abstracted away from the code that calls the function.

> `opaque type` 은 함수를 구현할 때, 함수를 호출하는 코드에서 추상화된 방법으로 반환값을 위한 타입을 선택할 수 있게 도와준다고 하네요.

아직 이렇게만 설명하면 저 스스로도 무슨 말인지 이해가 잘 안될 것이라 생각합니다.
역시 코드를 가져와서 비교하면서 이해하는 것이 가장 빠르겠죠?

# Usage !!

Swift Docs에서 이야기하는 `Concrete Type`에 대해 먼저 이야기를 해볼까요?!
구체적인 타입이라는 뜻인데, 단순히 저희가 평소에 사용하는 타입을 생각하시면 될 것 같아요.

첫 번째로 일반적인 타입을 생각해 봅시다!

```swift
func sum() -> Int?
```

위의 함수는 return type으로 `Int?` 를 받고 있는 것을 '명확하게' 알 수 있습니다!
물론 위 함수의 인자로 Double을 받으면 Double을 return할 수 있겠지만, 지금은 우리가 이 함수의 return type을 '명확하게' 알고 있다는 것에 집중하자구요!

두 번째로 조금 예외적인 상황이지만 `generic type` 에 대해 생각해 봅시다!

```swift
func max<T>( _ x: T, _ y: T ) -> T where T : Comparable
```

위의 함수는 return type, element type 모두 `T` 로 `generic type`을 받을 수 있도록 선언해 놓았네요!
하지만 조건이 있는 것 같습니다. 바로 `Comparable` 이라는 Protocol을 따르는 타입만 가능한 것입니다.
여기서 `generic type` 특징을 알 수 있습니다.

- 선언할 때에 타입에 대해 밝히지 않을 수 있습니다. 이를 inside에서 private 하다고 칭하겠습니다.
- 해당 함수를 사용하는 코드에서는 타입에 대해 밝혀야 합니다. 이를 outside에서 public 하다고 칭하겠습니다.

이렇게 `generic type`에 대해 자세히 설명한 이유는, 바로 저희가 지금 보고있는 `opaque type`이 바로 `reverse generic type` 이라고 하기 때문입니다.

제가 참고한 [블로그 글](https://medium.com/@PhiJay/whats-this-some-in-swiftui-34e2c126d4c4)에서 다음과 같은 이야기를 합니다.

> Opaque types are the reverse in that the outside world doesn’t exactly know the type of a function’s return value. But inside the function’s implementation, you do know exactly what concrete types you’re dealing with.

- `opaque type`은 outside에서는 해당 함수가 어떤 return type을 반환할지 모르지만, inside에서는 어떤 구체적은 타입을 다룰지 정확히 안다.

조금 더 자세히 알아볼까요?

사실 조금 더 잘 알아보는 건 다음에 하고,
저희가 사용하던 것들에 대한 분석을 해볼게요!

```swift
struct ContentView: View {  
	var body: Text {  
		Text("Hello World")  
	}  
}
```

위의 코드는 저희가 새로운 SwiftUI 프로젝트를 열면 생성되는 코드이죠?
눈썰미가 좋으신 분들은 눈치 채셨겠지만, 저희가 사용하던 코드와 조금 다른 부분이 있는데요.

```swift
struct ContentView: View {  
	var body: some View {  
		Text("Hello World")  
	}  
}
```

위 코드들을 Swift 문법으로 풀어서 한 번 설명 해보겠습니다.
- ContentView라는 구조체는 Protocol View를 따른다.
- ContentView라는 구조체는 body라는 변수의 computed property를 갖는다.
- body라는 computed property는 return value를 정의해야 하는데, 이는 `some View`이다.

Xcode는 왜 저희에게 Default 값으로 `concrete type`의 return type이 아니라, `opaque type`의 return type을 주었을까요?
위의 답을 생각해보기 전에, 반대로 생각해볼까요?
Xcode가 `opaque type` 으로 return type을 주지 않고, `concrete type`만을 받는다면 어떻게 될까요?

우리는 body 안에 View들을 바꿀 때마다, return type을 변경해주어야 할 것입니다.
```swift
VStack {
	Text("Hello World")  
	Image(systemName: "video.fill")  
}
```

위 뷰를 return 해야할 때에는,

```swift
struct ContentView: View {  
	var body: VStack<TupleView<(Text, Image)>> {  
		VStack {
			Text("Hello World")  
			Image(systemName: "video.fill")  
		}
	}  
}
```

body라는 computed property의 return type을 이렇게 변경해야 합니다.

너무 불편하지 않을까요?

`reverse generic type`, 우리는 body 라는 property 안에 어떠한 타입들이 들어올 지 알고 있습니다. 하지만 실제 이 body를 호출하는 코드에서 무엇이 나오질 지는 모릅니다. 이럴 때 저희의 수고로움을 덜어줄 수 있는 것이 바로 이 `opaque type` 입니다.

# End

여기까지 `opaque type`에 대한 저희 정리였습니다.
개발자들을 배려하는 Swift의 배려가 아닐까 하는데요.
불확실성에 대한 조치를 해놓은 언어가 Swift 말고 또 있나 궁금하기도 하네요!

잘못된 정보에 대한 지적은 언제든 환영입니다!

읽어주셔서 감사합니다 :)
