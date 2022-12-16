#---
layout  : post
title   : Opaque Type 
summary : 명확한 프로그래밍에 애매한 타입?! 
date    : 2022-12-04 18:00:40 +0900
tag     : study swift type 
resource: 38/90F574-7578-4942-B299-A6D54199006F
toc     : true
comment : true
public  : true
parent  : [[index]]
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

***


`some` 이 무엇인지 알아보기 위해, 구글에 검색을 해보면 Swift에서 이를 `opaque type` 이라고 정의하는 것을 쉽게 알 수 있습니다.
그렇다면 이 `opaque type`에 대해 Apple 에서 무엇이라 정의하는지 먼저 알아보도록 하겠습니다.

- Instead of providing a concrete type as the function’s return type, the return value is described in terms of the protocols it supports.
