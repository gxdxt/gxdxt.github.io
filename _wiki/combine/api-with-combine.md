---
layout  : wiki
title   : Combine을 통해 API 데이터를 불러오자!
summary : Combine + API
date    : 2023-01-27 03:33:31 +0900
updated : 2023-02-04 02:18:08 +0900
tags    : Combine, API
toc     : true
public  : true
parent  : [[/combine]]
latex   : false
---
* TOC
{:toc}

# Combine을 통해 API 통신을 해보자




1. Publisher 생성
- 어떠한 패키지에 대한 매월 정기구독을 가입함
```swift
URLSession.shared.dataTaskPublisher(for: url)
```

2. subscribe publisher을 background Thread로 옮겨줌
- 고객이 주문하면 회사는 패키지를 공장에서 생산함
```swift
.subscribe(on: DispatchQueue.global(qos: .background))
```


3. Main Thread에서 수신함
- 회사는 패키지를 배송하고 고객은 상품을 전달받음
```swift
.receive(on: DispatchQueue.main) // UI가 업데이트 되었다는 의미
```

4. tryMap (data가 있는지 없는지 상태가 좋은지 확인)
- 사용자는 패키지 상자의 상태가 손상되었는지 확인함
```swift
.tryMap { data, response in // 실패 및 오류를 야기할 수 있는 맵
   //some code
}
```
```swift
.tryMap { data, response -> Data in
	guard
		let response = response as? HTTPURLResponse,
		response.statusCode >= 200 && response.statusCode < 300 else {
			throw URLError(URLError.Code)
		}
	   return
}
```

5. decode (데이터를 PostModel로 디코딩)
- 상자를 열고 항목이 올바른지 확인함
```swift
.decode(type: [PostModel].self, decoder: JSONDecoder())
```

6. sink(항목을 앱에 추가한다.)
- 구입한 항목을 사용함!
```swift
.sink { completion in
	print("Completion: \(completion)")
} receiveValue: { returnedPost in
	self.posts = returnedPost // 강한 참조
}
```
```swift
.sink { completion in
	print("Completion: \(completion)")
} receiveValue: { [weak self] returnedPost in
	self?.posts = returnedPost // 약한 참조
}
```


7. store(필요한 경우 구독을 취소함)
- 위 구독은 언제든지 취소가 가능함
```swift
// ViewModel에서 `var cancellables = Set<AnyCancellable>()` 코드 추가
.store(in: &cancellables)
```

## 추상화

- Combine을 통해 API를 호출할 때에는 추상화를 작업하는 것이 좋습니다. url query에 따라서 받아오는 값이 달라지기 때문에 여러 경우의 수를 하나하나 작성해 줄 수 없기 때문입니다. 그렇다면  Combine을 통한 API 추상화에는 어떠한 요소들이 필요한지 알아보도록 하겠습니다.

### Extension

- URLSession
- URLComponents

### Protocol

- APIProtocol
	- url: URLComponents

### Providier

- APIProtocol을 conform하는 Provider

- SearchAPIProvider
	- 
- LookupAPIProvider
	- 

- [ ] Protocol
	- [ ] APIProtocol
	- [ ] URLComponents
- [ ] SearchAPIProvider : APIProtocol
	- [ ] props
		- [ ] url : URLComponents
	- [ ] methods
		- [ ] -> AnyPublisher return하는거 만들고
- [ ] ViewModel
	- [ ] SearchAPIProvider 호출
	- [ ] methods. 쓰면서 동시에 .sink

